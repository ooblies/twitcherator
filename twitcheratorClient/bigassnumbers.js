var segmentLength = 5;


function getEvenNumberChunks(str) {
  var numChunks = Math.ceil(str.length / segmentLength)
  var chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += segmentLength) {
    chunks[i] = str.substr(o, segmentLength)
  }

  return chunks
}

function bigNumberEqualTo(first,second) {
  if (first.length != second.length) {
    return false;
  }
  for (let i = 0; i < first.length; i++) {
    if (parseInt(first[i]) != parseInt(second[i])) {
      return false;
    }
  }

  return true;
}

function bigNumberGreaterThan(first,second) {
  if (first.length < second.length) {
    return false;
  }
  if (first.length > second.length) {
    return true;
  }
  for (let i = 0; i < first.length; i++) {
    if (parseInt(first[i]) < parseInt(second[i])) {
      return false;
    }
    if (parseInt(first[i]) > parseInt(second[i])) {
      return true;
    }
  }

  return false;
}

function bigNumberLessThanOrEqualTo(first, second) {
  return bigNumberLessThan(first,second) || bigNumberEqualTo(first,second);
}
function bigNumberGreaterThanOrEqualTo(first, second) {
  return bigNumberGreaterThan(first,second) || bigNumberEqualTo(first,second);
}

function bigNumberLessThan(first,second) {
  if (first.length < second.length) {
    return true;
  }
  if (first.length > second.length) {
    return false;
  }
  for (let i = 0; i < first.length; i++) {
    if (parseInt(first[i]) < parseInt(second[i])) {
      return true;
    }
    if (parseInt(first[i]) > parseInt(second[i])) {
      return false;
    }
  }

  return false;
}

function getBigNumberFromStr(strNumber) {
  var offset = strNumber.length % segmentLength;

  var num = [];
  num.push(strNumber.substr(0, offset));
  
  return num.concat(getEvenNumberChunks(strNumber.substr(offset)));
}

function getBigNumberFromInt(intNumber) {
  var strNumber = intNumber.toString();
  
  return getBigNumberFromStr(strNumber);
}

function bigExponent(number, exponent) {  
  var intExponent = parseInt(exponent[0]);

  var newNum = [...number];

  for (iExp = 0; iExp < intExponent - 1; iExp++) {
    newNum = bigMultiply(newNum, number)
  }

  return newNum;
}

function bigMultiply(number, multiplier) {

  var newNum = [...number];

  for (iMult = 1; bigNumberLessThan(getBigNumberFromInt(iMult),multiplier); iMult++) {
    newNum = bigAdd(newNum, number)
  }

  return newNum;
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