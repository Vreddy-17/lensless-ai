import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Subset

from services.dataset_loader import LenslessDataset
from models.unet import UNet

device = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print("Using device:", device)

full_dataset = LenslessDataset("../dataset/data")

train_dataset = Subset(
    full_dataset,
    range(1000)
)

loader = DataLoader(
    train_dataset,
    batch_size=4,
    shuffle=True,
    num_workers=0
)

print("Demo training samples:", len(train_dataset))
print("Batches per epoch:", len(loader))

model = UNet().to(device)

criterion = nn.MSELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.0001
)

epochs = 2

for epoch in range(epochs):

    model.train()
    total_loss = 0.0

    for batch_index, (lensless, target) in enumerate(loader):

        lensless = lensless.to(device)
        target = target.to(device)

        optimizer.zero_grad()

        output = model(lensless)

        loss = criterion(output, target)

        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        if (batch_index + 1) % 50 == 0:
            print(
                f"Epoch {epoch + 1}/{epochs} | "
                f"Batch {batch_index + 1}/{len(loader)} | "
                f"Loss: {loss.item():.6f}"
            )

    average_loss = total_loss / len(loader)

    print(
        f"Epoch {epoch + 1}/{epochs} | "
        f"Average Loss: {average_loss:.6f}"
    )

torch.save(
    model.state_dict(),
    "lensless_unet.pth"
)

print("\nDEMO MODEL TRAINING COMPLETE")
print("Saved: lensless_unet.pth")
