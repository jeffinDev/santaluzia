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
const totalVotos = document.getElementById('totalVotos');
const totalProjetos = document.getElementById('totalProjetos');
const projetoLider = document.getElementById('projetoLider');
const corpoTabela = document.getElementById('corpoTabela');
const btnExportPDF = document.getElementById('btnExportPDF');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnResetAll = document.getElementById('btnResetAll');
const btnVoltar = document.getElementById('btnVoltar');
const uploadLogo = document.getElementById('uploadLogo');

// Obter votos do localStorage
function obterVotos() {
    return JSON.parse(localStorage.getItem('votacaoProjetos')) || {};
}

// Salvar votos no localStorage
function salvarVotos(votos) {
    localStorage.setItem('votacaoProjetos', JSON.stringify(votos));
}

// Carregar logo no admin
function carregarLogoAdmin() {
    const logoElement = document.getElementById('logoEscolaAdmin');
    const img = new Image();
    img.onload = function() {
        logoElement.style.backgroundImage = 'url("logo.png")';
    };
    img.onerror = function() {
        logoElement.innerHTML = '<div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: #4b6aa2; font-weight: bold; text-align: center; padding: 5px; font-size: 12px;">SANTA luzia</div>';
    };
    img.src = 'logo.png';
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const votos = obterVotos();
    const somaVotos = Object.values(votos).reduce((total, votos) => total + votos, 0);
    
    totalVotos.textContent = somaVotos;
    totalProjetos.textContent = projetos.length;
    
    // Encontrar projeto líder
    let projetoMaisVotado = '';
    let maxVotos = 0;
    
    Object.entries(votos).forEach(([projeto, quantidade]) => {
        if (quantidade > maxVotos) {
            maxVotos = quantidade;
            projetoMaisVotado = projeto;
        }
    });
    
    if (maxVotos > 0) {
        projetoLider.textContent = `${projetoMaisVotado.split(' – ')[0]} (${maxVotos} votos)`;
    } else {
        projetoLider.textContent = 'Nenhum voto registrado';
    }
}

// Atualizar tabela de resultados
function atualizarTabela() {
    corpoTabela.innerHTML = '';
    const votos = obterVotos();
    
    // Ordenar por votos (maior para menor)
    const projetosOrdenados = Object.keys(votos).sort((a, b) => votos[b] - votos[a]);
    
    projetosOrdenados.forEach(projeto => {
        const linha = document.createElement('tr');
        
        const celulaProjeto = document.createElement('td');
        celulaProjeto.textContent = projeto;
        
        const celulaVotos = document.createElement('td');
        celulaVotos.textContent = votos[projeto];
        celulaVotos.style.fontWeight = 'bold';
        celulaVotos.style.color = 'var(--vermelho)';
        
        const celulaAcoes = document.createElement('td');
        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn-remove';
        btnRemover.textContent = 'Remover Voto';
        btnRemover.addEventListener('click', () => removerVoto(projeto));
        
        celulaAcoes.appendChild(btnRemover);
        
        linha.appendChild(celulaProjeto);
        linha.appendChild(celulaVotos);
        linha.appendChild(celulaAcoes);
        
        corpoTabela.appendChild(linha);
    });
}

// Remover voto
function removerVoto(projeto) {
    if (confirm(`Tem certeza que deseja remover um voto do projeto "${projeto}"?`)) {
        const votos = obterVotos();
        if (votos[projeto] > 0) {
            votos[projeto]--;
            salvarVotos(votos);
            atualizarEstatisticas();
            atualizarTabela();
        }
    }
}

// Resetar todos os votos
function resetarTodosVotos() {
    if (confirm('ATENÇÃO: Esta ação irá resetar TODOS os votos para zero. Esta operação não pode ser desfeita. Tem certeza?')) {
        const votosResetados = {};
        projetos.forEach(projeto => {
            votosResetados[projeto] = 0;
        });
        salvarVotos(votosResetados);
        atualizarEstatisticas();
        atualizarTabela();
        alert('Todos os votos foram resetados com sucesso!');
    }
}

// Exportar para PDF
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(75, 106, 162);
    doc.text('Relatório de Votação - Escola Santa luzia', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Feira de Ciências 2025 - Painel Administrativo', 105, 30, { align: 'center' });
    
    // Data de geração
    const data = new Date().toLocaleDateString('pt-BR');
    const hora = new Date().toLocaleTimeString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Relatório gerado em: ${data} às ${hora}`, 105, 40, { align: 'center' });
    
    // Estatísticas
    const votos = obterVotos();
    const total = Object.values(votos).reduce((soma, v) => soma + v, 0);
    
    doc.setFontSize(12);
    doc.text(`Total de votos registrados: ${total}`, 20, 55);
    
    // Tabela de resultados
    const projetosOrdenados = Object.keys(votos).sort((a, b) => votos[b] - votos[a]);
    const tableData = projetosOrdenados.map(projeto => [projeto, votos[projeto]]);
    
    doc.autoTable({
        startY: 65,
        head: [['Projeto', 'Votos']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [75, 106, 162],
            textColor: 255
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        styles: {
            fontSize: 9,
            cellPadding: 3
        }
    });
    
    // Salvar o PDF
    doc.save(`relatorio-votacao-${data.replace(/\//g, '-')}.pdf`);
}

// Exportar para CSV
function exportarCSV() {
    const votos = obterVotos();
    const projetosOrdenados = Object.keys(votos).sort((a, b) => votos[b] - votos[a]);
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Projeto;Votos\n";
    
    projetosOrdenados.forEach(projeto => {
        const projetoFormatado = projeto.replace(/;/g, ',');
        csvContent += `"${projetoFormatado}";${votos[projeto]}\n`;
    });
    
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resultados-votacao-${data}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
}

// Upload da logo
function inicializarUploadLogo() {
    uploadLogo.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Atualiza a logo na página atual
                const logos = document.querySelectorAll('.logo');
                logos.forEach(logo => {
                    logo.style.backgroundImage = `url('${e.target.result}')`;
                });
                alert('Logo atualizada com sucesso!');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Inicializar painel admin
function inicializarAdmin() {
    carregarLogoAdmin();
    atualizarEstatisticas();
    atualizarTabela();
    inicializarUploadLogo();
    
    // Event listeners
    btnExportPDF.addEventListener('click', exportarPDF);
    btnExportCSV.addEventListener('click', exportarCSV);
    btnResetAll.addEventListener('click', resetarTodosVotos);
    btnVoltar.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializarAdmin);