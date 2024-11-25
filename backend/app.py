from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from model import VideoProcessor
from utils import Dehaze, SaveImage, ProcessVideo
import io
import cv2
import os


app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

video_processor = VideoProcessor(model_path='net/trained_models/its_train.pk')

@app.route("/dehaze", methods=["POST"])
def dehaze():
    try:
        dehaze_type = request.form.get('type')
        model = request.form.get('model')

        if not dehaze_type or not model:
            return jsonify({"error": "Missing parameters. Both 'type' and 'model' are required."})

        if dehaze_type not in ['image', 'video']:
            return jsonify({"error": "Invalid type. Must be 'image' or 'video'."})

        if model not in ['dcp', 'ffa']:
            return jsonify({"error": "Invalid model. Must be 'dcp' or 'ffa'."})

        if dehaze_type == 'image':
            if 'file' not in request.files:
                return jsonify({"error": "No image file provided"})

            image = request.files['file']
            if image.filename == '':
                return jsonify({"error": "No selected image file"})

            file_name = image.filename
            image_path = f"image/{file_name}"
            image.save(image_path)

            try:
                if model == 'dcp':
                    dehaze_image = Dehaze(image_path)
                    SaveImage(dehaze_image)
                    os.remove(image_path)
                    return send_file("./image/image_dehazed.jpg", mimetype="image/jpg")

                elif model == 'ffa':
                    dehazed_image = video_processor.process_image(image_path)
                    cv2.imwrite("./image/image_dehazed.jpg", dehazed_image)
                    os.remove(image_path)
                    return send_file("./image/image_dehazed.jpg", mimetype="image/jpg")

            except Exception as e:
                if os.path.exists(image_path):
                    os.remove(image_path)
                return jsonify({"error": f"Error processing image with {model.upper()}: {str(e)}"})

        elif dehaze_type == 'video':
            if 'file' not in request.files:
                return jsonify({"error": "No video file provided"})

            video = request.files['file']
            if video.filename == '':
                return jsonify({"error": "No selected video file"})

            if model == 'dcp':
                try:
                    temp_input = 'temp_input.mp4'
                    temp_output = 'temp_output.mp4'
                    video.save(temp_input)

                    try:
                        ProcessVideo(temp_input, temp_output)
                    except Exception as e:
                        raise Exception(f"Video processing failed: {str(e)}")

                    if not os.path.exists(temp_output):
                        raise Exception("Output video file was not created")

                    with open(temp_output, 'rb') as f:
                        processed_video = f.read()

                    return send_file(
                        io.BytesIO(processed_video),
                        mimetype="video/mp4",
                        as_attachment=True,
                        download_name="dehazed_video.mp4"
                    )

                except Exception as e:
                    if os.path.exists(temp_input):
                        os.remove(temp_input)
                    if os.path.exists(temp_output):
                        os.remove(temp_output)
                    return jsonify({"error": f"Error processing video with DCP: {str(e)}"})

                finally:
                    # Cleanup
                    if os.path.exists(temp_input):
                        os.remove(temp_input)
                    if os.path.exists(temp_output):
                        os.remove(temp_output)

            elif model == 'ffa':
                try:
                    video_bytes = video.read()
                    processed_video = video_processor.process_video(video_bytes)

                    return send_file(
                        io.BytesIO(processed_video),
                        mimetype="video/mp4",
                        as_attachment=True,
                        download_name="dehazed_video.mp4"
                    )
                except Exception as e:
                    return jsonify({"error": f"Error processing video with FFA: {str(e)}"})

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"})

if __name__ == "__main__":
    app.run(debug=True, port=8000)
