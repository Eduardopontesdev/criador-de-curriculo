// Variável para armazenar a imagem em base64
let imagemBase64 = null;

// Contadores para as seções dinâmicas
let contadorExperiencia = 1;
let contadorFormacao = 1;
let contadorCursos = 1;

// Chave para localStorage
const STORAGE_KEY = 'curriculo_dados';

// Sistema de abas
function mudarAba(abaId) {
    // Esconde todas as abas
    document.querySelectorAll('.conteudo-aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    // Remove classe ativa de todos os botões de aba
    document.querySelectorAll('.aba').forEach(aba => {
        aba.classList.remove('ativa');
    });
    
    // Mostra a aba selecionada
    document.getElementById(abaId).classList.add('ativa');
    
    // Ativa o botão correspondente
    document.querySelector(`[data-aba="${abaId}"]`).classList.add('ativa');
    
    // Se for a aba de preview, atualiza a visualização
    if (abaId === 'preview') {
        atualizarPreview();
    }
    
    // Salva dados automaticamente ao mudar de aba
    salvarDadosLocalStorage();
}

// Configuração do upload de imagem
function configurarUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fotoInput');
    const previewContainer = document.getElementById('previewContainerImg');
    const previewImage = document.getElementById('previewImage');
    
    // Clique na área de upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Botão de upload
    uploadArea.querySelector('.btn-upload').addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
    
    // Drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        uploadArea.classList.add('dragover');
    }
    
    function unhighlight() {
        uploadArea.classList.remove('dragover');
    }
    
    // Processar arquivo solto
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    // Processar arquivo selecionado
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            
            // Validar tipo de arquivo
            if (!file.type.match('image.*')) {
                alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF).');
                return;
            }
            
            // Validar tamanho do arquivo (2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('A imagem deve ter no máximo 2MB.');
                return;
            }
            
            // Ler arquivo e converter para base64
            const reader = new FileReader();
            reader.onload = function(e) {
                imagemBase64 = e.target.result;
                previewImage.src = imagemBase64;
                previewContainer.style.display = 'block';
                salvarDadosLocalStorage(); // Salva automaticamente
            };
            reader.readAsDataURL(file);
        }
    }
}

// Remover imagem
function removerImagem() {
    imagemBase64 = null;
    document.getElementById('previewContainerImg').style.display = 'none';
    document.getElementById('fotoInput').value = '';
    salvarDadosLocalStorage(); // Salva automaticamente
}

// Adicionar seções dinâmicas
function adicionarExperiencia() {
    contadorExperiencia++;
    const novaSecao = `
        <div class="secao-dinamica">
            <h3>Experiência #${contadorExperiencia} <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Cargo *</label>
                    <input type="text" name="cargoExperiencia" placeholder="Ex: Vendedor Sênior" required>
                </div>
                <div class="form-group">
                    <label>Empresa *</label>
                    <input type="text" name="empresaExperiencia" placeholder="Ex: Loja Magazine São Paulo" required>
                </div>
                <div class="form-group">
                    <label>Período *</label>
                    <input type="text" name="periodoExperiencia" placeholder="Ex: Mar 2020 - Presente" required>
                </div>
                <div class="form-group" style="grid-column: 1 / -1;">
                    <label>Realizações *</label>
                    <textarea name="realizacoesExperiencia" placeholder="Descreva suas principais realizações neste cargo (uma por linha)" required></textarea>
                </div>
            </div>
        </div>
    `;
    document.getElementById('secoes-experiencia').insertAdjacentHTML('beforeend', novaSecao);
    salvarDadosLocalStorage(); // Salva automaticamente
}

function adicionarFormacao() {
    contadorFormacao++;
    const novaSecao = `
        <div class="secao-dinamica">
            <h3>Formação #${contadorFormacao} <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Curso/Formação *</label>
                    <input type="text" name="cursoFormacao" placeholder="Ex: Ensino Médio Completo" required>
                </div>
                <div class="form-group">
                    <label>Instituição *</label>
                    <input type="text" name="instituicaoFormacao" placeholder="Ex: EE Professor João Silva" required>
                </div>
                <div class="form-group">
                    <label>Período/Ano de Conclusão *</label>
                    <input type="text" name="periodoFormacao" placeholder="Ex: Concluído: 2010" required>
                </div>
            </div>
        </div>
    `;
    document.getElementById('secoes-formacao').insertAdjacentHTML('beforeend', novaSecao);
    salvarDadosLocalStorage(); // Salva automaticamente
}

