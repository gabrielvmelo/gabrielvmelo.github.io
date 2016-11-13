//------ Configuração do background ---------------------------------------------
var background = new Rect(0, 0, stage.options.width, stage.options.height);
background.attr('fillColor', 'black');
background.addTo(stage);
//-------------------------------------------------------------------------------

//------ Configuração da TouchScreen --------------------------------------------
var touchScreen = new Rect(0, 0, stage.options.width, stage.options.height);
touchScreen.addTo(stage);
//-------------------------------------------------------------------------------

//------ Variáveis --------------------------------------------------------------
var pointsNumber = 0;
var posx = new Array();
var posy = new Array();
var posxAlternada = new Array();
var posyAlternada = new Array();
var pointsSize = 7;
var t = 0.5;
var tPointsX = new Array();
var tPointsY = new Array();
var precisionT = 0.005;
var path = {};
var deCasteljauCurve = new Array();
var deCasteljauCurveAlternada = new Array();
var controlPoints = new Array();
var pointsName = new Array();
var stageObjects = [touchScreen];
stage.children(stageObjects);
var deCasteljauX = new Array();
var deCasteljauY = new Array();
var deCasteljauXAlternada = new Array();
var deCasteljauYAlternada = new Array();

//-------------------------------------------------------------------------------

//------ Desenhar pontos baseados no click na tela ------------------------------
touchScreen.on('click', function(evt) {
    posx.push(evt.x);
    posy.push(evt.y);

    var point = new Circle(evt.x, evt.y, pointsSize).fill('red');

    var txt = new Text('b' + pointsNumber);
    txt.attr({
        textFillColor: 'white',
        x: evt.x - 3,
        y: evt.y + 12
    });
    pointsNumber++;

    point.index = controlPoints.length;
    controlPoints.push(point);
    pointsName.push(txt);

    stageObjects = [touchScreen];

    for (var i = 0; i < controlPoints.length; i++) {
      stageObjects.push(controlPoints[i]);
      stageObjects.push(pointsName[i]);
    }
    stage.children(stageObjects);

    deCasteljauX = [];
    deCasteljauY = [];
    deCasteljauCurve = [];
    if(pointsNumber > 2){
        for(var i = 0; i < 1; i += precisionT){
            gerarPonto(i);
        }

        /*console.log("**** de casteljau *****");
        for(var i = 0; i < deCasteljauY.length-1; i++){
            console.log(deCasteljauX[i] + "," + deCasteljauY[i]);
        }*/

        for(var i = 0; i < deCasteljauX.length - 1; i++){
            console.log("Mandou fazer");
            GerarMiniRetas(i, i+1);
        }

        for(var i = 0; i < deCasteljauCurve.length; i++){
            stageObjects.push(deCasteljauCurve[i]);
        }
        stage.children(stageObjects);
    }
    //------ Apagar pontos com clique duplo sobre eles --------------------------
        point.on('doubleclick', function(evt) {
            var ref = this.index;

            for(var i = ref + 1; i < pointsNumber; i++){
                controlPoints[i].index--;
                var n = i-1;
                pointsName[i].attr({
                    text: 'b' + n
                });
            }

            pointsNumber--;

            stageObjects.splice(1, stageObjects.length);
            controlPoints.splice(ref, 1);
            pointsName.splice(ref, 1);
            posx.splice(ref, 1);
            posy.splice(ref, 1);

            for (var i = 0; i < controlPoints.length; i++) {
              stageObjects.push(controlPoints[i]);
              stageObjects.push(pointsName[i]);
            }
            stage.children(stageObjects);

            deCasteljauX = [];
            deCasteljauY = [];
            deCasteljauCurve = [];
            if(pointsNumber > 2){
                for(var i = 0; i < 1; i += precisionT){
                    gerarPonto(i);
                }

                /*console.log("**** de casteljau *****");
                for(var i = 0; i < deCasteljauY.length-1; i++){
                    console.log(deCasteljauX[i] + "," + deCasteljauY[i]);
                }*/

                for(var i = 0; i < deCasteljauX.length - 1; i++){
                    console.log("Mandou fazer");
                    GerarMiniRetas(i, i+1);
                }

                for(var i = 0; i < deCasteljauCurve.length; i++){
                    stageObjects.push(deCasteljauCurve[i]);
                }
                stage.children(stageObjects);
            }
        });
    //---------------------------------------------------------------------------

});
//-------------------------------------------------------------------------------

