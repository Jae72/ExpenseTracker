from mindee import Client, PredictResponse, product
from flask import Flask, jsonify, request
from flask_cors import CORS
import io
from PIL import Image

# Initializes a Flask API
app = Flask(__name__)
cors = CORS(app)

# Mindee API key
mindee_client = Client(api_key="32fe46fa770837b3e9e908bf022cb42d")

# app.route will let the frontend know to GET, Fetch and Post
@app.route("/api/receipt", methods=['GET', 'FETCH', 'POST'])
def receipt():
    try:
        
        # Since Mindee does not pull image urls, we will manually request the url from each image and run it through the API
        file = request.args.get('url')
        print("got an image!", file)
        
        # Here the image url gets input and parsed in order to scrape the data
        input_doc = mindee_client.source_from_url(file)
        print("image mindeee")
        result: PredictResponse = mindee_client.parse(product.ReceiptV5, input_doc)
        print("mindee read the image")

        # After inference, each item will be formatted to json form and returned with the name of the item and the price
        mindeeItems = result.document.inference.prediction.line_items
        items = []
        for item in mindeeItems:
            items.append({
                'name': item.description,
                'price': item.total_amount
            })

        # The data pulled from each receipt wil include the total, date, category, items, and store name
        data = {
            "total": result.document.inference.prediction.total_amount.value,
            "date": result.document.inference.prediction.date.value,
            "category": result.document.inference.prediction.category.value,
            "items": items,
            "store": result.document.inference.prediction.supplier_name.value
        }

        # All the data will be returned as a json 
        return jsonify(data)
    
    # Will return any errors or exceptions
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

# Will run on port 8080, and the full url will be: http://localhost:8080/api/receipt?url
if __name__ == "__main__":
    app.run(debug=True, port=8080)