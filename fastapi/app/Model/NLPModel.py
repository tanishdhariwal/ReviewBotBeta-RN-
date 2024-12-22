import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline

torch.random.manual_seed(0)

model = None
tokenizer = None
pipe = None
RAG_PROMPT_TEMPLATE = None
RAG_PROMPT_TEMPLATE1 = None

    #initializing generation arguments
generation_args_generation = {
        "max_new_tokens": 300,
        "return_full_text": False,
        "temperature": 0.0,
        "do_sample": False,
    }
generation_args_summary = {
        "max_new_tokens": 200,
        "return_full_text": False,
        "temperature": 0.3,
        "do_sample": True,
    }



def load_model():
    # global variables to store the model, tokenizer and pipeline and work in other files
    global model, tokenizer, pipe, RAG_PROMPT_TEMPLATE, RAG_PROMPT_TEMPLATE1

    modelName = "microsoft/Phi-3.5-mini-instruct"

    #initialize the model and tokenizer
    model = AutoModelForCausalLM.from_pretrained(
        modelName,
        device_map = "cuda" if torch.cuda.is_available() else "cpu",
        torch_dtype="auto",
        cache_dir="./HuggingFaceModels",
        trust_remote_code=True,
    )
    tokenizer = AutoTokenizer.from_pretrained(modelName, cache_dir="./HuggingFaceModels")

    #initialize the pipeline
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )

    prompt_chat=[
        {
            "role":"system",
            "content":"""Using the information of people's reviews contained in the context,
    Give a comprehensive answer to the question.
    Respond only to the question asked , response should be concise and relevant to the question.
    If the answer cannot be deduced from the context, do not give an answer""",
        },
        {
            "role":"user",
            "content":"""Context:
    {context}
    ---
    Now here is the Question you need to answer.
    Question:{question}
            """,
        },
    ]
    RAG_PROMPT_TEMPLATE = tokenizer.apply_chat_template(
        prompt_chat,tokenize = False,add_generation_prompt=True,

    )
    
    #SUMARIZATION

    prompt_chat1=[
        {
            "role":"system",
            "content":
                """Using the information contained in the context, Give a summary of the context.
                response should be concise and relevant.
                If the answer cannot be deduced from the context, do not give an answer""",

        },
        {
            "role":"user",
            "content":
                """Context:
                product name: {product_name}
                reviews:{reviews}""",
        },
    ]
    RAG_PROMPT_TEMPLATE1 = tokenizer.apply_chat_template(
        prompt_chat1,tokenize = False,add_generation_prompt=True

    )
    
#  

#function to generate text based on user query
def answer_query(user_query,context = "", generation_args = generation_args_generation):
    global pipe, RAG_PROMPT_TEMPLATE
    prompt = RAG_PROMPT_TEMPLATE.format(context = context, question = user_query)
    output = pipe(prompt, **generation_args)
    print(RAG_PROMPT_TEMPLATE)
    print(output[0]['generated_text'])
    return output[0]['generated_text']


#function to summarise text
def summarise_text(reviews, product_name="", generation_args = generation_args_summary):
    prompt = RAG_PROMPT_TEMPLATE1.format(reviews = reviews, product_name = product_name)
    output = pipe(prompt, **generation_args)
    return output[0]['generated_text']