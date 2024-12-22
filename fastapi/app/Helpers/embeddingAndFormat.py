
from app.Model.embeddingModel import tokenize

def add_review(curr_data, review_data):
    try:
        if not isinstance(curr_data, dict):
            raise ValueError("Input data is not a dictionary")
        if not isinstance(review_data, dict):
            raise ValueError("New data is not a dictionary")
        for review in review_data["customer_reviews"]:
            
            date_str = review["date"]
        
            review_date = " ".join(date_str.split(" ")[-3:])
            review_embeddings = tokenize(review["review"])
            title_embeddings = tokenize(review["title"])            

            curr_data["reviews"].append({
                "title": review["title"] if "title" in review else "No Title",
                "title": title_embeddings if title_embeddings else [],
                "review": review["review"] if "review" in review else "No Review",
                "review_embeddings": review_embeddings if review_embeddings else [],  
                "star": review["rating"] if "rating" in review else 0,
                "date": review_date if review_date else "No Date"
            })
        return curr_data
        
    except Exception as e:
        print(f"Exception occurred while adding review data: {e}")
        return {"success": "false", "error": str(e)}
        
    

def transform_data(data, ASIN_NO):
    try:
        if not isinstance(data, dict):
            raise ValueError("Input data is not a dictionary")
        formated_data = {
            "product_asin_no": ASIN_NO,
            "title": data["title"] if "title" in data else "No Title",
            #"Name": data["product_information"]["Model Name"],
            "Brand_Name":data["brand"].replace("Visit the ","") if "brand" in data else "No Brand",
            "price": data["list_price"] if "list_price" in data else "No Price",
            "description": data["description"] if "description" in data else "No Description",
            "image_url": data["images"][:5] if "images" in data else "No Images",
            "features": data["feature_bullets"] if "feature_bullets" in data else "No Features",
            "average_rating": data["average_rating"] if "average_rating" in data else "No Rating",
            "customer_sentiments": data["customer_sentiments"] if "customer_sentiments" in data else {},
            "amazon_review_summary": data["customers_say"] if "customers_say" in data else "No Summary",
            "ratings_distribution": data["ratings_distribution"] if "ratings_distribution" in data else {},
            "reviews": []
            
        }
        for review in data["customer_reviews"]:
            
            date_str = review["date"]
        
            review_date = " ".join(date_str.split(" ")[-3:])
            review_embeddings = tokenize(review["review_snippet"])
            title_embeddings = tokenize(review["review_title"])            

            formated_data["reviews"].append({
                "title": review["review_title"] if "review_title" in review else "No Title",
                "title_embeddings": title_embeddings if title_embeddings else [],
                "review": review["review_snippet"] if "review_snippet" in review else "No Review",
                "review_embeddings": review_embeddings if review_embeddings else [],
                "star": review["rating"] if "rating" in review else 0,
                "date": review_date if review_date else "No Date"
            })

    
        return formated_data
    except Exception as e:
        print(f"Exception occurred while transforming data: {e}")
        return {"success": "false", "error": str(e)}
