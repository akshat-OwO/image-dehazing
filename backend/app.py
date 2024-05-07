from flask import Flask, request, jsonify, send_from_directory
from utils import Dehaze, SaveImage
app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def hello_world():
    if request.method == "POST":
        image = request.files["image"]

        if (image is None):
            return jsonify({"error": "No image sent!"})

        file_name = image.filename
        image.save(f"image/{file_name}")

        try:
            dehaze_image = Dehaze(f"./image/{file_name}")
            SaveImage(dehaze_image)
            return send_from_directory("image", "image_dehazed.jpg", as_attachment=True)
        except:
            return jsonify({"error": "An error occurred while processing the image!"})

    return jsonify({"message": "Server is running!"})
