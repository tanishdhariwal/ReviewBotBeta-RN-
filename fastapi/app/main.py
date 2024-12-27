from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.Controllers.routes import router
from contextlib import asynccontextmanager
#from app.Model.LlamaModel import load_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    #pass
    #load_model()
    yield
    #unload_model_and_tokenizer()

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