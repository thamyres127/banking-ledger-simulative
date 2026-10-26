import threading
import requests

# URL da API do seu servidor local Node.js
API_URL = "http://localhost:3000/api/pix"

def disparar_pix(id_transacao, origem, destino, valor):
    """Envia uma requisição simultânea para testar a resiliência do Ledger"""
    payload = {
        "sender": origem,
        "receiver": destino,
        "amount": valor
    }
    try:
        resposta = requests.post(API_URL, json=payload, timeout=5)
        if resposta.status_code == 200:
            print(f"✅ [Thread {id_transacao}] Sucesso! Pix de R$ {valor:.2f} liquidado.")
        else:
            print(f"❌ [Thread {id_transacao}] Bloqueado por Regra ACID: {resposta.json().get('error')}")
    except requests.exceptions.ConnectionError:
        print(f"⚠️ [Thread {id_transacao}] Erro: Não foi possível conectar ao servidor Node.js.")

if __name__ == "__main__":
    print("=== DISPARANDO TESTES DE CONCORRÊNCIA (THREADS) ===")
    threads = []
    
    # Dispara 3 transferências simultâneas de R$ 2000.00
    for i in range(1, 4):
        t = threading.Thread(target=disparar_pix, args=(i, "1001-1", "2002-2", 2000.00))
        threads.append(t)
        t.start()
        
    for t in threads:
        t.join()
        
    print("=== TESTE CONCLUÍDO ===")
