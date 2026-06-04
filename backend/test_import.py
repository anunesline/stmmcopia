try:
    from server import app
    print("IMPORTACAO_SUCESSO")
except Exception as e:
    print(f"ERRO_DETALHADO: {e}")
    import traceback
    traceback.print_exc()
