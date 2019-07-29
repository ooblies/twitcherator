var kill = false;
var display;
var segmentLength = 10;
var numberSegments = ["0"];
//TO-DO handle increment larger than max int size?
var incrementSegments = ["123123","1123123123","1123123123"];
var speed = 10;



window.onload = function init() {
  display = document.getElementById("testNum"); 
  lblLength = document.getElementById("lblLength");
  lblIncrement = document.getElementById("lblIncrement");
  lblArrLength = document.getElementById("lblArrLength");
  lblSegments = document.getElementById("lblSegments");
  render();
}
function render() {
    
    setTimeout(function()
    {
     //do stuff 
    if(!kill){
        //dequeue some doThingQueue      
        //display.textContent = num;
        display.textContent = buildNumber();
        lblLength.innerHTML = display.textContent.length;
        lblIncrement.innerHTML = incrementSegments;
        lblArrLength.innerHTML = numberSegments.length;
        lblSegments.innerHTML = numberSegments;
        //num++;
        incrementNumber(numberSegments, incrementSegments);
      }
      requestAnimationFrame(render);
    }, speed);
    
}


function incrementNumber(number, increment) {
  var i = number.length - 1;
  var j = increment.length - 1;
  var overflow = 0;

  while (j >= 0 || overflow > 0) {
    if (j >= 0) {
      var intNum = parseInt(number[i]);
      var intIncrement = parseInt(increment[j]);
      newNum = intNum + intIncrement;

      if (newNum.toString().length > segmentLength) {
        var strNum = newNum.toString();

        overflow = left(strNum, strNum.length - segmentLength);
        number[i] = right(strNum,segmentLength);

        if (i == 0) {
          number.unshift("0");
          i++;
        }
      } else {
        number[i] = (parseInt(newNum) + parseInt(overflow)).toString();
        overflow = 0;
      }
    } else {
      number[i] = (parseInt(number[i]) + parseInt(overflow)).toString();
      overflow = 0;
    }
    
    i--;
      j--;
    }      
}



function incrementNumber_old() {
    var currentSegment = numberSegments.length-1;
  var strNum = numberSegments[currentSegment];
  var intNum = parseFloat(strNum);
  intNum += incrementBy;
  

  //if last segment overflows segment length
  if (intNum.toString().length > segmentLength) {
    numberSegments[currentSegment] = intNum.toString().substring(intNum.toString().length - segmentLength,intNum.toString().length);   
    //if a segment exists prior to current segment 
    if (numberSegments[currentSegment-1]) {
        //add overflow from current segment to previous segment
        numberSegments[currentSegment - 1] = (parseFloat(numberSegments[currentSegment - 1]) + parseFloat(intNum.toString().substring(0,intNum.toString().length - segmentLength))).toString();
        //create prior segment
    } else {
        numberSegments.unshift(intNum.toString().substring(0,intNum.toString().length - segmentLength));
    }        
    //set current segment to new int
  } else {
      numberSegments[currentSegment] = intNum.toString();
  }  
}

function buildNumber() {
  var bigAssNumber = "";

  for (i = 0; i < numberSegments.length; i++) {
    //trim leading 0's on first segment  
    if (i == 0) {
          bigAssNumber = numberSegments[i];
      } else {
        bigAssNumber = bigAssNumber + right("0000000000000000000000000000000000000000" + numberSegments[i],3);
      }
      
  };
  
  return bigAssNumber;
}

function right(str,num) {
    var r = str.substring(str.length - num, str.length);
    return r;
}

function left(str, num) {
  var r = str.substring(0, num);
  return r;
}