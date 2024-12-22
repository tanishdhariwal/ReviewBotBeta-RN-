import os
from openai import OpenAI
from dotenv import load_dotenv
from app.Helpers.RagHelper import getContext

load_dotenv()

token = os.getenv("GITHUB_TOKEN")
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

def prompt_generator(question, context, conversation_history=[]):
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
    messages = [
        {"role": "system", "content": system_prompt}
    ]
    if context:
        messages.append({"role": "system", "content": context})

    for msg in conversation_history[-4:]:
        messages.append({"role": "user", "content": msg.get('user_query')})
        messages.append({"role": "assistant", "content": msg.get('bot_response')})

    messages.append({"role": "user", "content": question})
    return messages

def answer_query(query, asin_no, conversation_history=[], context=""):
    if not context:
        context = getContext(asin_no, query)
    prompt_template = prompt_generator(query, context, conversation_history)
    response = client.chat.completions.create(
        messages=prompt_template,
        model=model_name,
        temperature=1.0,
        top_p=1.0,
        max_tokens=1000
    )
    return response.choices[0].message.content

def summarise_text(reviews, product_name=""):
    system_prompt = (
        "You are tasked with providing a concise and relevant summary of user reviews about the product: "
        f"{product_name}. "
        "- Base your response on the information of reviews provided in the context below.\n"
        '- Begin your response with "Users says ".'
    )
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "system", "content": reviews},
        {"role": "user", "content": "Please provide a concise summary of the user reviews."}
    ]
    response = client.chat.completions.create(
        messages=messages,
        model=model_name,
        temperature=1.0,
        top_p=1.0,
        max_tokens=1000
    )
    return response.choices[0].message.content