import os
from bing_image_downloader import downloader

# Create necessary folders
folders = ["images/VIPs", "images/Criminals"]
for folder in folders:
    if not os.path.exists(folder):
        os.makedirs(folder)

print("✅ Folder structure created successfully!")

# Download images
def download_images(query, num_images=5, output_folder="images"):
    downloader.download(query, limit=num_images, output_dir=output_folder, adult_filter_off=True, force_replace=False, timeout=60)

print("📥 Downloading images...")
download_images("Narendra Modi", num_images=5, output_folder="images/VIPs")
download_images("Elon Musk", num_images=5, output_folder="images/VIPs")
download_images("Mukesh Ambani", num_images=5, output_folder="images/VIPs")
download_images("India Most Wanted Criminals", num_images=5, output_folder="images/Criminals")
print("✅ Images downloaded successfully!")
