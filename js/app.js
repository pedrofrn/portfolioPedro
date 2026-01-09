const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const data = document.querySelector('.portfolio .data');
const currDate = new Date();
data.innerText = `${meses[currDate.getMonth()]} de ${currDate.getFullYear()}`;
const main = document.querySelector('main');
const trabalhos = main.querySelector('div.trabalhos');

// Dark Mode Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerText = '☀️';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggle.innerText = '☀️';
    } else {
        themeToggle.innerText = '🌙';
    }
    localStorage.setItem('theme', theme);
});

fetch('trabalhos.json')
    .then(response => response.json())
    .then(data => {
        let tudo = data.length;
        let design = 0;
        let web = 0;

        data.reverse().forEach((trabalho, index) => {
            trabalho.tipo === 'design' ? design++ : web++;
            const divTrabalho = createDiv('single');
            const imagemTrabalho = createImg(trabalho.imagem);
            imagemTrabalho.dataset.index = index;
            divTrabalho.appendChild(imagemTrabalho);
            trabalhos.appendChild(divTrabalho);
            
            // Animação de entrada
            setTimeout(() => {
                divTrabalho.classList.add('visible');
            }, index * 100);
        });

        const sobreTrabalhos = createDiv('sobre', `<span>Tudo (${tudo})</span>`);
        const sobreDesign = createDiv('sobre', `<span>Design (${design})</span>`);
        const sobreWeb = createDiv('sobre', `<span>Web (${web})</span>`);
        const divFlex = createDiv('flex');
        sobreTrabalhos.querySelector('span').classList.add('active')
        divFlex.appendChild(sobreTrabalhos);
        divFlex.appendChild(sobreDesign);
        divFlex.appendChild(sobreWeb);
        main.insertBefore(divFlex, trabalhos);

        divFlex.addEventListener('click', (event) => {
            const spans = divFlex.querySelectorAll('span');
            spans.forEach(span => {
                if (span.classList.contains('active')) span.classList.remove('active');
                if (span === event.target) {
                    span.classList.add('active');
                    const filtro = event.target.innerText.replaceAll(/[\(\) \d]+/g, '').toLowerCase();
                    filtroTipo(data, filtro)
                }
            });
        })

        const imagens = document.querySelectorAll('.single img');
        imagens.forEach(imagem => {
            imagem.addEventListener('click', () => {
                const index = parseInt(imagem.dataset.index);
                openLightbox(index, data);
            });
        });
    })

    .catch(error => console.error('Erro ao ler o arquivo JSON:', error));

function createDiv(classe, innerCode = null) {
    const div = document.createElement('div');
    div.classList.add(classe);
    if (innerCode) div.innerHTML = innerCode;
    return div;
}

function createImg(src) {
    const img = document.createElement('img');
    img.src = src;
    return img;
}

function filtroTipo(data, filtro) {
    trabalhos.innerHTML = '';
    let visibleIndex = 0;
    data.forEach((trabalho, index) => {
        if (trabalho.tipo.toLowerCase() === filtro || filtro === 'tudo') {
            const divTrabalho = createDiv('single');
            const imagemTrabalho = createImg(trabalho.imagem);
            imagemTrabalho.dataset.index = index;
            divTrabalho.appendChild(imagemTrabalho);
            trabalhos.appendChild(divTrabalho);
            
            // Animação de entrada
            setTimeout(() => {
                divTrabalho.classList.add('visible');
            }, visibleIndex * 100);
            visibleIndex++;
        }
    });
    const imagens = document.querySelectorAll('.single img');
    imagens.forEach(imagem => {
        imagem.addEventListener('click', () => {
            const index = parseInt(imagem.dataset.index);
            openLightbox(index, data);
        });
    });
}

function openLightbox(index, data) {
    const larguraWindow = window.innerWidth;
    
    // Remove lightbox anterior se existir (para navegação)
    const existingLightbox = document.querySelector('.lightbox');
    if (existingLightbox) existingLightbox.remove();

    const lightbox = document.createElement('div');
    const fechar = createDiv('fechar');
    
    // Tags HTML
    const tagsHtml = data[index].tags ? `<div class="tags-container">${data[index].tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';

    const contentHtml = `
        <span class="tipo">${data[index].tipo}</span>
        <h2>${data[index].titulo}</h2>
        ${tagsHtml}
        <p>${data[index].descricao}</p>
        ${data[index].link !== '' ? '<div class="link">Confira <a href="' + data[index].link + '" target="_blank">neste link</a>.</div>' : ''}
        <div class="rodapeLightbox">Produzido por <strong>Pedro Fernandes</strong></div>
    `;

    const sobreTrabalho = createDiv('sobreTrabalho', contentHtml);
    lightbox.classList.add('lightbox');
    
    // Navegação
    const btnPrev = createDiv('nav-btn prev', '&#10094;'); // Seta esquerda
    const btnNext = createDiv('nav-btn next', '&#10095;'); // Seta direita

    const imagem = createImg(data[index].imagem);
    
    // Container da imagem para posicionar setas relativas a ela se desejar, 
    // mas aqui deixaremos as setas no container principal por simplicidade.
    lightbox.appendChild(btnPrev);
    lightbox.appendChild(imagem);
    lightbox.appendChild(btnNext);
    
    lightbox.appendChild(fechar);
    lightbox.appendChild(sobreTrabalho);
    document.body.appendChild(lightbox);

    if (larguraWindow > 900) document.querySelector('.sobreTrabalho').style.height = `${imagem.offsetHeight}px`;
    else {
        document.querySelector('.sobreTrabalho').style.width = `${imagem.offsetWidth}px`;
    }

    // Eventos
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox || event.target === fechar) document.body.removeChild(lightbox);
    });

    btnPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (index - 1 + data.length) % data.length;
        openLightbox(newIndex, data);
    });

    btnNext.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (index + 1) % data.length;
        openLightbox(newIndex, data);
    });

    document.addEventListener("keydown", function handleKey(event) {
        if (event.key === "Escape") {
            if(document.body.contains(lightbox)) lightbox.remove();
            document.removeEventListener("keydown", handleKey);
        }
        if (event.key === "ArrowLeft") {
            document.removeEventListener("keydown", handleKey);
            const newIndex = (index - 1 + data.length) % data.length;
            openLightbox(newIndex, data);
        }
        if (event.key === "ArrowRight") {
            document.removeEventListener("keydown", handleKey);
            const newIndex = (index + 1) % data.length;
            openLightbox(newIndex, data);
        }
    });
}