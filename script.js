var pontoVista = [8, 2, 10]
var pontoPlano = [0, 0, 0]
var ponto1 = [1, 0, 0]
var ponto2 = [0, 0, 0]
var ponto3 = [0, 1, 0]
var normal = []
var quantidadeVertices = 8
var quantidadeSuperficies = 6
var superficies = [
  [4, 3, 6, 5, 4],
  [3, 2, 7, 6, 3],
  [8, 7, 2, 1, 8],
  [5, 8, 1, 4, 5],
  [5, 6, 7, 8, 5],
  [1, 2, 3, 4, 1]
]
var d, d0, d1
var matrizPerspectiva = []
var matrizProjecao = [[], [], [], []]
var matrizHomogenea = [[], [], [], []]
var matrizObjeto = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1]
]
var matrizCartesianas = [[], []]
var xMax, yMax, xMin, yMin
var uMax = 320,
  vMax = 240,
  uMin = 0,
  vMin = 0

function calculaVetorNormal() {
  normal[0] =
    (ponto1[1] - ponto2[1]) * (ponto3[2] - ponto2[2]) -
    (ponto3[1] - ponto2[1]) * (ponto1[2] - ponto2[2])

  normal[1] =
    -(ponto1[0] - ponto2[0]) * (ponto3[2] - ponto2[2]) -
    (ponto3[0] - ponto2[0]) * (ponto1[2] - ponto2[2])

  normal[2] =
    (ponto1[0] - ponto2[0]) * (ponto3[1] - ponto2[1]) -
    (ponto3[0] - ponto2[0]) * (ponto1[1] - ponto2[1])
}

function calculoD() {
  d0 =
    pontoPlano[0] * normal[0] +
    pontoPlano[1] * normal[1] +
    pontoPlano[2] * normal[2]
  d1 =
    pontoVista[0] * normal[0] +
    pontoVista[1] * normal[1] +
    pontoVista[2] * normal[2]
  d = d0 - d1
}

function calculoMatrizPerspectiva() {
  let a = pontoVista[0],
    b = pontoVista[1],
    c = pontoVista[2]
  let nx = normal[0],
    ny = normal[1],
    nz = normal[2]
  matrizPerspectiva[0] = [d + a * nx, a * ny, a * nz, -a * d0]
  matrizPerspectiva[1] = [b * nx, d + b * ny, b * nz, -b * d0]
  matrizPerspectiva[2] = [c * nx, c * ny, d + c * nz, -c * d0]
  matrizPerspectiva[3] = [nx, ny, nz, -d1]
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (matrizPerspectiva[x][y] == -0) {
        matrizPerspectiva[x][y] = 0
      }
    }
  }
}

function calculaMatrizProjecao() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < quantidadeVertices; j++) {
      matrizProjecao[i][j] = 0
      for (let k = 0; k < 4; k++) {
        matrizProjecao[i][j] += matrizPerspectiva[i][k] * matrizObjeto[k][j]
      }
    }
  }
}

function transformaHomogeneas() {
  for (let i = 0; i < quantidadeVertices; i++) {
    let valorW = matrizProjecao[3][i]
    for (let j = 0; j < 4; j++) {
      matrizHomogenea[j][i] = matrizProjecao[j][i] / valorW
      if (matrizHomogenea[j][i] === -0) {
        matrizHomogenea[j][i] = 0
      }
    }
  }
}

function pegaCartesianas() {
  matrizCartesianas[0] = matrizHomogenea[0]
  matrizCartesianas[1] = matrizHomogenea[1]
  matrizCartesianas[2] = matrizHomogenea[3]
}

function calculaJanela() {
  xMin = Math.min(...matrizCartesianas[0])
  xMax = Math.max(...matrizCartesianas[0])
  yMin = Math.min(...matrizCartesianas[1])
  yMax = Math.max(...matrizCartesianas[1])
}

