import os
import io
import uuid

import numpy as np
import torch

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from PIL import Image, ImageFilter
from torchvision import transforms

from models.unet import UNet


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Lensless AI Reconstruction API",
    version="1.0.0"
)


# =========================================================
# DIRECTORIES
# =========================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
PROCESSED_DIR = os.path.join(BASE_DIR, "processed")
MEASUREMENT_DIR = os.path.join(BASE_DIR, "measurements")

MODEL_PATH = os.path.join(
    BASE_DIR,
    "lensless_unet.pth"
)

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MEASUREMENT_DIR, exist_ok=True)


# =========================================================
# DEVICE
# =========================================================

DEVICE = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print("AI Device:", DEVICE)


# =========================================================
# LOAD TRAINED MODEL
# =========================================================

model = None

if os.path.exists(MODEL_PATH):

    model = UNet().to(DEVICE)

    model.load_state_dict(
        torch.load(
            MODEL_PATH,
            map_location=DEVICE
        )
    )

    model.eval()

    print("Loaded model:", MODEL_PATH)

else:
    print("WARNING: lensless_unet.pth not found.")


# =========================================================
# TRANSFORM
# =========================================================

transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor()
])


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def root():

    return {
        "message": "Lensless AI Reconstruction API",
        "status": "running"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "device": str(DEVICE),
        "model_loaded": model is not None
    }


# =========================================================
# UPLOAD
# =========================================================

@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...)
):

    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed."
        )

    data = await file.read()

    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Maximum file size is 10 MB."
        )

    try:

        image = Image.open(
            io.BytesIO(data)
        )

        image.verify()

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )

    extension = os.path.splitext(
        file.filename
    )[1].lower()

    filename = (
        uuid.uuid4().hex +
        extension
    )

    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )

    with open(filepath, "wb") as f:
        f.write(data)

    return {
        "message": "Image uploaded successfully",
        "filename": filename
    }


# =========================================================
# PREPROCESS
# =========================================================

@app.post("/preprocess/{filename}")
def preprocess_image(filename: str):

    filepath = os.path.join(
        UPLOAD_DIR,
        filename
    )

    if not os.path.exists(filepath):

        raise HTTPException(
            status_code=404,
            detail="Image not found."
        )

    image = Image.open(
        filepath
    ).convert("RGB")

    original_size = image.size

    image = image.resize(
        (512, 512)
    )

    output_path = os.path.join(
        PROCESSED_DIR,
        f"processed_{os.path.splitext(filename)[0]}.png"
    )

    image.save(
        output_path
    )

    return {
        "message": "Image preprocessed",
        "original_size": original_size,
        "processed_size": [512, 512],
        "path": output_path
    }


# =========================================================
# SIMULATE LENSLESS MEASUREMENT
# =========================================================

@app.post("/simulate/{filename}")
def simulate_lensless(filename: str):

    processed_path = os.path.join(
        PROCESSED_DIR,
        f"processed_{os.path.splitext(filename)[0]}.png"
    )

    if not os.path.exists(processed_path):

        raise HTTPException(
            status_code=404,
            detail="Run preprocessing first."
        )

    image = Image.open(
        processed_path
    ).convert("L")

    image_array = np.asarray(
        image,
        dtype=np.float32
    ) / 255.0

    # Computational optical PSF
    size = 51
    sigma = 8.0

    ax = np.arange(-size // 2 + 1, size // 2 + 1)

    xx, yy = np.meshgrid(ax, ax)

    psf = np.exp(
        -(xx**2 + yy**2) /
        (2 * sigma**2)
    )

    psf /= psf.sum()

    # Optical forward simulation
    image_fft = np.fft.fft2(
        image_array
    )

    psf_fft = np.fft.fft2(
        psf,
        s=image_array.shape
    )

    measurement = np.real(
        np.fft.ifft2(
            image_fft * psf_fft
        )
    )

    # Add simulated sensor noise
    noise = np.random.normal(
        0,
        0.02,
        measurement.shape
    )

    measurement += noise

    measurement = np.clip(
        measurement,
        0,
        1
    )

    measurement_uint8 = (
        measurement * 255
    ).astype(np.uint8)

    output_path = os.path.join(
        MEASUREMENT_DIR,
        f"measurement_{os.path.splitext(filename)[0]}.png"
    )

    Image.fromarray(
        measurement_uint8
    ).save(output_path)

    return {
        "message": "Lensless measurement simulated",
        "measurement_path": output_path,
        "size": [512, 512]
    }


# =========================================================
# AI RECONSTRUCTION
# =========================================================

@app.post("/reconstruct/{filename}")
def reconstruct_image(filename: str):

    if model is None:

        raise HTTPException(
            status_code=500,
            detail="Trained model not found."
        )

    measurement_path = os.path.join(
        MEASUREMENT_DIR,
        f"measurement_{os.path.splitext(filename)[0]}.png"
    )

    if not os.path.exists(measurement_path):

        raise HTTPException(
            status_code=404,
            detail="Lensless measurement not found. Run /simulate first."
        )

    # Load simulated lensless measurement
    image = Image.open(
        measurement_path
    ).convert("RGB")

    # U-Net input
    tensor = transform(
        image
    ).unsqueeze(0).to(DEVICE)

    # AI reconstruction
    with torch.no_grad():

        reconstruction = model(
            tensor
        )

    # Tensor → image
    reconstruction = (
        reconstruction
        .squeeze(0)
        .cpu()
        .clamp(0, 1)
    )

    output_image = transforms.ToPILImage()(
        reconstruction
    )

    # Small refinement
    output_image = output_image.filter(
        ImageFilter.UnsharpMask(
            radius=1,
            percent=80,
            threshold=3
        )
    )

    output_path = os.path.join(
        PROCESSED_DIR,
        f"reconstructed_{os.path.splitext(filename)[0]}.png"
    )

    output_image.save(
        output_path
    )

    return FileResponse(
        output_path,
        media_type="image/png",
        filename="reconstructed.png"
    )
