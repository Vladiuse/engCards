from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Config(BaseSettings):
    VOCABULARY_CREATE_CARDS_COUNT: int


config = Config()
