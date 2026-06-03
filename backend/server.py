from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
# ... mantenha seus outros imports de banco de dados e rotas aqui ...

app = FastAPI()

# Middleware de liberação total - SEM VÍRGULAS, SEM VARIÁVEIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... resto do código (api_router, etc) ...
app.include_router(api_router)