function transladaOrigemMundo() {
  let Rw = (xMax - xMin) / (yMax - yMin)
  let Rv = (uMax - uMin) / (vMax - vMin)
  let uMaxNovo = uMax 
  let vMaxNovo = vMax
  if (Rw > Rv) {
    uMaxNovo = Rw * (vMax - vMin) + uMin
  } else if (Rw < Rv) {
    vMaxNovo = (uMax - uMin) / Rw + vMin
  }
  let Sx = (uMaxNovo - uMin) / (xMax - xMin)
  let Sy = (vMaxNovo - vMin) / (yMax - yMin)
  let matrizTranslação = [
    [Sx, 0, -Sx * xMin + (uMax - uMaxNovo) / 2 + uMin],
    [0, -Sy, Sy * yMax + (vMax - vMaxNovo) / 2 + vMin],
    [0, 0, 1]
  ]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < quantidadeVertices; j++) {
      let aux = 0
      for (let k = 0; k < 3; k++) {
        aux += matrizTranslação[i][k] * matrizCartesianas[k][j]
      }
      matrizCartesianas[i][j] = aux
    }
  }
  matrizCartesianas[0] = matrizCartesianas[0].map(Math.round)
  matrizCartesianas[1] = matrizCartesianas[1].map(Math.round)
}

function centralizaObjeto() {
  let canvas = document.getElementById('myCanvas')
  let dx = canvas.width / 2
  let dy = canvas.height / 2
  xMin = Math.min(...matrizCartesianas[0])
  xMax = Math.max(...matrizCartesianas[0])
  yMin = Math.min(...matrizCartesianas[1])
  yMax = Math.max(...matrizCartesianas[1])
  if (matrizCartesianas[0][0] < dx) {
    dx -= (xMax - xMin) / 2
  } else {
    dx += (xMax - xMin) / 2
  }
  if (matrizCartesianas[1][0] < dy) {
    dy -= (yMax - yMin) / 2
  } else {
    dy += (yMax - yMin) / 2
  }
  let matrizTranslação = [
    [1, 0, dx],
    [0, 1, dy],
    [0, 0, 1]
  ]
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < quantidadeVertices; j++) {
      let aux = 0
      for (let k = 0; k < 3; k++) {
        aux += matrizTranslação[i][k] * matrizCartesianas[k][j]
      }
      matrizCartesianas[i][j] = aux
    }
  }
  matrizCartesianas[0] = matrizCartesianas[0].map(Math.round)
  matrizCartesianas[1] = matrizCartesianas[1].map(Math.round)
}

function calculaProjecao() {
  calculaVetorNormal()
  calculoD()
  calculoMatrizPerspectiva()
  calculaMatrizProjecao()
  transformaHomogeneas()
  pegaCartesianas()
  calculaJanela()
  transladaOrigemMundo()
  centralizaObjeto()
}

function limpaCanvas() {
  var canvas = document.getElementById('myCanvas')
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function desenhaLinha(ponto1x, ponto1y, ponto2x, ponto2y) {
  var canvas = document.getElementById('myCanvas')
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(ponto1x, ponto1y)
    ctx.lineTo(ponto2x, ponto2y)
    ctx.stroke()
  }
}

function desenhaCanvas() {
  calculaProjecao()
  limpaCanvas()
  for (let x = 0; x < quantidadeSuperficies; x++) {
    for (let y = 0; y < superficies[x].length - 1; y++) {
      let ponto1X = matrizCartesianas[0][superficies[x][y] - 1]
      let ponto1Y = matrizCartesianas[1][superficies[x][y] - 1]
      let ponto2X = matrizCartesianas[0][superficies[x][y + 1] - 1]
      let ponto2Y = matrizCartesianas[1][superficies[x][y + 1] - 1]
      desenhaLinha(ponto1X, ponto1Y, ponto2X, ponto2Y)
    }
  }
}

