import random
from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List
from pymongo import MongoClient
from app.Schemas.models import User, TextInput, responses, Url, QueryInput  # Assuming you have a User model defined in models.py
from app.DB.session import dbconnection  # Import the dbConnection function
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from tqdm import tqdm
import time
from app.Helpers.scraperAPI import scrape_data
from urllib.parse import urlparse, parse_qs
import re

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

def verify_token(request: Request):
    token = request.headers.get("Authorization")
    if not token or token.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Not Received",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        token = token.split(" ")[1]  # Remove 'Bearer' prefix
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # You can also return user information if needed
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Expired",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e

@router.post("/random_text")
async def get_random_text(input: TextInput, token: dict = Depends(verify_token)):
    try:
        username = token.get("username")
        time.sleep(5)
        print("I came here bruh !!")

        random_response = random.choice(responses)

        print(input, " ---> ", random_response)

        random_response = random_response + "----------- " + username
        return {"response": random_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Load the model and tokenizer (you can load this once when the app starts)
model = None
tokenizer = None
pipe = None
model_loaded = False

def load_model_and_tokenizer():
    global model, tokenizer, pipe, model_loaded
    if not model_loaded:
        for _ in tqdm(range(100), desc="Loading model and tokenizer"):
            time.sleep(0.01)  # Simulate loading time
        model = AutoModelForCausalLM.from_pretrained(
            "microsoft/Phi-3.5-mini-instruct",
            device_map="cuda",
            torch_dtype="auto",
            trust_remote_code=True,
        )
        print("Model is loaded !")

        tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3.5-mini-instruct")

        print("Tokenizer loaded")

        pipe = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
        )
        model_loaded = True

def unload_model_and_tokenizer():
    global model, tokenizer, pipe, model_loaded
    model = None
    tokenizer = None
    pipe = None
    model_loaded = False
    print("Model and tokenizer unloaded")

generation_args = {
    "max_new_tokens": 700,
    "return_full_text": False,
    "temperature": 0.0,
    "do_sample": False,
}

# Route to handle the generation
@router.post("/generate")
async def generate_text(query: QueryInput, token: dict = Depends(verify_token)):
    try:
        username = token.get("username")
        print("I came here bruh !!")
        messages = [
            {"role": "system", "content": "You are an AI Assistant"},
            {"role": "user", "content": query.query},
        ]

        # Simulate progress bar for prediction
        for _ in tqdm(range(100), desc="Generating response"):
            time.sleep(0.01)  # Simulate prediction time

        output = pipe(messages, **generation_args)
        return {"response": output[0]['generated_text'] + "----------- " + username}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users", response_model=List[User])
async def get_all_users(db: MongoClient = Depends(dbconnection)):
    users_collection = db["users"]  # Assuming the collection name is "users"
    users = list(users_collection.find({}))

    # Map MongoDB _id to id
    for user in users:
        user["id"] = str(user.pop("_id"))

    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users


@router.post("/scrape_url")
async def scraping(input: Url):
    print(f"Received scraping request with input: {input}")

    parsed_url = urlparse(input.url)

    print(f"Parsed URL: {parsed_url}")

    if not all([parsed_url.scheme, parsed_url.netloc]):
        print("Invalid URL provided")
        raise HTTPException(status_code=400, detail="Invalid URL")

    # Extract ASIN from the URL
    asin = extract_asin_from_url(input.url)
    print(f"Extracted ASIN: {asin}")

    if not asin:
        print("ASIN not found in URL")
        raise HTTPException(status_code=400, detail="ASIN not found in URL")
    try:
        data = scrape_data(asin)
        print(f"Scraped data: {data}")
        return data
    except Exception as e:
        print("Error occurred during scraping")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def extract_asin_from_url(url):
    print(f"Extracting ASIN from URL: {url}")
    # Function to extract ASIN from Amazon product URL
    asin_pattern = re.compile(r"/(?:dp|product)/([A-Z0-9]{10})", re.IGNORECASE)
    match = asin_pattern.search(url)
    if match:
        asin = match.group(1)
        print(f"ASIN found: {asin}")
        return asin
    else:
        # Try extracting ASIN from query parameters if available
        parsed_url = urlparse(url)
        query_params = parse_qs(parsed_url.query)
        print(f"Query parameters: {query_params}")
        if 'ASIN' in query_params:
            asin = query_params['ASIN'][0]
            print(f"ASIN found in query parameters: {asin}")
            return asin
        else:
            print("ASIN not found in URL")
            return None

