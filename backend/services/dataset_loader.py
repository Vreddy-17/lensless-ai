import os
import glob
from io import BytesIO

import pandas as pd
import torch
from torch.utils.data import Dataset
from PIL import Image
from torchvision import transforms


class LenslessDataset(Dataset):
    def __init__(self, data_dir):

        self.files = sorted(
            glob.glob(os.path.join(data_dir, "train-*.parquet"))
        )

        if not self.files:
            raise FileNotFoundError(
                f"No training parquet files found in {data_dir}"
            )

        self.dataframes = []
        self.samples = []

        print(f"Found {len(self.files)} parquet files.")

        for file in self.files:
            df = pd.read_parquet(file)

            self.dataframes.append(df)

            for row_index in range(len(df)):
                self.samples.append(
                    (len(self.dataframes) - 1, row_index)
                )

        print(f"Total samples: {len(self.samples)}")

        self.transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
        ])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, index):

        file_index, row_index = self.samples[index]

        row = self.dataframes[file_index].iloc[row_index]

        lensless_image = Image.open(
            BytesIO(row["lensless"]["bytes"])
        ).convert("RGB")

        lensed_image = Image.open(
            BytesIO(row["lensed"]["bytes"])
        ).convert("RGB")

        lensless_image = self.transform(lensless_image)
        lensed_image = self.transform(lensed_image)

        return lensless_image, lensed_image


if __name__ == "__main__":

    dataset = LenslessDataset("../dataset/data")

    lensless, lensed = dataset[0]

    print("Lensless:", lensless.shape)
    print("Lensed:", lensed.shape)
