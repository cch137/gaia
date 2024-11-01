from pdf2image import convert_from_path
from PIL import Image
import os

if not os.path.exists("outputs"):
    os.mkdir("outputs")

for filename in os.listdir("inputs"):
    if not filename.endswith(".pdf"):
        continue

    images = convert_from_path(f"inputs/{filename}")
    output_dirname = f"outputs/{filename[:-4]}/"

    if not os.path.exists(output_dirname):
        os.mkdir(output_dirname)

    for i in range(len(images)):
        image = images[i]
        scale = 512 / max(image.size)
        if scale < 1:
            image = image.resize((int(image.width * scale), int(image.height * scale)))
        image.save(f"{output_dirname}/page{i}.jpg", "JPEG")
        images[i] = image

    total_height = sum(img.height for img in images)
    max_width = max(img.width for img in images)
    merged_image = Image.new("RGB", (max_width, total_height))

    y_offset = 0
    for image in images:
        merged_image.paste(image, (0, y_offset))
        y_offset += image.height

    merged_image.save(f"{output_dirname}/output.jpg", "JPEG")
