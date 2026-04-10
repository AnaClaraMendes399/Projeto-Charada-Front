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
let aguardandoNovaCharada = false
let cartaVirada = false // Controla se a carta está virada (mostrando resposta)

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

// Função para virar o card (alterna entre pergunta e resposta)
function alternarCard() {
    if (cartaVirada) {
        cardInner.style.transform = 'rotateY(0deg)'
        cartaVirada = false
    } else {
        cardInner.style.transform = 'rotateY(180deg)'
        cartaVirada = true
    }
}

// Função para mostrar apenas a pergunta (forçar frente do card)
function mostrarPergunta() {
    cardInner.style.transform = 'rotateY(0deg)'
    cartaVirada = false
}

// Função para mostrar apenas a resposta (forçar verso do card)
function mostrarResposta() {
    cardInner.style.transform = 'rotateY(180deg)'
    cartaVirada = true
}

// Virar card quando clicar (alterna entre pergunta e resposta)
cardInner.addEventListener('click', () => {
    alternarCard()
})

// Buscar charada
async function buscaCharada() {
    if (aguardandoNovaCharada) return
    
    try {
        aguardandoNovaCharada = true
        const resposta = await fetch('http://127.0.0.1:5000/charadas/aleatoria')
        const dados = await resposta.json()
        campoPergunta.textContent = dados.pergunta
        campoResposta.textContent = dados.resposta
        
        // Voltar para a pergunta (frente do card)
        mostrarPergunta()
    } catch (erro) {
        campoPergunta.textContent = "Erro ao conectar ao servidor"
        campoResposta.textContent = "Verifique se o backend está rodando"
        console.error(erro)
    } finally {
        aguardandoNovaCharada = false
    }
}

// Acertei
btnAcertou.addEventListener('click', (e) => {
    e.stopPropagation()
    
    acertos++
    sequencia++
    total++
    atualizarPlacar()
    
    // Mostrar toast de confirmação
    const toast = document.getElementById('toast')
    const toastMsg = document.getElementById('toastMsg')
    toastMsg.textContent = '🎉 Desvendou o enigma! +1 ponto'
    toast.style.opacity = '1'
    setTimeout(() => {
        toast.style.opacity = '0'
    }, 2000)
    
    // Aguarda um pouco e busca nova charada
    setTimeout(() => {
        buscaCharada()
    }, 300)
})

// Errei
btnErrou.addEventListener('click', (e) => {
    e.stopPropagation()
    
    sequencia = 0
    total++
    atualizarPlacar()
    
    // Mostrar toast de confirmação
    const toast = document.getElementById('toast')
    const toastMsg = document.getElementById('toastMsg')
    toastMsg.textContent = '💀 Sequência quebrada! Tente novamente'
    toast.style.opacity = '1'
    setTimeout(() => {
        toast.style.opacity = '0'
    }, 2000)
    
    // Aguarda um pouco e busca nova charada
    setTimeout(() => {
        buscaCharada()
    }, 300)
})

// Nova charada (pular a atual)
btnNova.addEventListener('click', () => {
    buscaCharada()
})

// Resetar estatísticas
btnResetar.addEventListener('click', () => {
    acertos = 0
    sequencia = 0
    total = 0
    atualizarPlacar()
    
    // Mostrar toast de confirmação
    const toast = document.getElementById('toast')
    const toastMsg = document.getElementById('toastMsg')
    toastMsg.textContent = '⚡ Estatísticas resetadas!'
    toast.style.opacity = '1'
    setTimeout(() => {
        toast.style.opacity = '0'
    }, 2000)
})

// Iniciar o jogo
buscaCharada()