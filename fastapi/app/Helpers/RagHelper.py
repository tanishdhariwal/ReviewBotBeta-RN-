from app.Model.embeddingModel import tokenize
from app.DB.session import dbconnection
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

db = dbconnection()
products_collection = db['products']

def getContext(asin_no, user_query, top_k=6):
    try:
        product = products_collection.find_one({"product_asin_no": asin_no})
        query_embedding = tokenize(user_query)
        if product:
            results = []
            for doc in product["reviews"]:
                doc_embedding = np.array(doc["review_embeddings"])
                similarity = cosine_similarity([query_embedding], [doc_embedding])[0][0]
                results.append((doc["review"], similarity))
            results = sorted(results, key=lambda x: x[1], reverse=True)
            k_reviews = "reviews:\n"+"\n".join([doc[0] for doc in results[:top_k]])
            
            name = "Name: " + product["title"] if "title" in product else ""
            features = "features:\n"+ "\n".join(product["features"]) if "features" in product else ""
            review_summary = "summary of reviews:\n" + product["review_summary"] if "review_summary" in product else ""  
            
            return name + "\n" + features + "\n" + review_summary + "\n" + k_reviews
        else:
            return ""
            
    except Exception as e:
        print(f"Exception occurred while getting context: {e}")
        return ""
# print("context:",getContext("B0DNCK5CSW", "battery life"))