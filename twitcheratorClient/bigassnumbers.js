var segmentLength = 10;

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



function getNumberLength(number) {
  var firstSegment = number[0].length;
  var theRest = (number.length - 1) * 10;
  var numberLength = firstSegment + theRest;

  return numberLength;
}

function getBigNumberAsString(number) {
  
  var bigAssNumber = "";

  for (i = 0; i < number.length; i++) {
    //trim leading 0's on first segment  
    if (i == 0) {
          bigAssNumber = number[i];
      } else {
        bigAssNumber = bigAssNumber + right("0000000000" + number[i],segmentLength);
      }      
  };
  
  return addCommas(bigAssNumber);
}

function addCommas(number) {
  var length = getNumberLength(number);
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