// Lista de projetos para votação
const projetos = [
    "Aromaterapia do Sono – 8º A",
    "Acessibilidade: Praça para Deficiente Visual – 9º Ano",
    "Da Ciência ao Sabor: Produção de Iogurte Natural – 6º Ano",
    "Farmácia Viva: O Poder das Plantas Medicinais – 7º Ano",
    "DNA Emocional – 9º Ano",
    "Sentir Para Entender – 6º Ano",
    "Do Lixo ao Luxo: Transformando Plásticos em Natureza – 6º Ano",
    "Fragrâncias Naturais: Aromas Sustentáveis – 7º Ano",
    "Ecofy: Conectando Mentes Ecológicas – 8º Ano A",
    "Mão Amiga App: Conectando Corações Solidários – 8º Ano A",
    "Jogos Recicláveis – 8º Ano B",
    "Compostaggio: Do Orgânico ao Adubo – 8º Ano B",
    "Acessibilidade e Pessoas com Deficiência: Importância e Desafios – 7º Ano",
    "Ciências e Sustentabilidade: Reciclagem Transformando o Futuro – 8º Ano B"
];

// Elementos DOM
const botoesProjetos = document.getElementById('botoesProjetos');
const notificacao = document.getElementById('notificacao');
const modalResultados = document.getElementById('modalResultados');
const listaResultados = document.getElementById('listaResultados');
const btnResultados = document.getElementById('btnResultados');
const btnFecharModal = document.getElementById('btnFecharModal');
const modalAdmin = document.getElementById('modalAdmin');
const btnAcessoAdmin = document.getElementById('btnAcessoAdmin');
const btnLoginAdmin = document.getElementById('btnLoginAdmin');
const btnCancelarAdmin = document.getElementById('btnCancelarAdmin');
const usuarioAdmin = document.getElementById('usuarioAdmin');
const senhaAdmin = document.getElementById('senhaAdmin');

// Credenciais de administrador
const USUARIO_ADMIN = "admin";
const SENHA_ADMIN = "santaluzia2025";

// Inicializar votos no localStorage se não existirem
function inicializarVotos() {
    if (!localStorage.getItem('votacaoProjetos')) {
        const votosIniciais = {};
        projetos.forEach(projeto => {
            votosIniciais[projeto] = 0;
        });
        localStorage.setItem('votacaoProjetos', JSON.stringify(votosIniciais));
    }
}

// Obter votos do localStorage
function obterVotos() {
    return JSON.parse(localStorage.getItem('votacaoProjetos'));
}

// Salvar votos no localStorage
function salvarVotos(votos) {
    localStorage.setItem('votacaoProjetos', JSON.stringify(votos));
}

// Registrar voto
function registrarVoto(projeto) {
    const votos = obterVotos();
    votos[projeto]++;
    salvarVotos(votos);
    
    // Mostrar notificação
    notificacao.classList.add('mostrar');
    setTimeout(() => {
        notificacao.classList.remove('mostrar');
    }, 2000);
}

// Criar botões de projetos
function criarBotoesProjetos() {
    botoesProjetos.innerHTML = '';
    projetos.forEach(projeto => {
        const botao = document.createElement('button');
        botao.className = 'botao-projeto';
        botao.textContent = projeto;
        botao.addEventListener('click', () => registrarVoto(projeto));
        botoesProjetos.appendChild(botao);
    });
}

// Mostrar resultados
function mostrarResultados() {
    listaResultados.innerHTML = '';
    const votos = obterVotos();
    
    // Ordenar por votos (maior para menor)
    const projetosOrdenados = Object.keys(votos).sort((a, b) => votos[b] - votos[a]);
    
    projetosOrdenados.forEach(projeto => {
        const item = document.createElement('div');
        item.className = 'resultado-item';
        
        const nome = document.createElement('div');
        nome.className = 'resultado-nome';
        nome.textContent = projeto;
        
        const votosCount = document.createElement('div');
        votosCount.className = 'resultado-votos';
        votosCount.textContent = `${votos[projeto]} voto${votos[projeto] !== 1 ? 's' : ''}`;
        
        item.appendChild(nome);
        item.appendChild(votosCount);
        listaResultados.appendChild(item);
    });
    
    modalResultados.classList.add('mostrar');
}

// Carregar logo da escola
function carregarLogo() {
    const logoElement = document.getElementById('logoEscola');
    
    // Tenta carregar a logo com nome simples
    const img = new Image();
    img.onload = function() {
        logoElement.style.backgroundImage = 'url("logo.png")';
        console.log('Logo carregada com sucesso!');
    };
    img.onerror = function() {
        // Se não encontrar a logo, mostra texto
        logoElement.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: white; font-weight: bold; text-align: center; padding: 10px; font-size: 14px;">ESCOLA<br>SANTA luzia</div>';
        console.log('Logo não encontrada. Usando texto alternativo.');
    };
    img.src = 'logo.png';
}

// Autenticar admin
function autenticarAdmin() {
    if (usuarioAdmin.value === USUARIO_ADMIN && senhaAdmin.value === SENHA_ADMIN) {
        // Redirecionar para a página de admin
        window.location.href = 'admin.html';
    } else {
        alert("Usuário ou senha incorretos. Acesso negado.");
        usuarioAdmin.value = '';
        senhaAdmin.value = '';
        usuarioAdmin.focus();
    }
}

// Inicializar a aplicação
function inicializar() {
    inicializarVotos();
    criarBotoesProjetos();
    carregarLogo();
    
    // Event listeners
    btnResultados.addEventListener('click', mostrarResultados);
    btnFecharModal.addEventListener('click', () => {
        modalResultados.classList.remove('mostrar');
    });
    
    btnAcessoAdmin.addEventListener('click', () => {
        modalAdmin.classList.add('mostrar');
        usuarioAdmin.focus();
    });
    
    btnLoginAdmin.addEventListener('click', autenticarAdmin);
    
    btnCancelarAdmin.addEventListener('click', () => {
        modalAdmin.classList.remove('mostrar');
        usuarioAdmin.value = '';
        senhaAdmin.value = '';
    });
    
    // Permitir Enter para autenticar
    senhaAdmin.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            autenticarAdmin();
        }
    });
    
    // Fechar modais ao clicar fora
    [modalResultados, modalAdmin].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('mostrar');
                if (modal === modalAdmin) {
                    usuarioAdmin.value = '';
                    senhaAdmin.value = '';
                }
            }
        });
    });
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);