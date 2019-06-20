const pontoVista = [3,2,8];
const pontoPlano = [0,0,0];
const ponto1 = [1,0,0]
const ponto2 = [0,0,0]
const ponto3 = [0,1,0]
const normal = [];
var quantidadeVertices = 8;
var d, d0, d1;
var coordenadasPlano = [];
var matrizPerspectiva = [];
var matrizProjecao = [[],[],[],[]];
var matrizHomogenea = [[],[],[],[]];
var matrizObjeto = [[3,4,4,3,4,4,3,3], [3,4,3,4,4,3,3,4], [3,4,3,3,3,4,4,4], [1,1,1,1,1,1,1,1]];

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
    for (let x = 0; x < 4; x ++){
        for (let y = 0; y < 4; y++){
            if(matrizPerspectiva[x][y] == -0){
                matrizPerspectiva[x][y] = 0;
            }
        }
    }
}

function calculaMatrizProjecao(){
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < quantidadeVertices; j++){
            matrizProjecao[i][j] = 0;
            for (let k = 0; k < 4; k++){
                matrizProjecao[i][j] += matrizPerspectiva[i][k] * matrizObjeto[k][j];
            }
        }
    }

}

function transformaParaCartesianas(){
    for (let i = 0; i < quantidadeVertices; i++){
        let valorW = matrizProjecao[3][i];
        for(let j = 0; j < 4; j ++){
            matrizHomogenea[j][i] = matrizProjecao[j][i] / valorW;
            if(matrizHomogenea[j][i] === -0 ){
                matrizHomogenea[j][i] = 0;
            }
        }
    }
}

function calculaProjecao() {
    calculaVetorNormal();
    calculoD();
    calculoMatrizPerspectiva();
    calculaMatrizProjecao();
    transformaParaCartesianas();
    //console.log(matrizProjecao);
    console.log(matrizHomogenea);
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


calculaProjecao();