function adicionarCurso() {
    contadorCursos++;
    const novaSecao = `
        <div class="secao-dinamica">
            <h3>Curso #${contadorCursos} <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
            <div class="form-grid">
                <div class="form-group">
                    <label>Nome do Curso *</label>
                    <input type="text" name="nomeCurso" placeholder="Ex: Técnicas de Vendas" required>
                </div>
                <div class="form-group">
                    <label>Instituição *</label>
                    <input type="text" name="instituicaoCurso" placeholder="Ex: SENAC" required>
                </div>
                <div class="form-group">
                    <label>Duração/Ano *</label>
                    <input type="text" name="periodoCurso" placeholder="Ex: 40 horas (2016)" required>
                </div>
            </div>
        </div>
    `;
    document.getElementById('secoes-cursos').insertAdjacentHTML('beforeend', novaSecao);
    salvarDadosLocalStorage(); // Salva automaticamente
}

// Remover seções
function removerSecao(botao) {
    const secao = botao.closest('.secao-dinamica');
    if (document.querySelectorAll('.secao-dinamica').length > 1) {
        secao.remove();
        salvarDadosLocalStorage(); // Salva automaticamente
    } else {
        alert('É necessário ter pelo menos uma seção!');
    }
}

// Salvar dados no localStorage
function salvarDadosLocalStorage() {
    const dados = coletarDadosFormulario();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

// Carregar dados do localStorage
function carregarDadosLocalStorage() {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        preencherFormulario(dados);
    }
}

