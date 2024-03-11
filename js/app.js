const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const data = document.querySelector('.portfolio .data');
const date = new Date();
data.innerText = `${meses[date.getMonth()]} de ${date.getFullYear()}`;
const main = document.querySelector('main');
const trabalhos = main.querySelector('div.trabalhos');

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
    data.forEach((trabalho, index) => {
        if (trabalho.tipo === filtro || filtro === 'tudo') {
            const divTrabalho = createDiv('single');
            const imagemTrabalho = createImg(trabalho.imagem);
            imagemTrabalho.dataset.index = index;
            divTrabalho.appendChild(imagemTrabalho);
            trabalhos.appendChild(divTrabalho);
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
    const lightbox = document.createElement('div');
    const sobreTrabalho = createDiv('sobreTrabalho', `<span class="tipo">${data[index].tipo}</span><h2>${data[index].titulo}</h2><p>${data[index].descricao}</p>${data[index].link !== '' ? '<div class="link">Confira <a href="' + data[index].link + '" target="_blank">neste link</a>.</div>' : ''}<div class="rodapeLightbox">Produzido por <strong>Pedro Fernandes</strong></div>`)
    lightbox.classList.add('lightbox');
    const imagem = createImg(data[index].imagem);
    lightbox.appendChild(imagem);
    lightbox.appendChild(sobreTrabalho);
    document.body.appendChild(lightbox);
    document.querySelector('.sobreTrabalho').style.height = `${imagem.offsetHeight}px`;
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) document.body.removeChild(lightbox);
    });
    document .addEventListener("keydown", (event) => {
        if (event.key === "Escape") document.body.removeChild(lightbox);
    });
}