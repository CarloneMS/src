
// Tudo Carregado em index.html
window.addEventListener("load", () => {
    console.log('All content Loaded');

    // Função para carregar e manipular a imagem
    function carregarImagem(lockUp) {
        const imagem = document.getElementById("imgOne");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");

        // Adicionei um ID aos divs de coluna
        const canvasContainer = document.getElementById("divTwo");
        canvasContainer.style.backgroundColor = "white";

        // Obtém as dimensões do contêiner do canvas
        const containerWidth = imagem.width;
        const containerHeight = imagem.height;

        // Define o tamanho do canvas para corresponder ao tamanho do contêiner
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Redimensiona a imagem para se ajustar ao tamanho do canvas
        ctx.drawImage(imagem, 0, 0, canvas.width, canvas.height);

        // Obtém os dados dos pixels da imagem
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Percorre todos os pixels e manipula as cores
        for (let i = 0; i < imageData.data.length; i += 4) {
            // Manipule as cores dos pixels aqui (inverter as cores)
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

        // Atualiza a imagem no canvas com as cores manipuladas
        ctx.putImageData(imageData, 0, 0);
    }


    // Chama a função quando a imagem estiver carregada
    carregarImagem(0);

    const fps = 20;
    const timeInterval = 1000 / fps;
    let timer = 0;
    let lastTime = 0;
    const initialValue = 230;
    let currentCtrl = initialValue;
    
    function animate(timeStamp) {
        const delta = timeStamp - lastTime;
        lastTime = timeStamp;

        if (timer > timeInterval) {
            //console.log(timer);
            currentCtrl -= 1;
            carregarImagem(currentCtrl);
            if (currentCtrl < 170) currentCtrl = initialValue;
            timer = 0;
        } else {
            timer += delta;
        }

        requestAnimationFrame(animate);
    }

    animate(0);

});