// Preencher formulário com dados salvos
function preencherFormulario(dados) {
    // Dados pessoais
    if (dados.nome) document.getElementById('nome').value = dados.nome;
    if (dados.cargo) document.getElementById('cargo').value = dados.cargo;
    if (dados.telefone) document.getElementById('telefone').value = dados.telefone;
    if (dados.email) document.getElementById('email').value = dados.email;
    if (dados.endereco) document.getElementById('endereco').value = dados.endereco;
    if (dados.cidade) document.getElementById('cidade').value = dados.cidade;
    if (dados.idade) document.getElementById('idade').value = dados.idade;
    if (dados.estadoCivil) document.getElementById('estadoCivil').value = dados.estadoCivil;
    if (dados.disponibilidade) document.getElementById('disponibilidade').value = dados.disponibilidade;
    if (dados.pretensao) document.getElementById('pretensao').value = dados.pretensao;
    
    // Foto
    if (dados.foto) {
        imagemBase64 = dados.foto;
        document.getElementById('previewImage').src = dados.foto;
        document.getElementById('previewContainerImg').style.display = 'block';
    }
    
    // Experiências
    if (dados.experiencias && dados.experiencias.length > 0) {
        // Remove a primeira seção vazia
        const primeiraSecao = document.querySelector('#secoes-experiencia .secao-dinamica');
        if (primeiraSecao) {
            primeiraSecao.remove();
        }
        
        // Adiciona as experiências salvas
        dados.experiencias.forEach((exp, index) => {
            if (index === 0) {
                // Para a primeira experiência, usa a seção existente
                const inputs = document.querySelectorAll('#secoes-experiencia input, #secoes-experiencia textarea');
                if (inputs[0]) inputs[0].value = exp.cargo;
                if (inputs[1]) inputs[1].value = exp.empresa;
                if (inputs[2]) inputs[2].value = exp.periodo;
                if (inputs[3]) inputs[3].value = exp.realizacoes.join('\n');
            } else {
                // Para as demais, cria novas seções
                adicionarExperiencia();
                const secoes = document.querySelectorAll('#secoes-experiencia .secao-dinamica');
                const ultimaSecao = secoes[secoes.length - 1];
                const inputs = ultimaSecao.querySelectorAll('input, textarea');
                if (inputs[0]) inputs[0].value = exp.cargo;
                if (inputs[1]) inputs[1].value = exp.empresa;
                if (inputs[2]) inputs[2].value = exp.periodo;
                if (inputs[3]) inputs[3].value = exp.realizacoes.join('\n');
            }
        });
    }
    
    // Formações
    if (dados.formacoes && dados.formacoes.length > 0) {
        const primeiraSecao = document.querySelector('#secoes-formacao .secao-dinamica');
        if (primeiraSecao) {
            primeiraSecao.remove();
        }
        
        dados.formacoes.forEach((form, index) => {
            if (index === 0) {
                const inputs = document.querySelectorAll('#secoes-formacao input');
                if (inputs[0]) inputs[0].value = form.curso;
                if (inputs[1]) inputs[1].value = form.instituicao;
                if (inputs[2]) inputs[2].value = form.periodo;
            } else {
                adicionarFormacao();
                const secoes = document.querySelectorAll('#secoes-formacao .secao-dinamica');
                const ultimaSecao = secoes[secoes.length - 1];
                const inputs = ultimaSecao.querySelectorAll('input');
                if (inputs[0]) inputs[0].value = form.curso;
                if (inputs[1]) inputs[1].value = form.instituicao;
                if (inputs[2]) inputs[2].value = form.periodo;
            }
        });
    }
    
    // Cursos
    if (dados.cursos && dados.cursos.length > 0) {
        const primeiraSecao = document.querySelector('#secoes-cursos .secao-dinamica');
        if (primeiraSecao) {
            primeiraSecao.remove();
        }
        
        dados.cursos.forEach((curso, index) => {
            if (index === 0) {
                const inputs = document.querySelectorAll('#secoes-cursos input');
                if (inputs[0]) inputs[0].value = curso.nome;
                if (inputs[1]) inputs[1].value = curso.instituicao;
                if (inputs[2]) inputs[2].value = curso.periodo;
            } else {
                adicionarCurso();
                const secoes = document.querySelectorAll('#secoes-cursos .secao-dinamica');
                const ultimaSecao = secoes[secoes.length - 1];
                const inputs = ultimaSecao.querySelectorAll('input');
                if (inputs[0]) inputs[0].value = curso.nome;
                if (inputs[1]) inputs[1].value = curso.instituicao;
                if (inputs[2]) inputs[2].value = curso.periodo;
            }
        });
    }
}

// Limpar todos os dados
function limparDados() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem(STORAGE_KEY);
        
        // Limpa todos os campos do formulário
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.type !== 'button' && element.type !== 'submit') {
                element.value = '';
            }
        });
        
        // Limpa a imagem
        removerImagem();
        
        // Reseta as seções dinâmicas
        document.getElementById('secoes-experiencia').innerHTML = `
            <div class="secao-dinamica">
                <h3>Experiência #1 <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Cargo *</label>
                        <input type="text" name="cargoExperiencia" placeholder="Ex: Vendedor Sênior" required>
                    </div>
                    <div class="form-group">
                        <label>Empresa *</label>
                        <input type="text" name="empresaExperiencia" placeholder="Ex: Loja Magazine São Paulo" required>
                    </div>
                    <div class="form-group">
                        <label>Período *</label>
                        <input type="text" name="periodoExperiencia" placeholder="Ex: Mar 2020 - Presente" required>
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label>Realizações *</label>
                        <textarea name="realizacoesExperiencia" placeholder="Descreva suas principais realizações neste cargo (uma por linha)" required></textarea>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('secoes-formacao').innerHTML = `
            <div class="secao-dinamica">
                <h3>Formação #1 <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Curso/Formação *</label>
                        <input type="text" name="cursoFormacao" placeholder="Ex: Ensino Médio Completo" required>
                    </div>
                    <div class="form-group">
                        <label>Instituição *</label>
                        <input type="text" name="instituicaoFormacao" placeholder="Ex: EE Professor João Silva" required>
                    </div>
                    <div class="form-group">
                        <label>Período/Ano de Conclusão *</label>
                        <input type="text" name="periodoFormacao" placeholder="Ex: Concluído: 2010" required>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('secoes-cursos').innerHTML = `
            <div class="secao-dinamica">
                <h3>Curso #1 <button type="button" class="btn-remover" onclick="removerSecao(this)">Remover</button></h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Nome do Curso *</label>
                        <input type="text" name="nomeCurso" placeholder="Ex: Técnicas de Vendas" required>
                    </div>
                    <div class="form-group">
                        <label>Instituição *</label>
                        <input type="text" name="instituicaoCurso" placeholder="Ex: SENAC" required>
                    </div>
                    <div class="form-group">
                        <label>Duração/Ano *</label>
                        <input type="text" name="periodoCurso" placeholder="Ex: 40 horas (2016)" required>
                    </div>
                </div>
            </div>
        `;
        
        // Reseta contadores
        contadorExperiencia = 1;
        contadorFormacao = 1;
        contadorCursos = 1;
        
        // Mostra mensagem de sucesso
        document.getElementById('alertReset').style.display = 'block';
        setTimeout(() => {
            document.getElementById('alertReset').style.display = 'none';
        }, 5000);
        
        // Atualiza preview
        if (document.getElementById('preview').classList.contains('ativa')) {
            atualizarPreview();
        }
    }
}

