
// Tudo Carregado em index.html
window.addEventListener("load", () => {

    // Fim do estado de Preload
    console.log('All content Loaded');

    // Determinando tamanho e propriedades do cavas funcional e do seu div
    function defineCanvas(canvasUtil) {
        const imagem = document.getElementById("imgOne");
        const canvas = document.getElementById(canvasUtil);

        // Adicionei um ID aos divs de coluna
        const canvasContainer = document.getElementById("divTwo");
        canvasContainer.style.backgroundColor = "white";

        // Dimensões do contêiner do canvas
        const containerWidth = imagem.width;
        const containerHeight = imagem.height;

        // Definindo o tamanho do canvas para bater com o tamanho do contêiner
        canvas.width = containerWidth;
        canvas.height = containerHeight;
    }

    // Mostra o Div Principal depois do Loading
    function mostrarDiv() {
        const div = document.getElementById("mainDiv");
        div.style.display = "flex";
    }

    // Remover o elemento de "loading"
    function removerLoading() {
        const loadingDiv = document.getElementById("loadingDiv");
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }

    // Aplicando Propriedades ao Canvas
    defineCanvas("canvas");
    defineCanvas("canvasOculto");

    // Defina um vetor para armazenar os dados da imagem
    const imageArray = [];

    // Função para carregar e manipular a imagem e salvar os dados no vetor
    function carregarImagem(lockUp) {
        const imagem = document.getElementById("imgOne");
        const canvas = document.getElementById("canvasOculto");
        const ctx = canvas.getContext("2d");

        // Redimensiona a imagem para se ajustar ao tamanho do canvas
        ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);

        // Pegando os dados dos pixels da imagem no canvas
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Percorre todos os pixels e manipula as cores
        for (let i = 0; i < imageData.data.length; i += 4) {

            // Manipulei as cores dos pixels aqui (inverti as cores)
            imageData.data[i] = 255 - imageData.data[i]; // Vermelho
            imageData.data[i + 1] = 255 - imageData.data[i + 1]; // Verde
            imageData.data[i + 2] = 255 - imageData.data[i + 2]; // Azul

            // Calcula o valor da intensidade média (média das componentes R, G e B)
            const intensity = Math.floor((
                imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2]
            ) / 3);

            if (intensity < lockUp + 10) {
                imageData.data[i] = 100; // Vermelho
                imageData.data[i + 1] = 70; // Verde 
                imageData.data[i + 2] = 100; // Azul
            }

            if (intensity < lockUp) {
                imageData.data[i] = 200; // Vermelho
                imageData.data[i + 1] = 100; // Verde 
                imageData.data[i + 2] = 100; // Azul
            }
        }

        // Adicionando os dados da imagem manipulada ao novo vetor
        imageArray.push(imageData);

        // Não atualizar a imagem aqui
    };

    // Plotando as imagens do vetor
    function plotImagesFromArray(n) {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.putImageData(imageArray[n], 0, 0);
    };

    // Ctes de Animação
    const fps = 20;
    const timeInterval = 1000 / fps;
    let timer = 0;
    let lastTime = 0;
    const initialValue = 230;
    const finalValue   = 170;
    let currentCtrl = 0;

    // Loop de Geração de Img
    for (let i = initialValue; i >= finalValue; i--) {
        carregarImagem(i);
    };

    // Função de Animação
    function animate(timeStamp) {
        const delta = timeStamp - lastTime;
        lastTime = timeStamp;

        if (timer > timeInterval) {

            //console.log(currentCtrl)
            plotImagesFromArray(currentCtrl);

            // Condições de Loop Continuo
            currentCtrl++;
            if (currentCtrl >= imageArray.length) currentCtrl = 0;
            timer = 0;
        } else {
            timer += delta;
        };

        requestAnimationFrame(animate);
    };

    removerLoading();
    animate(0);


});