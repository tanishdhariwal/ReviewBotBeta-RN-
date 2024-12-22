from pymongo import MongoClient
from bson.objectid import ObjectId
from pydantic import BaseModel, Field, Extra
from typing import List, Union

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']
collection = db['products']

# Define the Product model
class Review(BaseModel):
    title: Union[str, List[float]] = None
    review: Union[str, List[float]] = None
    star: int = None
    date: str = None

    class Config:
        extra = Extra.allow  # Allow extra fields

class Product(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias='_id')
    product_asin_no: str = None
    error: str = None
    success: str = None
    average_rating: str = None
    brand: str = None
    description: str = None
    features: List[str] = None
    image_url: List[str] = None
    price: str = None
    reviews: List[Review] = None
    tile: str = None

    class Config:
        extra = Extra.allow  # Allow extra fields
        allow_population_by_field_name = True

# Create a product instance from available fields
product_data = {
    "product_asin_no": "B0DGGW7FFS",
    "error": "'reviews'",
    "success": "false",
    "average_rating": "3.8",
    "brand": "Visit the Portronics Store",
    "description": "Enhance your productivity with the Portronics Toad 34, an ergonomically designed wireless mouse built to provide both comfort and precision. Its 2.4 GHz wireless connectivity ensures stable, lag-free performance, making it perfect for work, gaming, or everyday use. The adjustable DPI settings allow you to switch between different sensitivity levels, reaching up to 1600 DPI for high-precision tracking. With its high precision optical sensor, this wireless mouse for laptop delivers smooth, accurate movements across various surfaces. Additionally, the auto sleep mode intelligently conserves power by putting the mouse to sleep when not in use, extending battery life. Designed for long-lasting comfort and reliable battery performance, this wireless mouse for PC is your ideal companion for work or play.",
    "features": [
        "Wireless Connectivity: The Portronics Toad 34 wireless mouse delivers a seamless 2.4 GHz wireless connection for uninterrupted performance, ensuring you stay connected with minimal interference for maximum productivity.",
        "Comfortable Ergonomic Design: Toad 34 is ergonomically designed to fit naturally in your hand, reducing wrist strain and discomfort, making it perfect for long hours of work, gaming, or browsing.",
        "is universally compatible with various operating systems, including Windows, macOS, and Linux, offering a versatile experience across different devices and platforms."
    ],
    "image_url": [
        "https://m.media-amazon.com/images/I/517KUhrNL9L._SL1200_.jpg",
        "https://m.media-amazon.com/images/I/614edfsPRZL._SL1200_.jpg",
        "https://m.media-amazon.com/images/I/61NCC2xOdDL._SL1200_.jpg",
        "https://m.media-amazon.com/images/I/61jTVHN3eSL._SL1200_.jpg",
        "https://m.media-amazon.com/images/I/717wu1hyxSL._SL1200_.jpg"
    ],
    "price": "₹269.00",
    "reviews": [
        {
            "review": [
                0.09637163579463959,
                -0.06899870187044144,
                0.4013856053352356,
                -0.23510414361953735,
                0.0189510565251112,
                0.5434273481369019
            ],
            "star": 5,
            "date": "6 October 2024"
        },
        {
            "title": [
                -0.31556805968284607,
                0.17156127095222473
            ],
            "review": [
                0.09637163579463959
            ],
            "star": 5,
            "date": "30 September 2024"
        }
    ],
    "tile": "Portronics Toad 34 Wireless Mouse with 2.4 GHz Wireless, Adjustable Sensitivity, USB Receiver, Ergonomic Design, for Laptops, Desktops PC, Mac (Grey)"
}

product = Product(**product_data)

# Insert the product into MongoDB
collection.insert_one(product.dict(by_alias=True))
print("Product inserted with ID:", product.id)