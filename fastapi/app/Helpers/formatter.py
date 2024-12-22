from datetime import datetime
import logging
import re
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

logger = logging.getLogger(__name__)

def transform_data(data):
    try:
        if not isinstance(data, dict):
            raise ValueError("Input data is not a dictionary")
        
        product = data["product"]
        product_url = product["url"]
        asin_match = re.search(r'/dp/([A-Z0-9]{10})', product_url)
        product_asin_no = asin_match.group(1) if asin_match else 'N/A'

        formated_data = {
            "product_asin_no": product_asin_no,
            "product_url": product_url,
            "product_name": product["name"],
            "product_brand": product["brand"],
            "product_image_url": product["image"],
            "average_rating": data["average_rating"],
            "ratings_percentage": data.get("ratings_percentage", "N/A"),
            "reviews": []
        }
        
        model = SentenceTransformer('all-MiniLM-L6-v2')
        dimension = 384
        index = faiss.IndexFlatL2(dimension)
        review_ids = []
        
        for review in data["reviews"]:
            date_str = review["date"]
            date_match = re.search(r'Reviewed in .* on ([\d]+ [A-Za-z]+ [\d]{4})', date_str)
            if date_match:
                extracted_date_str = date_match.group(1)
                review_date = datetime.strptime(extracted_date_str, '%d %B %Y')
            else:
                raise ValueError(f"Date format not recognized in {date_str}")
            
            title = re.sub(r'^\d+\.\d+ out of 5 stars\s+', '', review["title"]).strip()
            review_text = review["review"]
            review_vector = model.encode([review_text])[0]
            review_vector_np = np.array([review_vector])
            index.add(review_vector_np)
            review_ids.append(review.get("id", None))
            formated_data["reviews"].append({
                "title": title,
                "review": review["review"],
                "review_vector": review_vector.tolist(),  
                "star": review["stars"],
                "date": review_date
            })
        
        logger.debug(f"Transformed data: {formated_data}")
        return formated_data
    except KeyError as e:
        logger.exception(f"Missing field: {e}")
        return {"success": "false", "error": f"Missing field: {e}"}
    except Exception as e:
        logger.exception(f"An error occurred: {e}")
        return {"success": "false", "error": str(e)}