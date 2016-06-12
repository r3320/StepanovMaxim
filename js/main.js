window.onload=function(){
  var tbl = document.createElement('table');
  tbl.id="student-answer"
  tbl.insertRow(-1);
  for (var j=0; j<=max1; j++)    tbl.tBodies[0].rows[0].insertCell(-1).innerHTML = j||' ';
  for (var i=1; i<=max; i++){
    tbl.insertRow(-1).insertCell(-1).innerHTML = i;
    for (var j=1; j<=max1; j++){
      var input = document.createElement('input');
      input.id=input.name=i+''+j;
      input.size = "1";
      input.value= 0;
      tbl.tBodies[0].rows[i].insertCell(-1).appendChild(input);
    }
  }
  document.getElementById('studentAnswer').appendChild(tbl);

  tbl.onchange = function() {
    for (var i=1; i<=max; i++){
      studentAnswer[i-1] = [];
      for(var j=1; j<=max1; j++){
        studentAnswer[i-1][j-1] = +tbl.rows[i].cells[j].childNodes[0].value;
      }
    }
  }

  vizualizeIt(dataToVizualizeFirst,'graphRight',true);
  document.getElementById('vizualizeIt').onclick = function(){vizualizeIt(dataToVizualizeSecond,'graphStudent',false)};
  document.getElementById('checkIt').onclick = function(){compare1(studentAnswer,rightAnswer)};
}

compare = function (a1, a2) {
  return a1.length == a2.length && a1.every((v,i)=>v === a2[i]);
}
compare1 = function (a1, a2) {
  for(var i=0; i<a1.length; i++){
    for(var j=0; j<=a1.length; j++){
      if(a1[i][j] != a2[i][j]) {
        document.getElementById('wrongAnswer').style.fill = 'red';
        document.getElementById('rightAnswer').style.fill = '';
        return false;
      }
    }
  }
  document.getElementById('rightAnswer').style.fill = 'green';
  document.getElementById('wrongAnswer').style.fill = '';
  return true;
}

function gR(min, max, num){
  var i, arr = [], res = [];
  for (i = min; i <= max; i++ ) arr.push(i);
  for (i = 0; i < num; i++) res.push(arr.splice(Math.floor(Math.random() * (arr.length)), 1)[0])
  return res;
}

var url = document.getElementsByTagName('a')[0];
var toParse = window.location.href.split('/');
var parseResult = toParse[toParse.length-1].split('.')[0];

var variants1 = [[[0,1,1,0],[1,0,1,1],[1,1,0,1],[0,1,1,0]],
				 [[0,1,1,1],[1,0,1,1],[1,1,0,1],[1,1,1,0]],
				 [[0,0,1,0],[0,0,1,0],[1,1,0,0],[0,0,0,0]]];
var variants2 = [[[1,0,0,0,1,0,0],[1,1,0,0,0,1,0],[0,1,1,0,0,0,0],[0,0,1,1,0,0,1],[0,0,0,1,1,1,0],[0,0,0,0,0,0,1]]];


var rightAnswer;
if(parseResult == '1'){
  rightAnswer = variants1[gR(0,variants1.length-1,1)];
  type = '';
}
else if(parseResult == '2'){
  rightAnswer = variants1[gR(0,variants1.length-1,1)];
  type = 'curvedArrow';
}
else{
  rightAnswer = variants2[0];
  type = '';
}


var min=0;
var max = math.size(rightAnswer)[0];
var max1 = math.size(rightAnswer)[1];

var studentAnswer = [];
for (var i = 0; i < max; i++){
  studentAnswer[i] = [];
  for (var j = 0; j < max1; j++){
    studentAnswer[i][j] = 0;
  }
};

function createNodes(asd){
  for (var i=0; i<max; i++){
    asd[i] = {'id':'n'+i,'label': ''+(i+1),'x':gR(min,max,1),'y':gR(min,max,1),'size':1};
  }
  return asd;
}
function createEdges(asd, sA){
  var idNumber = 0;
  if(max != max1){
    sA = math.transpose(sA);
    console.log(sA);
    for (var i = 0; i < max1; i++) {
      asd[idNumber] = {'id': 'e'+idNumber,'source':'n'+sA[i].indexOf(1),'target':'n'+sA[i].lastIndexOf(1),'type': type};
      idNumber += 1;
    }
  }
  else {
    for (var i=0; i<max; i++){
      for (var j=i; j<max1; j++){
        if(sA[i][j] > 0){
          asd[idNumber] = {'id': 'e'+idNumber,'source':'n'+i,'target':'n'+j,'type': type, 'size': sA[i][j]};
          idNumber += 1;
        }
      }
    }
  }
  return asd;
}
var dataToVizualizeFirst = {'nodes': [],'edges':[]};
var dataToVizualizeSecond = {'nodes': [],'edges':[]};

function vizualizeIt(dataToVizualize,divId,flag) {
  $('#graphStudent').empty();
  dataToVizualize['edges'].length = 0;
  if(flag){
    dataToVizualize['nodes'] = createNodes(dataToVizualize['nodes']);
    dataToVizualize['edges'] = createEdges(dataToVizualize['edges'], rightAnswer);
  }
  else {
    dataToVizualize['nodes'] = dataToVizualizeFirst['nodes'];
    dataToVizualize['edges'] = createEdges(dataToVizualize['edges'], studentAnswer);
  }
  var s = new sigma({
    renderer: {
      container: document.getElementById(divId),
      type: 'canvas'
    },
    settings: {
      edgeLabels: true,
      minArrowSize: 10,
      minNodeSize: 1,
      maxNodeSize: 10,
      minEdgeSize: 0.1,
      maxEdgeSize: 2,
      enableEdgeHovering: true,
      edgeHoverSizeRatio: 2,
	    labelColor: "red",
	    labelThreshold: 0
    }
  });
  s.graph.read(dataToVizualize);
  s.refresh();
}
