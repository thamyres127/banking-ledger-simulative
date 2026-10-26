# Ledger Engine Simulator & Pix Liquidation ⚡

Este repositório contém um simulador de **Ledger Bancário (Livro-Razão)** e motor de liquidação de transações **Pix**, projetado especificamente para validar a consistência de saldos distribuídos, regras de negócio bancárias rígidas e a aplicação estrita das propriedades **ACID** (Atomicidade, Consistência, Isolamento e Durabilidade).

A aplicação demonstra na prática como mitigar problemas de concorrência e falhas de rede durante movimentações financeiras de alta criticidade.

---

## 🏗️ Estrutura do Projeto

O projeto foi construído seguindo uma arquitetura limpa, integrada e desacoplada:

*   **`database.sql`**: Camada de dados estruturada em SQL. Contem schemas relacionais fortemente tipados, constraints de checagem de saldo (`CHECK balance >= 0`) e triggers de integridade.
*   **`server.js`**: Core do back-end desenvolvido em Node.js / Express. Gerencia o pool de conexões com o banco de dados e executa os blocos transacionais garantindo reversão (`ROLLBACK`) automática em caso de anomalias.
*   **`index.html`**: Painel administrativo (Front-End) responsivo construído com JavaScript Vanilla e estilizado via Tailwind CSS, simulando eventos em tempo real no ecossistema de pagamentos instantâneos.
*   **`test_ledger.py`**: Script de testes automatizados em Python. Utiliza concorrência de Threads para disparar requisições simultâneas contra o servidor e validar a resiliência do sistema sob estresse.

---

## 🛡️ Implementação dos Pilares ACID

### 1. Atomicidade (Atomicity)
Toda liquidação Pix opera sob o princípio do **"tudo ou nada"**. A API encapsula o débito da conta remetente e o crédito na conta destinatária dentro de um bloco único. Caso ocorra qualquer falha no meio do processo, a transação realiza um `ROLLBACK` completo, impedindo que o dinheiro suma de uma conta sem chegar à outra.

### 2. Consistência (Consistency)
Garantida no nível do banco de dados por regras estritas. A aplicação não permite a existência de estados inválidos, como saldos negativos não autorizados ou contas fantasma, rejeitando transações ilegítimas antes que afetem o estado global do Ledger.

### 3. Isolamento (Isolation)
As transações simultâneas são tratadas de forma isolada através de travas de concorrência (`Lock` / `FOR UPDATE`). Isso evita problemas clássicos de concorrência bancária, como leituras sujas (*dirty reads*) ou atualizações perdidas (*lost updates*), mantendo a ordem sequencial correta dos saldos mesmo com múltiplos acessos por segundo.

### 4. Durabilidade (Durability)
Uma vez que o Pix é marcado como `COMPLETED` no histórico, o estado é gravado de maneira imutável e persistentemente no banco de dados, imune a reinicializações abruptas do servidor de aplicação.

---

## 🛠️ Tecnologias Utilizadas

*   **Front-End**: HTML5, JavaScript (ES6+), Tailwind CSS.
*   **Back-End**: Node.js, Express.
*   **Banco de Dados**: SQL / Relacional.
*   **Testes de Concorrência**: Python 3 (Threading / Requests).
