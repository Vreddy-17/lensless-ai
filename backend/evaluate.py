import torch
from torch.utils.data import DataLoader
from services.dataset_loader import LenslessDataset
from models.unet import UNet


device = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print("Using device:", device)


# Load dataset
dataset = LenslessDataset("../dataset/data")

# Evaluate only 32 samples for now
dataset = torch.utils.data.Subset(dataset, range(32))

loader = DataLoader(
    dataset,
    batch_size=4,
    shuffle=False,
    num_workers=0
)


# Load trained model
model = UNet().to(device)

model.load_state_dict(
    torch.load(
        "lensless_unet.pth",
        map_location=device
    )
)

model.eval()


def calculate_psnr(prediction, target):
    mse = torch.mean((prediction - target) ** 2)

    if mse == 0:
        return 100.0

    return 10 * torch.log10(1.0 / mse)


def calculate_ssim(prediction, target):
    c1 = 0.01 ** 2
    c2 = 0.03 ** 2

    mu_x = prediction.mean()
    mu_y = target.mean()

    sigma_x = ((prediction - mu_x) ** 2).mean()
    sigma_y = ((target - mu_y) ** 2).mean()

    sigma_xy = (
        (prediction - mu_x) *
        (target - mu_y)
    ).mean()

    numerator = (
        (2 * mu_x * mu_y + c1) *
        (2 * sigma_xy + c2)
    )

    denominator = (
        (mu_x ** 2 + mu_y ** 2 + c1) *
        (sigma_x + sigma_y + c2)
    )

    return numerator / denominator


total_psnr = 0.0
total_ssim = 0.0
count = 0


with torch.no_grad():

    for lensless, target in loader:

        lensless = lensless.to(device)
        target = target.to(device)

        reconstruction = model(lensless)

        for i in range(len(target)):

            psnr = calculate_psnr(
                reconstruction[i],
                target[i]
            )

            ssim = calculate_ssim(
                reconstruction[i],
                target[i]
            )

            total_psnr += psnr.item()
            total_ssim += ssim.item()

            count += 1


average_psnr = total_psnr / count
average_ssim = total_ssim / count


print()
print("Evaluation samples:", count)
print(f"Average PSNR: {average_psnr:.4f} dB")
print(f"Average SSIM: {average_ssim:.4f}")
