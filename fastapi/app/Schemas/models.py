# app/Schemas/models.py
from pydantic import BaseModel
from typing import Optional, List, Dict

class User(BaseModel):
    id: Optional[str]
    username: str
    email: str
    password: str

    class Config:
        from_attributes = True

class QueryInput(BaseModel):
    query: str
    asin: str

class Url(BaseModel):
    asin: str

class TextInput(BaseModel):
    text: str

class Review(BaseModel):
    title: str
    review: str
    review_vector: List[float]
    star: int
    date: str

class ProductData(BaseModel):
    product_asin_no: str
    product_url: str
    product_name: str
    product_brand: str
    product_image_url: str
    average_rating: float
    ratings_percentage: Optional[str]
    reviews: List[Review]

class Product(BaseModel):
    product_asin_no: str
    embeddings: List[List[float]]
    formatted_data: ProductData

responses = [
    "This is a random response 1.",
    "Here is another random response.",
    "Yet another random text for you.",
    "Random response number four.",
    "This is the fifth random response."
]
