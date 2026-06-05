#!/usr/bin/env bash
# Otimiza o build
set -o errexit

# Instala as dependências do Python
pip install -r backend/requirements.txt
