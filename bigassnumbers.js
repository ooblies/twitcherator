var kill = false;
var display;
var segmentLength = 10;
var numberSegments = ["0"];
//TO-DO handle increment larger than max int size?
var baseIncrement = ["1"];
var speed = 1000;

var viewers = ["100"];
var followers = ["25"];
var subscribers = ["0"];
var bitMultiplier = [""];
var calculatedIncrement =[];

function getIncrement() {
  //[Viewers]*[Followers]^[Subscribers] 
  
  calculatedIncrement = bigMultiply(baseIncrement, viewers)
  
  if (followers > 0) {
    calculatedIncrement = bigMultiply(calculatedIncrement, followers);
  }  
  
  if (subscribers > 0) {
    calculatedIncrement = bigExponent(calculatedIncrement, subscribers);
  }
  
  return calculatedIncrement;
}

function bigExponent(number, exponent) {
  //this doesnt work
  var num = [...number];
  
  var i = num.length - 1;
  var j = exponent.length - 1;
  var overflow = 0;

  while (j >= 0 || overflow > 0) {
    if (i < 0) {
      num.unshift("0");
      i++;
    }
    if (j >= 0) {
      var intNum = parseInt(num[i]);
      var intExponent = parseInt(exponent[j]);
      newNum = Math.pow(intNum,intExponent);

      if (newNum.toString().length > segmentLength) {
        var strNum = newNum.toString();

        overflow = left(strNum, strNum.length - segmentLength);
        num[i] = right(strNum,segmentLength);

        if (i == 0) {
          num.unshift("0");
          i++;
        }
      } else {
        num[i] = (parseInt(newNum) + parseInt(overflow)).toString();
        overflow = 0;
      }
    } else {
      num[i] = (parseInt(num[i]) + parseInt(overflow)).toString();
      overflow = 0;
    }
    
      i--;
      j--;
    }   

    return num;
}

function bigMultiply(number, multiplier) {
  var num = [...number];
  
  var i = num.length - 1;
  var j = multiplier.length - 1;
  var overflow = 0;

  var intMultiplier = parseInt(multiplier[0]);

  while (i >= 0 || overflow > 0) {
    if (i < 0) {
      num.unshift("0");
      i++;
    }
    if (i >= 0) {
      var intNum = parseInt(num[i]);
      newNum = intNum * intMultiplier;

      if (newNum.toString().length > segmentLength) {
        var strNum = newNum.toString();

        overflow = left(strNum, strNum.length - segmentLength);
        num[i] = right(strNum,segmentLength);

        if (i == 0) {
          num.unshift("0");
          i++;
        }
      } else {
        num[i] = (parseInt(newNum) + parseInt(overflow)).toString();
        overflow = 0;
      }
    } else {
      num[i] = (parseInt(num[i]) + parseInt(overflow)).toString();
      overflow = 0;
    }
    
      i--;
      j--;
    }   

    return num;
}

window.onload = function init() {
  display = document.getElementById("testNum"); 
  number = document.getElementById("number"); 
  lblIncrement = document.getElementById("lblIncrement");
  lblViewers = document.getElementById("lblViewers");
  lblFollowers = document.getElementById("lblFollowers");
  lblSubscribers = document.getElementById("lblSubscribers");
  render();
}
function render() {
    
    setTimeout(function()
    {
      //do stuff 
      if(!kill){
        
        number.innerHTML = buildNumber();

        lblIncrement.innerHTML = getIncrement();
        lblViewers.innerHTML = viewers;
        lblFollowers.innerHTML = followers;
        lblSubscribers.innerHTML = subscribers;
        //num++;
        numberSegments = bigAdd(numberSegments, getIncrement());
      }
      requestAnimationFrame(render);
    }, speed);
    
}


function bigAdd(number, increment) {
  var num = [...number];

  var i = num.length - 1;
  var j = increment.length - 1;
  var overflow = 0;

  while (j >= 0 || overflow > 0) {
    if (i < 0) {
      num.unshift("0");
      i++;
    }
    if (j >= 0) {
      var intNum = parseInt(num[i]);
      var intIncrement = parseInt(increment[j]);
      newNum = intNum + intIncrement;

      if (newNum.toString().length > segmentLength) {
        var strNum = newNum.toString();

        overflow = left(strNum, strNum.length - segmentLength);
        num[i] = right(strNum,segmentLength);

        if (i == 0) {
          num.unshift("0");
          i++;
        }
      } else {
        num[i] = (parseInt(newNum) + parseInt(overflow)).toString();
        overflow = 0;
      }
    } else {
      num[i] = (parseInt(num[i]) + parseInt(overflow)).toString();
      overflow = 0;
    }
    
      i--;
      j--;
    }      

    return num;
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

function getNumberLength() {
  var firstSegment = numberSegments[0].length;
  var theRest = (numberSegments.length - 1) * 10;
  var numberLength = firstSegment + theRest;

  return numberLength;
}

function buildNumber() {
  
  var bigAssNumber = "";

  for (i = 0; i < numberSegments.length; i++) {
    //trim leading 0's on first segment  
    if (i == 0) {
          bigAssNumber = numberSegments[i];
      } else {
        bigAssNumber = bigAssNumber + right("0000000000" + numberSegments[i],segmentLength);
      }      
  };
  
  return addCommas(bigAssNumber);
}

function addCommas(number) {
  var length = getNumberLength();
  var remainder = length % 3;

  var first = number.substring(0,remainder);
  var last = "";
  if (length > remainder) {
    var rest = number.substring(remainder);
    last = addItemEvery(rest,',',3);
    if (remainder == 0) {
      last = last.substr(1);
    }
  }
    
  return first + last;
}

function addItemEvery (str, item, every){
  for(let i = 0; i < str.length ; i++){
    if(!(i % (every + 1))){
      str = str.substring(0, i) + item + str.substring(i);
    }
   }
  return str;
}

function right(str,num) {
    var r = str.substring(str.length - num, str.length);
    return r;
}

function left(str, num) {
  var r = str.substring(0, num);
  return r;
}