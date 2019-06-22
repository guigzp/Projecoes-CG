var pontoVista = [3,2,8];
var pontoPlano = [0,0,0];
var ponto1 = [1,0,0];
var ponto2 = [0,0,0];
var ponto3 = [0,1,0];
var normal = [];
var quantidadeVertices = 8;
var d, d0, d1;
var coordenadasPlano = [];
var matrizPerspectiva = [];
var matrizProjecao = [[],[],[],[]];
var matrizHomogenea = [[],[],[],[]];
var matrizObjeto = [[3,4,4,3,4,4,3,3], [3,4,3,4,4,3,3,4], [3,4,3,3,3,4,4,4], [1,1,1,1,1,1,1,1]];
var matrizCartesianas = [[], []];
var xMax, yMax, xMin, yMin;
var uMax = 640, vMax = 480, uMin = 0, vMin = 0;

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

function transformaHomogeneas(){
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

function pegaCartesianasReflete(){
    matrizCartesianas[0] = matrizHomogenea[0];
    matrizCartesianas[1] = matrizHomogenea[1].map(element => -1 * element);
}

function pegaCartesianas(){
    matrizCartesianas[0] = matrizHomogenea[0];
    matrizCartesianas[1] = matrizHomogenea[1];
    matrizCartesianas[2] = matrizHomogenea[3];
}

function calculaJanela(){
    xMin = Math.min(...matrizCartesianas[0]);
    xMax = Math.max(...matrizCartesianas[0]);
    yMin = Math.min(...matrizCartesianas[1]);
    yMax = Math.max(...matrizCartesianas[1]);
    //xMin = xMin - (0.2 * Math.abs(xMax-xMin));
    //xMax = xMax + (0.2 * Math.abs(xMax-xMin));
    //yMin = yMin - (0.2 * Math.abs(yMax-yMin));
    //yMax = yMax + (0.2 * Math.abs(yMax-yMin));

}

function transladaOrigemMundo(){
    let Rw = vMax / uMax;
    let Rv = (xMax - xMin) / (yMax - yMin);
    if(Rw > Rv){
        vMax = ((uMax - uMin) / Rw) + vMin;
    }else if (Rw < Rv){
        uMax = Rw*(vMax - vMin) + uMin;
    }
    let Sx = (uMax - uMin) / (xMax - xMin);
    let Sy = (vMax - vMin) / (yMax - yMin);
    let matrizTranslação = [[Sx,0, (-xMin*Sx) + uMin], [0, Sy, (-yMin*Sy) + vMin], [0,0,1]];
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < quantidadeVertices; j++){
            let aux = 0;
            for (let k = 0; k < 3; k++){
                aux += matrizTranslação[i][k] * matrizCartesianas[k][j];
            }
            matrizCartesianas[i][j] = aux;
        }
    }
    matrizCartesianas.pop();
}

function calculaProjecao() {
    calculaVetorNormal();
    calculoD();
    calculoMatrizPerspectiva();
    calculaMatrizProjecao();
    transformaHomogeneas();
    pegaCartesianas()
    calculaJanela();
    transladaOrigemMundo();
}

function desenhaLinha(ponto1x, ponto1y, ponto2x, ponto2y){
    var canvas  = document.getElementById('myCanvas');
    if (canvas.getContext){
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(ponto1x, ponto1y);
        ctx.lineTo(ponto2x, ponto2y);
        ctx.stroke();
    }
}

function desenhaCanvas(){
    calculaProjecao();
    console.log(matrizCartesianas);
    matrizCartesianas[0] = [337,640,640	,337,0,0,337,337];
    matrizCartesianas[1] = [87,87,480,480,436,0,0,436];

    let vertices = [[5,6,7,4,5],[6,1,2,7,6],[1,0,3,2,1],[5,0,3,4,5],[1,6,5,0,1],[7,2,3,4,7]]
    for(let x = 0; x < vertices.length; x ++){
        for(let y = 0; y < vertices[x].length -1; y ++){
            let ponto1X = matrizCartesianas[0][vertices[x][y]];
            let ponto1Y = matrizCartesianas[1][vertices[x][y]];
            let ponto2X = matrizCartesianas[0][vertices[x][y+1]];
            let ponto2Y = matrizCartesianas[1][vertices[x][y+1]];
            desenhaLinha(ponto1X, ponto1Y, ponto2X, ponto2Y);
        }
    }
}


