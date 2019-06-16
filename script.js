const pontoVista = [3,2,1];
const pontoPlano = [1,2,4];
const ponto1 = [2,2,2]
const ponto2 = [3,2,1]
const ponto3 = [4,5,7]
const normal = [];
var d, d0, d1;
var coordenadasPlano = [];
var matrizPerspectiva = [];
var matrizProjecao = [];
var matrizObjeto = [2,7,9,1];

function calculaVetorNormal(){
    normal[0] = (ponto1[1] - ponto2[1]) * (ponto3[2] - ponto2[2]) 
        - (ponto3[1] - ponto2[1]) * (ponto1[2] - ponto2[2]);

    normal[1] = - (ponto1[0] - ponto2[0]) * (ponto3[2] - ponto2[2]) 
        - (ponto3[0] - ponto2[0]) * (ponto1[2] - ponto2[2]);

    normal[2] = (ponto1[0] - ponto2[0]) * (ponto3[1] - ponto2[1]) 
        - (ponto3[0] - ponto2[0]) * (ponto1[1] - ponto2[1]);
}

function calculoD(){
    d0 = (pontoPlano[0] * normal[0]) + (pontoPlano[1] * normal[1]) + (pontoPlano[2] * normal[2]);
    d1 = (pontoVista[0] * normal[0]) + (pontoVista[1] * normal[1]) + (pontoVista[2] * normal[2]);
    d  = d0 - d1;
}

function calculoMatrizPerspectiva() {
    let a = pontoVista[0], b = pontoVista[1], c = pontoVista[2];
    let nx = normal[0], ny = normal[1], nz = normal[2];
    matrizPerspectiva[0] = [d + a * nx, a * ny, a * nz, -a * d0];
    matrizPerspectiva[1] = [b * nx, d + b * ny, b * nz, -b * d0];
    matrizPerspectiva[2] = [c * nx, c * ny, d + c * nz, -c * d0];
    matrizPerspectiva[3] = [nx, ny, nz, -d1];
}

function calculoProjecao(){
    let qtd = matrizObjeto.length;
    for (var i = 0; i < qtd; i ++){
        matrizProjecao[i] = 0;
        for (var j = 0; j < qtd; j++){
            matrizProjecao[i] += matrizPerspectiva[i][j] * matrizObjeto[j];
        }
    }
}

function transformaParaCartesianas(){
    let qtd = matrizProjecao.length;
    let z = matrizProjecao[qtd - 1];
    for (var i = 0; i < qtd; i++){
        matrizProjecao[i] /= z;
    }
}

function calculaProjecao() {
    calculaVetorNormal();
    calculoD();
    calculoMatrizPerspectiva();
    calculoProjecao();
    transformaParaCartesianas();
    coordenadasPlano[0] = matrizProjecao[0];
    coordenadasPlano[1] = matrizProjecao[1];
}

function desenhaLinha(){
    var canvas  = document.getElementById('myCanvas');
    var valorX  = document.getElementById('pontoX').value;
    var valorY  = document.getElementById('pontoY').value;
    var valorX2 = document.getElementById('pontoX2').value;
    var valorY2 = document.getElementById('pontoY2').value;
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(valorX, valorY);
        ctx.lineTo(valorX2, valorY2);
        ctx.stroke();
    }
}


