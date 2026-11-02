const express = require('express');
const app = express();
app.use(express.json());

// --- Função de Validação Matemática de CPF Legítimo ---
function validarCPF(cpf) {
    const cpfLimpo = String(cpf).replace(/\D/g, '');

    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        return false;
    }

    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

    return true;
}

// Banco de dados atualizado com chaves que são CPFs válidos para seus testes passarem
let accounts = {
    '25394285038': { holder: 'Cliente Origem Teste', balance: 5000.00 },
    '70830491054': { holder: 'Cliente Destino Teste', balance: 1500.00 }
};
let transactions = [];

// Endpoint para simular a liquidação de um Pix com propriedades ACID
app.post('/api/pix/transfer', (req, res) => {
    const { sender, receiver, amount } = req.body;
    const transferAmount = parseFloat(amount);

    // --- Nova Trava de Segurança: Motor de Risco (CPF Válido) ---
    if (!validarCPF(sender) || !validarCPF(receiver)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Transação rejeitada pelo Motor de Risco: CPF do remetente ou do destinatário é inválido.' 
        });
    }

    // --- Validações de Regra de Negócio ---
    if (!accounts[sender] || !accounts[receiver]) {
        return res.status(404).json({ success: false, error: 'Conta de origem ou destino não encontrada no ledger.' });
    }
    if (transferAmount <= 0) {
        return res.status(400).json({ success: false, error: 'O valor da transferência deve ser maior que zero.' });
    }
    if (accounts[sender].balance < transferAmount) {
        return res.status(400).json({ success: false, error: 'Saldo insuficiente para realizar o Pix.' });
    }

    // --- Simulação de Transação ACID (Isolamento e Atomicidade) ---
    try {
        accounts[sender].balance -= transferAmount;
        accounts[receiver].balance += transferAmount;

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

        return res.status(200).json({
            success: true,
            message: 'Pix liquidado com sucesso!',
            transaction: newTransaction
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: 'Falha crítica no processamento. Transação abortada (Rollback).' });
    }
});

app.get('/api/accounts', (req, res) => {
    res.json(accounts);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Simulador de Ledger rodando na porta ${PORT}`));
