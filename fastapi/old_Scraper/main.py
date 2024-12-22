from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.Controllers.routes import router, load_model_and_tokenizer, unload_model_and_tokenizer
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the model and tokenizer once when the application starts
    # load_model_and_tokenizer()
    # pass
    yield
    # Unload the model and tokenizer when the application shuts down
    # unload_model_and_tokenizer()

app = FastAPI(lifespan=lifespan)

app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}