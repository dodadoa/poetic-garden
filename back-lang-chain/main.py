from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

llm = OpenAI()
chat_model = ChatOpenAI()

text = "could you please chang my poem with the same rhyme 'Something in the way she moves'"

prediction = llm.predict(text)
print(prediction)

chat_prediction = chat_model.predict(text)
print(chat_prediction)
