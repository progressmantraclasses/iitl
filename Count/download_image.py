from bing_image_downloader import downloader

# Define search queries
queries = ["crowd of people", "group of people in a park", "busy street with people"]

# Download images
for query in queries:
    downloader.download(query, limit=5, output_dir="people_images", adult_filter_off=True, force_replace=False, timeout=60)

print("✅ Images downloaded successfully! Check the 'people_images' folder.")