// Atualizar preview
function atualizarPreview() {
    const container = document.getElementById('previewContainer');
    
    // Coletar dados do formulário
    const dados = coletarDadosFormulario();
    
    // Verificar se há dados suficientes
    if (!dados.nome || !dados.cargo) {
        container.innerHTML = `
            <div class="preview-placeholder">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Dados Insuficientes</h3>
                <p>Preencha pelo menos o nome e cargo para visualizar o currículo</p>
            </div>
        `;
        return;
    }
    
    // Gerar HTML do currículo
    const htmlCurriculo = gerarHTMLCurriculo(dados);
    container.innerHTML = htmlCurriculo;
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    const dados = {
        // Dados pessoais
        nome: document.getElementById('nome').value,
        cargo: document.getElementById('cargo').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
        cidade: document.getElementById('cidade').value,
        idade: document.getElementById('idade').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        disponibilidade: document.getElementById('disponibilidade').value,
        pretensao: document.getElementById('pretensao').value,
        foto: imagemBase64,
        
        // Experiências
        experiencias: [],
        // Formações
        formacoes: [],
        // Cursos
        cursos: []
    };
    
    // Coletar experiências
    document.querySelectorAll('#secoes-experiencia .secao-dinamica').forEach(secao => {
        const inputs = secao.querySelectorAll('input, textarea');
        dados.experiencias.push({
            cargo: inputs[0].value,
            empresa: inputs[1].value,
            periodo: inputs[2].value,
            realizacoes: inputs[3].value.split('\n').filter(r => r.trim() !== '')
        });
    });
    
    // Coletar formações
    document.querySelectorAll('#secoes-formacao .secao-dinamica').forEach(secao => {
        const inputs = secao.querySelectorAll('input');
        dados.formacoes.push({
            curso: inputs[0].value,
            instituicao: inputs[1].value,
            periodo: inputs[2].value
        });
    });
    
    // Coletar cursos
    document.querySelectorAll('#secoes-cursos .secao-dinamica').forEach(secao => {
        const inputs = secao.querySelectorAll('input');
        dados.cursos.push({
            nome: inputs[0].value,
            instituicao: inputs[1].value,
            periodo: inputs[2].value
        });
    });
    
    return dados;
}

