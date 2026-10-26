-- Criação do banco de dados para o Simulador Bancário
CREATE DATABASE IF NOT EXISTS ledger_db;
USE ledger_db;

-- Tabela de Contas Bancárias
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(10) UNIQUE NOT NULL,
    holder_name VARCHAR(100) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_balance CHECK (balance >= 0.00)
);

-- Tabela de Transações Pix (Ledger Imutável)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    sender_account VARCHAR(10) NOT NULL,
    receiver_account VARCHAR(10) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_account) REFERENCES accounts(account_number),
    FOREIGN KEY (receiver_account) REFERENCES accounts(account_number)
);

-- Inserção de dados iniciais para testes rápidos
INSERT INTO accounts (account_number, holder_name, balance) VALUES 
('1001-1', 'Cliente Origem Teste', 5000.00),
('2002-2', 'Cliente Destino Teste', 1500.00)
ON DUPLICATE KEY UPDATE account_number=account_number;
