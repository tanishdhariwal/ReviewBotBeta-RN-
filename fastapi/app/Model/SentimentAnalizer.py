from transformers import AutoModelForSequenceClassification, AutoTokenizer, pipeline
import torch
# Model name
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"

# Load model and tokenizer 
model = AutoModelForSequenceClassification.from_pretrained(model_name, cache_dir="./HuggingFaceModels")
tokenizer = AutoTokenizer.from_pretrained(model_name, cache_dir="./HuggingFaceModels")

# Initialize the pipeline
pipe = pipeline(
    task="sentiment-analysis",
    model=model,
    tokenizer=tokenizer
)

# pipe(string) --> returns [{'label': 'positive' or 'negative' or 'neutral', 'score': float}]



def get_sentiment(input):
    return pipe(input)

def get_percent_sentiment(input):
    output = pipe(input)
    dict = {"positive": 0, "negative": 0, "neutral": 0}
    
    for i in output:
        dict[i['label']] += 1

    return {k: v/len(output) for k, v in dict.items()}
    
