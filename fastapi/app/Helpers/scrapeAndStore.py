import requests
import os
from dotenv import load_dotenv
from app.Helpers.embeddingAndFormat import transform_data, add_review
from app.DB.session import dbconnection

load_dotenv()
api_key = os.getenv('SCRAPER_API_KEY')
if not api_key:
    raise Exception("SCRAPER_API_KEY environment variable not set")

db = dbconnection()
products_collection = db['products']

def scrape_data(asin_no, domain="com"):
    print(f"Scraping data for ASIN: {asin_no}, domain: {domain}")
    payload = {
        "api_key": api_key,
        "asin": asin_no,
        "domain": domain,
    }
    product_url = "https://api.scrapingdog.com/amazon/product"
    review_url = "https://api.scrapingdog.com/amazon/reviews"
    try:
        formatted_data = {}
        r = requests.get(product_url, params=payload)
        print("Received product response from ScraperAPI")
        if r.status_code == 200:
            product_data = r.json()
            formatted_data = transform_data(product_data, asin_no)
        else:
            print(f"failed, response status code of product scrape is {r.status_code}")
            raise Exception(f"Failed to get product data: {r.status_code}")
            
        print(f"trying to get reviews response from ScraperAPI")
        for i in range(2,5):
            payload["page"] = str(i)
            r = requests.get(review_url, params=payload)
            
            if r.status_code == 200:
                
                review_data = r.json()
                if(review_data["customer_reviews"] == []):
                    break
                formatted_data = add_review(formatted_data, review_data)
                
            else:
                print(f"response status code of review scrape is {r.status_code} on page {i}")  
                if("reviews" not in formatted_data):              
                    raise Exception(f"Failed to get reviews data: {r.status_code}")
                

        print(f"got {len(formatted_data['reviews'])} reviews")
                
        if isinstance(formatted_data, dict):
            return formatted_data
        else:
            return {"success": "false", "error": "Unexpected formatted data format"}
        
    except Exception as e: 
        print("Exception occurred while scraping data " + str(e))
        return {"success": "false", "error": str(e), "data": formatted_data}
# scrape_data("B0CYGYCRH8")