
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
    const finalValue = 170;
    let currentCtrl = 0;

    // Loop de Geração de Img
    for (let i = initialValue; i >= finalValue; i--) {
        carregarImagem(i);
    };

    function gerarHistograma() {

        // Dados do Canvas (no momento redundante)
        const imagem = document.getElementById("imgOne");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Redimensionando a imagem para se ajustar ao tamanho do canvas
        canvas.width = imagem.width;
        canvas.height = imagem.height;
        ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);

        // Dados dos pixels da imagem no canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Inverte a imagem
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i]; // Vermelho
            imageData.data[i + 1] = 255 - imageData.data[i + 1]; // Verde
            imageData.data[i + 2] = 255 - imageData.data[i + 2]; // Azul
        }

        // Imagem invertida no canvas
        ctx.putImageData(imageData, 0, 0);

        // Contabilizando os valores de intensidade
        const intensidadeCount = new Array(256).fill(0);

        // Percorrendo todos os pixels e contabilizando as intensidades
        for (let i = 0; i < imageData.data.length; i += 4) {
            const intensity = Math.floor((
                imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2]
            ) / 3);
            intensidadeCount[intensity]++;
        }

        // Valores a serem excluídos de X (255 e 254)
        const exclusao = [255, 254];

        // Config do Plot
        const data = {
            labels: [],
            datasets: [{
                label: 'Histograma de Valores das Intensidades dos Pixels',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // Remove valores nulos (contagem zero) e valores de exclusão do vetor de intensidade
        for (let i = 0; i < 256; i++) {
            if (intensidadeCount[i] !== 0 && !exclusao.includes(i)) {
                data.labels.push(i);
                data.datasets[0].data.push(intensidadeCount[i]);
            }
        }

        // Configurações do gráfico
        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Obtém o elemento canvas para o gráfico
        const histogramCanvas = document.getElementById("histogramCanvas");

        // Cria e exibe o gráfico
        let myChart = new Chart(histogramCanvas, config);
       
        return myChart;
    }


    // Função para atualizar a cor do valor em x no gráfico
    function atualizarCorDoGrafico(myChart,valorX) {

        // Conjunto de dados no gráfico
        const dataset = myChart.data.datasets[0]; 
        const data = myChart.data;

        // Limpando a cor de fundo do dataset para que todos os valores tenham a cor padrão
        dataset.backgroundColor = data.labels.map(label => 'rgba(75, 192, 192, 0.2)');

        // Mudando a cor do valor em x
        if (valorX >= 0 && valorX < data.labels.length) {
            dataset.backgroundColor[valorX] = 'red'; // Altere a cor para a cor desejada
        }

        // Atualizando o gráfico no Chart
        myChart.update();
    }

    // Dentro da função animate
    function animate(timeStamp) {
        const delta = timeStamp - lastTime;
        lastTime = timeStamp;

        if (timer > timeInterval) {
            plotImagesFromArray(currentCtrl);

            // Chamando a função para atualizar a cor do gráfico ERRO
            atualizarCorDoGrafico(myChart, currentCtrl); 

            currentCtrl++;
            if (currentCtrl >= imageArray.length) currentCtrl = 0;
            timer = 0;
        } else {
            timer += delta;
        }

        requestAnimationFrame(animate);
    }


    // Chamando a função gerarHistograma
    const myChart = gerarHistograma();

    // Chamando a função de Animação
    animate(0);

    // GoGoGo!
    removerLoading();

});