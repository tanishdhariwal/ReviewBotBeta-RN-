import os
from app.Helpers.embeddingAndFormat import transform_data, add_review
from app.DB.session import dbconnection

db = dbconnection()
products_collection = db['products']