//------ Desenhar retas entre pontos de controle --------------------------------

function drawLineControle(a, b){
    path = new Path()
    .moveTo(posx[a], posy[a])
    .lineTo(posx[b], posy[b])
    .lineTo(posx[a], posy[a])
    .closePath()
    .fill('white')
    .stroke('white', 2);

    var x = ((1 - t)*posx[a] ) + t*posx[b];
    var y = ((1 - t)*posy[a] ) + t*posy[b];
    console.log("DL(" + x + "," + y + ")");

    tPointsX.push(x);
    tPointsY.push(y);

    stageObjects.push(path);
    stage.children(stageObjects);

}

function drawLineInterna(a, b){
  path = new Path()
  .moveTo(tPointsX[a], tPointsY[a])
  .lineTo(tPointsX[b], tPointsY[b])
  .lineTo(tPointsX[a], tPointsY[a])
  .closePath()
  .fill('gray')
  .stroke('gray', 2);

  var x = ((1 - t)*tPointsX[a] ) + t*tPointsX[b];
  var y = ((1 - t)*tPointsY[a] ) + t*tPointsY[b];
  console.log("DL2(" + x + "," + y + ")");

  tPointsX.push(x);
  tPointsY.push(y);
  //tPointsX.splice(0, 1);
  //tPointsY.splice(0, 1);

  stageObjects.push(path);
  stage.children(stageObjects);
}

//-------------------------------------------------------------------------------


//------ Gambiarra de Botao -----------------------------------------------------

stage.on('key', function(evt) {
    console.log('Key Event: ' + evt.keyCode);

    if(evt.keyCode == 13){

      deCasteljauXAlternada = [];
      deCasteljauYAlternada = [];
      deCasteljauCurveAlternada = [];
      pontosAlternados();

      for(var i = 0; i<1; i+=precisionT){
          gerarPontoAlternado(i);
      }

      for(var i = 0; i < deCasteljauXAlternada.length - 1; i++){
          console.log("Mandou fazer Alternada");
          GerarMiniRetasAlternadas(i, i+1);
      }

      for(var i = 0; i<deCasteljauCurveAlternada.length; i++){
          stageObjects.push(deCasteljauCurveAlternada[i]);
      }
      stage.children(stageObjects);
    }


    if(evt.keyCode == 120){
      console.log("Points " + pointsNumber);
      console.log("Gerando retas de controle")
        for(var i = 0; i < pointsNumber; i++){
            var j = i + 1;
            if(j < pointsNumber) drawLineControle(i, j);
        }

        var n = pointsNumber - 2;
        var i = 0;
        var j = 0;
        var k = j + 1;

        while(n > 0){
            console.log("Entrou" + n);
            drawLineInterna(j, k);
            i++;
            j++;
            k = j + 1;
            if(i == n){
                //tPointsY.splice(0, 1);
                //tPointsX.splice(0, 1);
                i = 0;
                j++;
                k = j + 1;
                n--;
            }
        }

        tPointsX = [];
        tPointsY = [];
    }


});
//-------------------------------------------------------------------------------

//------ Gerar pontos da curva de bezier ----------------------------------------

