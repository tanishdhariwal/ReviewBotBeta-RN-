from transformers import AutoModel, AutoTokenizer
import torch

model_name = "thenlper/gte-small"
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="./HuggingFaceModels")
model = AutoModel.from_pretrained(model_name, cache_dir="./HuggingFaceModels")

def tokenize(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
        
    return embedding

def decode(embedding: list):
    return tokenizer.decode(embedding,  skip_special_tokens=True)