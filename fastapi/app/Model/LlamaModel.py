from llama_index.llms.ollama import Ollama
from app.Helpers.RagHelper import getContext
def load_model():
    global llm
    llm = Ollama(model="llama3.2", request_timeout=300.0, temperature=0.2)

def prompt_generator(question, context, conversation_history = []):
    system_prompt = (
        "You are a knowledgeable and reliable conversational assistant specializing in answering only product-related queries based solely on provided reviews. "
        "Your purpose is to use the review context and conversation history to generate accurate and contextually appropriate responses. you must answer by strictly following all the rules\n\n"
        "Rules for response:\n"
        "1. Focus strictly on the provided context of reviews.\n"
        "2. Decline to answer questions unrelated to the product or reviews, Respond politely by stating that the question is not related to the product reviews.\n"
        "3. If information is missing in the context, state explicitly that you cannot answer due to insufficient information.\n"
        "4. Do not reference the review context explicitly in your responses. do not mention the phrase 'review context' in your response.\n"
        "5. if the question is ambiguous or does not make sense, ask for clarification. If the user provides additional information, use it to provide a relevant response.\n"
        "6. Occasionally, suggest a follow-up question so that the user can ask to explore the product further, but only if the conversation allows for it. These suggestions should be relevant to the product and review context.\n"
        "7. Always respond professionally, with clear and concise answers. Avoid unnecessary elaboration—aim to provide the most relevant information in as few words as possible.\n\n"
        "you must follow each and every rule to ensure accurate, relevant, and trustworthy interactions with the user."
    )
    template = f"<|start_header_id|>system<|end_header_id|>\n{system_prompt}<|eot_id|>\n\n"

    # Add context if provided
    if context:
        template += f"<|start_header_id|>context<|end_header_id|>\n{context}<|eot_id|>\n\n"

    # Add message history
    for message in conversation_history[-4:]:
        template += f"<|start_header_id|>user<|end_header_id|>\n{message.get('user_query')}<|eot_id|>\n\n"
        template += f"<|start_header_id|>assistant<|end_header_id|>\n{message.get('bot_response')}<|eot_id|>\n\n"

    template += f"<|start_header_id|>user<|end_header_id|>\n{question}<|eot_id|>\n\n"
    template += "<|start_header_id|>assistant<|end_header_id|>\n"

    return template


def answer_query(query, asin_no, conversation_history = [], context=""):
    if(context == ""):
        context = getContext(asin_no, query)
#     prompt_template = f"""### system 
# Using the information of product name, features and reviews contained in the context, answer the user query based on reviews.
# response should be concise and relevant.
# If the answer cannot be deduced from the context, do not give an answer

# ### context
# {context}

# ### user query
# {query}
### assistant answer"""

    prompt_template = prompt_generator(query, context, conversation_history)
    print(prompt_template)
    response = llm.complete(prompt_template)

    return response.text

def summarise_text(reviews,product_name = ""):
    
#     prompt_template = f"""### system
# Using the information of reviews by users on product:{product_name} contained in the context, Give a summary of the reviews.
# response should be concise and relevant.
# start the response with users says:
    
# ### context
# {reviews}
    
# ### assistant answer"""
    prompt_template = f"""### System
You are tasked with providing a concise and relevant summary of user reviews about the product: {product_name}. 
- Base your response on the information of reviews provided in the context below.
- Begin your response with "Users says ".

### Context
{reviews}

### Assistant Answer
"""
    
    response = llm.complete(prompt_template)
    return response.text