$(function () {
  $("#botaoModalCena").click(function () {
    $("#inputVistaX").val(pontoVista[0]);
    $("#inputVistaY").val(pontoVista[1]);
    $("#inputVistaZ").val(pontoVista[2]);

    $("#inputP1x").val(ponto1[0]);
    $("#inputP1y").val(ponto1[1]);
    $("#inputP1z").val(ponto1[2]);

    $("#inputP2x").val(ponto2[0]);
    $("#inputP2y").val(ponto2[1]);
    $("#inputP2z").val(ponto2[2]);

    $("#inputP3x").val(ponto3[0]);
    $("#inputP3y").val(ponto3[1]);
    $("#inputP3z").val(ponto3[2]);

    $("#inputPlanoX").val(pontoPlano[0]);
    $("#inputPlanoY").val(pontoPlano[1]);
    $("#inputPlanoZ").val(pontoPlano[2]);

  });

  $("#btAtualizarCena").click(function () {

    let matrizBase = [[], [], [], []]

    pontoVista[0] = $("#inputVistaX").val();
    pontoVista[1] = $("#inputVistaY").val();
    pontoVista[2] = $("#inputVistaZ").val();

    matrizBase[0][0] = $("#inputP1x").val();
    matrizBase[0][1] = $("#inputP1y").val();
    matrizBase[0][2] = $("#inputP1z").val();

    matrizBase[1][0] = $("#inputP2x").val();
    matrizBase[1][1] = $("#inputP2y").val();
    matrizBase[1][2] = $("#inputP2z").val();

    matrizBase[2][0] = $("#inputP3x").val();
    matrizBase[2][1] = $("#inputP3y").val();
    matrizBase[2][2] = $("#inputP3z").val();

    ponto1 = matrizBase[0]
    ponto2 = matrizBase[1]
    ponto3 = matrizBase[2]

    pontoPlano[0] = $("#inputPlanoX").val();
    pontoPlano[1] = $("#inputPlanoY").val();
    pontoPlano[2] = $("#inputPlanoZ").val();

  });

  $('#btAtualizarObjeto').click(function () {
    quantidadeVertices = parseInt($('#inputQtdVertices').val())
    matrizObjeto = [[], [], [], []]
    matrizCartesianas = [[], []]
    matrizHomogenea = [[], [], [], []]
    matrizProjecao = [[], [], [], []]
    for (let i = 0; i < quantidadeVertices; i++) {
      matrizObjeto[0][i] = parseInt($('#inputV' + (i + 1) + 'x').val())
      matrizObjeto[1][i] = parseInt($('#inputV' + (i + 1) + 'y').val())
      matrizObjeto[2][i] = parseInt($('#inputV' + (i + 1) + 'z').val())
      matrizObjeto[3][i] = 1
    }
    quantidadeSuperficies = parseInt($('#inputQtdSuperficies').val())
    superficies = []
    for (let i = 0; i < quantidadeSuperficies; i++) {
      let aux = $('#inputSuperficie' + (i + 1)).val().split(',')
      superficies.push(aux.map(element => parseInt(element)))
    }
  });
});

$(function () {
  $('#botaoModalObj').click(function () {
    $('#inputQtdVertices').val(quantidadeVertices);
    $('#divVertices').empty();
    for (var i = 1; i <= quantidadeVertices; i++) {
      var inputX = '<input type="number" id="inputV' + i + 'x" value="' + matrizObjeto[0][i - 1] + '"placeholder="Coordenada x" />';
      var inputY = '<input type="number" id="inputV' + i + 'y" value="' + matrizObjeto[1][i - 1] + '"  placeholder="Coordenada y" />';
      var inputZ = '<input type="number" id="inputV' + i + 'z" value="' + matrizObjeto[2][i - 1] + '"  placeholder="Coordenada z" />';
      var txt = '<h5 style="text-align: left">Vértice ' + i + '</h5>';
      $('#divVertices').append(txt, inputX, inputY, inputZ);
    }
    $('#inputQtdSuperficies').val(quantidadeSuperficies)
    $('#divSuperficies').empty();
    for (var i = 1; i <= quantidadeSuperficies; i++) {
      var input = '<input type="text" id="inputSuperficie' + i + '" value="' + superficies[i - 1].join(',') + '"class="inputvertice"  placeholder="Vertices separados por vírgula" />';
      var txt = '<h5 style="text-align: left">Superfície ' + i + '</h5>';
      $('#divSuperficies').append(txt, input);
    }
  });

  $('#inputQtdVertices').on('input', function () {
    $('#divVertices').empty();
    qtd = $('#inputQtdVertices').val();
    for (var i = 1; i <= qtd; i++) {
      var inputX = '<input type="number" id="inputV' + i + 'x"  placeholder="Coordenada x" />';
      var inputY = '<input type="number" id="inputV' + i + 'y"  placeholder="Coordenada y" />';
      var inputZ = '<input type="number" id="inputV' + i + 'z"  placeholder="Coordenada z" />';
      var txt = '<h5 style="text-align: left">Vértice ' + i + '</h5>';
      $('#divVertices').append(txt, inputX, inputY, inputZ);
    }
  });

  $('#inputQtdSuperficies').on('input', function () {
    $('#divSuperficies').empty();
    qtdSuperficies = $('#inputQtdSuperficies').val();
    for (var i = 1; i <= qtdSuperficies; i++) {
      var input = '<input type="text" id="inputSuperficie' + i + '" class="inputvertice"  placeholder="Vertices separados por vírgula" />';
      var txt = '<h5 style="text-align: left">Superfície ' + i + '</h5>';
      $('#divSuperficies').append(txt, input);
    }
  });
});
