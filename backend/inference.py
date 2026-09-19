import torch
from PIL import Image
from torchvision import transforms
from services.dataset_loader import LenslessDataset
from models.unet import UNet


# Device
device = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print("Using device:", device)


# Load dataset
dataset = LenslessDataset("../dataset/data")

lensless, target = dataset[0]

# Add batch dimension
input_image = lensless.unsqueeze(0).to(device)


# Load trained model
model = UNet().to(device)
model.load_state_dict(
    torch.load(
        "lensless_unet.pth",
        map_location=device
    )
)

model.eval()


# Reconstruction
with torch.no_grad():
    reconstructed = model(input_image)


# Convert tensor → image
reconstructed = reconstructed.squeeze(0).cpu()

reconstructed = transforms.ToPILImage()(reconstructed)

reconstructed.save("reconstructed.png")


print("Input shape:", input_image.shape)
print("Reconstruction shape:", reconstructed.size)
print("Saved: reconstructed.png")
