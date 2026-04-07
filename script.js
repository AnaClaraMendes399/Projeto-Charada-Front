// Capturando os elementos HTML
const cardInner = document.getElementById('card-inner')
const campoPergunta = document.getElementById('pergunta')
const campoResposta = document.getElementById('resposta')
const btnNova = document.getElementById('btn-nova')
const btnResetar = document.getElementById('btnResetar')
const btnAcertou = document.getElementById('btnAcertou')
const btnErrou = document.getElementById('btnErrou')
const acertosSpan = document.getElementById('acertos')
const sequenciaSpan = document.getElementById('sequencia')
const totalCharadasSpan = document.getElementById('totalCharadas')

// Estado do jogo
let acertos = 0, sequencia = 0, total = 0

// Atualizar placar
function atualizarPlacar() {
    acertosSpan.textContent = acertos
    sequenciaSpan.textContent = sequencia
    totalCharadasSpan.textContent = total
    localStorage.setItem('charadasStats', JSON.stringify({ acertos, sequencia, total }))
}

// Carregar stats salvos
const saved = localStorage.getItem('charadasStats')
if (saved) {
    const stats = JSON.parse(saved)
    acertos = stats.acertos || 0
    sequencia = stats.sequencia || 0
    total = stats.total || 0
    atualizarPlacar()
}

// Virar card
cardInner.addEventListener('click', () => 
    cardInner.classList.toggle('[transform:rotateY(180deg)]')
)

// Buscar charada
async function buscaCharada() {
    try {
        const resposta = await fetch('http://127.0.0.1:5000/charadas/aleatoria')
        const dados = await resposta.json()
        campoPergunta.textContent = dados.pergunta
        campoResposta.textContent = dados.resposta
    } catch (erro) {
        campoPergunta.textContent = "Erro ao conectar"
        console.error(erro)
    }
}

// Acertei
btnAcertou.addEventListener('click', (e) => {
    e.stopPropagation()
    acertos++
    sequencia++
    total++
    atualizarPlacar()
    
    setTimeout(() => {
        if (cardInner.classList.contains('[transform:rotateY(180deg)]')) {
            cardInner.classList.remove('[transform:rotateY(180deg)]')
        }
        setTimeout(() => buscaCharada(), 100)
    }, 500)
})

// Errei
btnErrou.addEventListener('click', (e) => {
    e.stopPropagation()
    sequencia = 0
    total++
    atualizarPlacar()
    
    setTimeout(() => {
        if (cardInner.classList.contains('[transform:rotateY(180deg)]')) {
            cardInner.classList.remove('[transform:rotateY(180deg)]')
        }
        setTimeout(() => buscaCharada(), 100)
    }, 500)
})

// Nova charada
btnNova.addEventListener('click', () => {
    buscaCharada()
    if (cardInner.classList.contains('[transform:rotateY(180deg)]')) {
        cardInner.classList.remove('[transform:rotateY(180deg)]')
    }
})

// Resetar
btnResetar.addEventListener('click', () => {
    acertos = 0
    sequencia = 0
    total = 0
    atualizarPlacar()
})

// Iniciar
buscaCharada()