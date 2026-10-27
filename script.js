// Valores iniciais simulando as contas do seu banco de dados
let saldoOrigem = 5000.00;
let saldoDestino = 1500.00;

// Pegando os elementos da tela que vamos atualizar
const campoValor = document.getElementById('valorPix');
const botaoLiquidar = document.getElementById('btnLiquidar');
const textoSaldoOrigem = document.getElementById('saldoOrigem');
const textoSaldoDestino = document.getElementById('saldoDestino');

// Função que roda quando a pessoa clica no botão "Liquidar Operação"
botaoLiquidar.addEventListener('click', () => {
    const valor = parseFloat(campoValor.value);

    // Validação básica do campo preenchido
    if (isNaN(valor) || valor <= 0) {
        alert('Por favor, insira um valor de Pix válido e maior que zero.');
        return;
    }

    // Regra de Negócio Crucial: Validação de Saldo (Igual ao seu back-end!)
    if (saldoOrigem < valor) {
        alert(`Transação Recusada: Saldo insuficiente para transferir R$ ${valor.toFixed(2)}.`);
        return;
    }

    // Simulação da atualização atômica (Muda os dois saldos ao mesmo tempo)
    saldoOrigem -= valor;
    saldoDestino += valor;

    // Atualiza os valores visualmente na tela para o usuário ver
    textoSaldoOrigem.innerText = `R$ ${saldoOrigem.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    textoSaldoDestino.innerText = `R$ ${saldoDestino.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Limpa o campo de digitação depois do sucesso
    campoValor.value = '';
    
    alert(`Pix de R$ ${valor.toFixed(2)} enviado com sucesso!`);
});
