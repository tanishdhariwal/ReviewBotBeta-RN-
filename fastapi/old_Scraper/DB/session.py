import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()

# Get MongoDB URL from environment variable
mongo_url = os.getenv('MONGO_DB_URL')

if not mongo_url:
    raise ValueError("No MongoDB URL found in environment variables")

# Connect to MongoDB and return the database object
def dbconnection():
    client = MongoClient(mongo_url)
    return client.get_database()
