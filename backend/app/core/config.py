from typing import List
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    META_PASS_STR: str = "123456"
    PROJECT_NAME: str = "PYMETASPLOIT"

    class Config:
        case_sensitive = True


settings = Settings()