function gerarPonto(parametro){
      var auxx = [];
      var auxy = [];

      for(var a = 0; a < pointsNumber; a++){
          var b = a + 1;
          if (b < pointsNumber) {
              var x = ((1 - parametro)*posx[a] ) + parametro*posx[b];
              var y = ((1 - parametro)*posy[a] ) + parametro*posy[b];
              auxx.push(x);
              auxy.push(y);
          }
      }

      for(var i = 0; i<pointsNumber-1; i++){
          console.log(auxx[i] + "," + auxy[i]);
      }

      var n = pointsNumber - 2;
      var i = 0;
      var a = 0;
      var b = a + 1;

      while(n > 0){
        var x = ((1 - parametro)*auxx[a] ) + parametro*auxx[b];
        var y = ((1 - parametro)*auxy[a] ) + parametro*auxy[b];
        auxx.push(x);
        auxy.push(y);
        i++;
        a++;
        b = a + 1;
        if(i == n){
            i = 0;
            a++;
            b = a + 1;
            n--;
        }
      }

      deCasteljauX.push(auxx.pop());
      deCasteljauY.push(auxy.pop());

}
//-------------------------------------------------------------------------------

//------ Gerar Curva de Bezier --------------------------------------------------

function GerarMiniRetas(begin, end){
    //console.log("Entrou MiniRetas");

    path = new Path()
      .moveTo(deCasteljauX[begin], deCasteljauY[begin])
      .lineTo(deCasteljauX[end], deCasteljauY[end])
      .lineTo(deCasteljauX[begin], deCasteljauY[begin])
      .closePath()
      .fill('green')
      .stroke('green', 2);

    deCasteljauCurve.push(path);
}

//-------------------------------------------------------------------------------

//------ Inverter Pontos de Controle para Curva Alternada -----------------------

function pontosAlternados(){
        for(var i = 0; i < posx.length; i++){
            if((i%2 == 0) && (i+1 < posx.length)){
                posxAlternada[i] = posx[i+1];
                posyAlternada[i] = posy[i+1];
            }
            else if(i%2 == 1){
                posxAlternada[i] = posx[i-1];
                posyAlternada[i] = posy[i-1];
            }
            else {
                posxAlternada[i] = posx[i];
                posyAlternada[i] = posy[i];
            }
        }

}

function gerarPontoAlternado(parametro){
      var auxx = [];
      var auxy = [];

      for(var a = 0; a < pointsNumber; a++){
          var b = a + 1;
          if (b < pointsNumber) {
              var x = ((1 - parametro)*posxAlternada[a] ) + parametro*posxAlternada[b];
              var y = ((1 - parametro)*posyAlternada[a] ) + parametro*posyAlternada[b];
              auxx.push(x);
              auxy.push(y);
          }
      }

      for(var i = 0; i<pointsNumber-1; i++){
          console.log(auxx[i] + "," + auxy[i]);
      }

      var n = pointsNumber - 2;
      var i = 0;
      var a = 0;
      var b = a + 1;

      while(n > 0){
        var x = ((1 - parametro)*auxx[a] ) + parametro*auxx[b];
        var y = ((1 - parametro)*auxy[a] ) + parametro*auxy[b];
        auxx.push(x);
        auxy.push(y);
        i++;
        a++;
        b = a + 1;
        if(i == n){
            i = 0;
            a++;
            b = a + 1;
            n--;
        }
      }

      deCasteljauXAlternada.push(auxx.pop());
      deCasteljauYAlternada.push(auxy.pop());

}

function GerarMiniRetasAlternadas(begin, end){
    //console.log("Entrou MiniRetasAlternadas");

    path = new Path()
      .moveTo(deCasteljauXAlternada[begin], deCasteljauYAlternada[begin])
      .lineTo(deCasteljauXAlternada[end], deCasteljauYAlternada[end])
      .lineTo(deCasteljauXAlternada[begin], deCasteljauYAlternada[begin])
      .closePath()
      .fill('purple')
      .stroke('purple', 2);

    deCasteljauCurveAlternada.push(path);
}

//-------------------------------------------------------------------------------
