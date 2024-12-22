import requests
import os
from dotenv import load_dotenv
from app.Helpers.formatter import transform_data
from app.DB.session import dbconnection
from transformers import AutoModel, AutoTokenizer
import torch

load_dotenv()
api_key = os.getenv('SCRAPER_API_KEY')
if not api_key:
    raise Exception("SCRAPER_API_KEY environment variable not set")

# Load the 'thenlper/gte-small' model and tokenizer
model_name = "thenlper/gte-small"
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="./HuggingFaceModels")
model = AutoModel.from_pretrained(model_name, cache_dir="./HuggingFaceModels")

# Connect to MongoDB
db = dbconnection()
products_collection = db['products']

def scrape_data(asin_no, country="in"):
    print(f"Scraping data for ASIN: {asin_no}, country: {country}")
    payload = {
        'api_key': api_key,
        'asin': asin_no,
        'country': country,
        'tld': 'in',
        "OUTPUT_FORMAT": "json",
        "REVIEW_TYPE": "avp_only_reviews"   # taking only verified purchase reviews hehe
    }
    print(f"Payload for request: {payload}")
    try:
        r = requests.get('https://api.scraperapi.com/structured/amazon/review', params=payload)
        print(f"Response status code: {r.status_code}")
        data = r.json()
        if r.status_code == 200:
            print("Successfully retrieved data")
            formatted_data = transform_data(data)
            if isinstance(formatted_data, dict):
                reviews = [review['review'] for review in formatted_data["reviews"]]
                embeddings = []
                for text in reviews:
                    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
                    with torch.no_grad():
                        outputs = model(**inputs)
                        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
                    embeddings.append(embedding)
                product_data = {
                    "product_asin_no": asin_no,
                    "embeddings": embeddings,
                    "formatted_data": formatted_data
                }
                products_collection.update_one(
                    {"product_asin_no": asin_no},
                    {"$set": product_data},
                    upsert=True
                )
                print(f"Formatted data: {formatted_data}")
                return formatted_data
            else:
                return {"success": "false", "error": "Unexpected formatted data format"}
        else:
            print(f"Error: {r.status_code}, Response: {data}")
            if isinstance(data, dict):
                return {"success": "false", "error": data}
            else:
                return {"success": "false", "error": "Unexpected response format"}
    except Exception as e:
        print("Exception occurred while scraping data")
        return {"success": "false", "error": str(e)}