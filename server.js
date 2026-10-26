const express = require('express');
const app = express();
app.use(express.json());

// Banco de dados em memória simulando o estado do SQL para testes rápidos
let accounts = {
    '1001-1': { holder: 'Cliente Origem Teste', balance: 5000.00 },
    '2002-2': { holder: 'Cliente Destino Teste', balance: 1500.00 }
};
let transactions = [];

// Endpoint para simular a liquidação de um Pix com propriedades ACID
app.post('/api/pix/transfer', (req, res) => {
    const { sender, receiver, amount } = req.body;
    const transferAmount = parseFloat(amount);

    // --- Validações de Regra de Negócio ---
    if (!accounts[sender] || !accounts[receiver]) {
        return res.status(404).json({ success: false, error: 'Conta de origem ou destino não encontrada.' });
    }
    if (transferAmount <= 0) {
        return res.status(400).json({ success: false, error: 'O valor da transferência deve ser maior que zero.' });
    }
    if (accounts[sender].balance < transferAmount) {
        return res.status(400).json({ success: false, error: 'Saldo insuficiente para realizar o Pix.' });
    }

    // --- Simulação de Transação ACID (Isolamento e Atomicidade) ---
    try {
        // Debita da conta de origem
        accounts[sender].balance -= transferAmount;
        
        // Credita na conta de destino
        accounts[receiver].balance += transferAmount;

        // Registra a transação no Ledger Imutável
        const transactionId = 'PIX' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const newTransaction = {
            id: transactionId,
            sender,
            receiver,
            amount: transferAmount,
            status: 'COMPLETED',
            timestamp: new Date()
        };
        transactions.push(newTransaction);

        // Retorna sucesso confirmando a consistência dos saldos
        return res.status(200).json({
            success: true,
            message: 'Pix liquidado com sucesso!',
            transaction: newTransaction
        });

    } catch (error) {
        // Caso ocorra qualquer erro inesperado, simula o ROLLBACK mantendo os saldos intactos
        return res.status(500).json({ success: false, error: 'Falha crítica no processamento. Transação abortada (Rollback).' });
    }
});

// Endpoint para consultar o saldo atualizado (Ledger de Consistência)
app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Simulador de Ledger rodando na porta ${PORT}`));