// Gerar HTML do currículo
function gerarHTMLCurriculo(dados) {
    // Foto padrão se não for fornecida
    const foto = dados.foto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80';
    
    return `
        <div class="curriculo-preview">
            <div class="botoes-acao-curriculo">
                <button class="btn-acao btn-whatsapp" onclick="compartilharWhatsApp()" title="Compartilhar no WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button class="btn-acao btn-print" onclick="imprimirCurriculo()" title="Imprimir Currículo">
                    <i class="fas fa-print"></i>
                </button>
            </div>
            
            <header class="cabecalho-curriculo">
                <img src="${foto}" alt="Foto de ${dados.nome}" class="foto-perfil">
                
                <div class="info-principal">
                    <h1>${dados.nome}</h1>
                    <h2>${dados.cargo}</h2>
                    <div class="contato-rapido">
                        <div class="contato-item">
                            <i class="fas fa-phone"></i>
                            <span>${dados.telefone}</span>
                        </div>
                        <div class="contato-item">
                            <i class="fas fa-envelope"></i>
                            <span>${dados.email}</span>
                        </div>
                        <div class="contato-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${dados.cidade}</span>
                        </div>
                    </div>
                </div>
            </header>

            <section class="secao">
                <h2 class="titulo-secao">Dados Pessoais</h2>
                <div class="info-pessoal">
                    ${dados.idade ? `<div class="info-item"><strong>Idade:</strong><span>${dados.idade} anos</span></div>` : ''}
                    ${dados.estadoCivil ? `<div class="info-item"><strong>Estado Civil:</strong><span>${dados.estadoCivil}</span></div>` : ''}
                    ${dados.endereco ? `<div class="info-item"><strong>Endereço:</strong><span>${dados.endereco}</span></div>` : ''}
                    ${dados.cidade ? `<div class="info-item"><strong>Cidade:</strong><span>${dados.cidade}</span></div>` : ''}
                    ${dados.disponibilidade ? `<div class="info-item"><strong>Disponibilidade:</strong><span>${dados.disponibilidade}</span></div>` : ''}
                    ${dados.pretensao ? `<div class="info-item"><strong>Pretensão Salarial:</strong><span>${dados.pretensao}</span></div>` : ''}
                </div>
            </section>

            ${dados.experiencias.length > 0 ? `
            <section class="secao">
                <h2 class="titulo-secao">Experiência Profissional</h2>
                ${dados.experiencias.map(exp => `
                    <div class="experiencia-item">
                        <div class="empresa-periodo">
                            <div class="cargo-empresa">
                                <h3>${exp.cargo}</h3>
                                <div class="descricao-cargo">${exp.empresa}</div>
                            </div>
                            <div class="periodo">${exp.periodo}</div>
                        </div>
                        ${exp.realizacoes.length > 0 ? `
                        <ul class="realizacoes">
                            ${exp.realizacoes.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </section>
            ` : ''}

            ${dados.formacoes.length > 0 ? `
            <section class="secao">
                <h2 class="titulo-secao">Formação Acadêmica</h2>
                ${dados.formacoes.map(form => `
                    <div class="formacao-item">
                        <div class="empresa-periodo">
                            <div class="formacao-info">
                                <h3>${form.curso}</h3>
                                <p>${form.instituicao}</p>
                            </div>
                            <div class="periodo">${form.periodo}</div>
                        </div>
                    </div>
                `).join('')}
            </section>
            ` : ''}

            ${dados.cursos.length > 0 ? `
            <section class="secao">
                <h2 class="titulo-secao">Cursos Complementares</h2>
                <div class="cursos-lista">
                    ${dados.cursos.map(curso => `
                        <div class="curso-item">
                            <h4>${curso.nome}</h4>
                            <p>${curso.instituicao} - ${curso.periodo}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            ` : ''}
            
            <button class="btn-flutuante-whatsapp" onclick="enviarWhatsApp()">
                <i class="fab fa-whatsapp"></i>
            </button>
        </div>
    `;
}

// Compartilhar no WhatsApp
function compartilharWhatsApp() {
    const dados = coletarDadosFormulario();
    const texto = `Confira o currículo de ${dados.nome} - ${dados.cargo}\n\n` +
                 `Experiência comprovada com excelentes resultados.\n` +
                 `Disponível para novas oportunidades!\n\n` +
                 `Contato: ${dados.telefone} | ${dados.email}`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

// Enviar mensagem direta no WhatsApp
function enviarWhatsApp() {
    const dados = coletarDadosFormulario();
    const telefone = "5511987654321"; // Número padrão, pode ser alterado
    const mensagem = `Olá ${dados.nome}! Vi seu currículo online e gostaria de conversar sobre uma oportunidade.`;
    
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}

// Imprimir currículo
// Imprimir currículo (ATUALIZADA)
function imprimirCurriculo() {
    // Salva os dados atuais antes de imprimir
    salvarDadosLocalStorage();
    
    // Abre a página de impressão otimizada
    window.open('impressao.html', '_blank');
}

// Salvar currículo
function salvarCurriculo() {
    const dados = coletarDadosFormulario();
    
    // Validar dados obrigatórios
    if (!dados.nome || !dados.cargo || !dados.telefone || !dados.email) {
        document.getElementById('alertError').style.display = 'block';
        setTimeout(() => {
            document.getElementById('alertError').style.display = 'none';
        }, 5000);
        return;
    }
    
    // Gerar HTML completo do currículo
    const htmlCompleto = gerarHTMLCompleto(dados);
    
    // Criar e baixar arquivo
    const blob = new Blob([htmlCompleto], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `curriculo-${dados.nome.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Mostrar mensagem de sucesso
    document.getElementById('alertSuccess').style.display = 'block';
    setTimeout(() => {
        document.getElementById('alertSuccess').style.display = 'none';
    }, 5000);
}

// Gerar HTML completo para download (CORRIGIDO)
function gerarHTMLCompleto(dados) {
    // CSS inline para o currículo gerado
    const cssEstilos = `
        <style>
            /* Reset e estilos básicos */
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --primary-color: #2c3e50;
                --secondary-color: #3498db;
                --accent-color: #e74c3c;
                --success-color: #27ae60;
                --warning-color: #f39c12;
                --info-color: #17a2b8;
                --text-color: #333;
                --text-light: #666;
                --bg-light: #f8f9fa;
                --white: #ffffff;
                --shadow: 0 2px 10px rgba(0,0,0,0.1);
                --transition: all 0.3s ease;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: var(--text-color);
                background: #f5f5f5;
                padding: 20px;
                min-height: 100vh;
            }

            .curriculo-preview {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                box-shadow: var(--shadow);
                border-radius: 10px;
                overflow: hidden;
            }

            .cabecalho-curriculo {
                background: var(--primary-color);
                color: white;
                padding: 2rem;
                display: flex;
                align-items: center;
                gap: 2rem;
            }

            .foto-perfil {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 4px solid var(--secondary-color);
            }

            .info-principal {
                flex: 1;
            }

            .cabecalho-curriculo h1 {
                margin: 0;
                font-size: 2.2rem;
                font-weight: 700;
            }

            .cabecalho-curriculo h2 {
                margin: 0.5rem 0 0 0;
                font-size: 1.3rem;
                font-weight: 400;
                color: #ecf0f1;
            }

            .contato-rapido {
                display: flex;
                gap: 2rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }

            .contato-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.9rem;
            }

            .contato-item i {
                color: var(--secondary-color);
            }

            .secao {
                padding: 2rem;
                border-bottom: 1px solid #ecf0f1;
            }

            .secao:last-child {
                border-bottom: none;
            }

            .titulo-secao {
                color: var(--primary-color);
                border-bottom: 2px solid var(--secondary-color);
                padding-bottom: 0.5rem;
                margin-bottom: 1.5rem;
                font-size: 1.4rem;
                font-weight: 600;
            }

            .info-pessoal {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }

            .info-item {
                display: flex;
                flex-direction: column;
            }

            .info-item strong {
                color: var(--primary-color);
                margin-bottom: 0.3rem;
                font-weight: 600;
            }

            .experiencia-item, .formacao-item {
                margin-bottom: 1.5rem;
            }

            .empresa-periodo {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 0.5rem;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .cargo-empresa h3 {
                margin: 0;
                color: var(--primary-color);
                font-size: 1.1rem;
                font-weight: 600;
            }

            .descricao-cargo {
                color: #34495e;
                margin-bottom: 0.5rem;
                font-style: italic;
            }

            .periodo {
                color: #7f8c8d;
                font-weight: 600;
                white-space: nowrap;
            }

            .realizacoes {
                list-style: none;
                padding: 0;
                margin: 0.5rem 0 0 0;
            }

            .realizacoes li {
                position: relative;
                padding-left: 1.2rem;
                margin-bottom: 0.3rem;
                color: #555;
            }

            .realizacoes li:before {
                content: "•";
                color: var(--secondary-color);
                position: absolute;
                left: 0;
                font-weight: bold;
            }

            .formacao-info h3 {
                margin: 0 0 0.3rem 0;
                color: var(--primary-color);
                font-size: 1.1rem;
                font-weight: 600;
            }

            .formacao-info p {
                margin: 0;
                color: #7f8c8d;
            }

            .cursos-lista {
                display: grid;
                gap: 1rem;
            }

            .curso-item {
                padding: 0.5rem 0;
            }

            .curso-item h4 {
                margin: 0 0 0.2rem 0;
                color: var(--primary-color);
                font-weight: 600;
            }

            .curso-item p {
                margin: 0;
                color: #7f8c8d;
                font-size: 0.9rem;
            }

            .btn-flutuante-whatsapp {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: var(--success-color);
                color: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                z-index: 1000;
                font-size: 1.5rem;
            }

            .btn-flutuante-whatsapp:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(0,0,0,0.3);
            }

            .botoes-acao-curriculo {
                position: fixed;
                top: 2rem;
                right: 2rem;
                display: flex;
                gap: 0.5rem;
            }

            .btn-acao {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--white);
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
                box-shadow: var(--shadow);
                color: var(--primary-color);
            }

            .btn-acao:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .btn-whatsapp {
                background: var(--success-color);
                color: white;
            }

            .btn-print {
                background: var(--info-color);
                color: white;
            }

            @media (max-width: 768px) {
                .cabecalho-curriculo {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .contato-rapido {
                    justify-content: center;
                }
                
                .botoes-acao-curriculo {
                    position: static;
                    justify-content: center;
                    margin-top: 1rem;
                }
            }

            @media print {
                body * {
                    visibility: hidden;
                }
                
                .curriculo-preview,
                .curriculo-preview * {
                    visibility: visible;
                }
                
                .curriculo-preview {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                
                .btn-flutuante-whatsapp,
                .botoes-acao-curriculo {
                    display: none !important;
                }
                
                .cabecalho-curriculo {
                    background: var(--primary-color) !important;
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }
            }
        </style>
    `;
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${dados.nome}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    ${cssEstilos}
</head>
<body>
    ${gerarHTMLCurriculo(dados)}
    
    <script>
        function enviarWhatsApp() {
            const telefone = "5511987654321";
            const mensagem = "Olá ${dados.nome}! Vi seu currículo online e gostaria de conversar sobre uma oportunidade.";
            const url = "https://wa.me/" + telefone + "?text=" + encodeURIComponent(mensagem);
            window.open(url, '_blank');
        }

        function imprimirCurriculo() {
            window.print();
        }
        
        function compartilharWhatsApp() {
            const texto = "Confira o currículo de ${dados.nome} - ${dados.cargo}\\\\n\\\\n" +
                         "Experiência comprovada com excelentes resultados.\\\\n" +
                         "Disponível para novas oportunidades!\\\\n\\\\n" +
                         "Contato: ${dados.telefone} | ${dados.email}";
            const url = "https://wa.me/?text=" + encodeURIComponent(texto);
            window.open(url, '_blank');
        }
    </script>
</body>
</html>`;
}

// Adicionar event listeners para salvar automaticamente
function configurarAutoSave() {
    // Salva quando o usuário digita nos campos
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', salvarDadosLocalStorage);
        element.addEventListener('change', salvarDadosLocalStorage);
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar upload de imagem
    configurarUpload();
    
    // Configurar auto-save
    configurarAutoSave();
    
    // Carregar dados salvos
    carregarDadosLocalStorage();
    
    // Adicionar event listeners para as abas
    document.querySelectorAll('.aba').forEach(aba => {
        aba.addEventListener('click', function() {
            const abaId = this.getAttribute('data-aba');
            mudarAba(abaId);
        });
    });
});