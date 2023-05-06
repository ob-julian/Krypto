const usableCharThreshold = 0.90;
const IoC_Threshold = 4;
const englishFrequencies = {
    'a': 8.167,
    'b': 1.492,
    'c': 2.782,
    'd': 4.253,
    'e': 12.702,
    'f': 2.228,
    'g': 2.015,
    'h': 6.094,
    'i': 6.966,
    'j': 0.153,
    'k': 0.772,
    'l': 4.025,
    'm': 2.406,
    'n': 6.749,
    'o': 7.507,
    'p': 1.929,
    'q': 0.095,
    'r': 5.987,
    's': 6.327,
    't': 9.056,
    'u': 2.758,
    'v': 0.978,
    'w': 2.360,
    'x': 0.150,
    'y': 1.974,
    'z': 0.074
  };

function xorEncrypt(message, key) {
    const buffer = Buffer.from(message, "ASCII");
    const keyBuffer = Buffer.from(key, "ASCII");
  
    for (let i = 0; i < buffer.length; i++) {
        const j = i % keyBuffer.length;
        buffer[i] ^= keyBuffer[j];
    }
  
    return buffer.toString('ASCII');
}

function rot(str, x) {
    // Calculate the effective rotation amount
    const effectiveRotation = x % str.length;
  
    // Rotate the string using slice and concat
    const rotated = str.slice(effectiveRotation) + str.slice(0, effectiveRotation);
  
    return rotated;
}

function shiftString(str, shiftBy) {
    const shiftAmount = -(shiftBy % str.length);
    ///shiftL
    if(shiftAmount < 0){
        return String.fromCharCode(0).repeat(str.slice(shiftAmount).length) + str.slice(0, shiftAmount);
    }
    else {
        return str.slice(shiftAmount) + String.fromCharCode(0).repeat(str.slice(0, shiftAmount).length);
    }
}
  

function countSamePercent(cypher, amount){
    const cypherBuffer = Buffer.from(cypher);
    const buffer = Buffer.from(shiftString(cypher, amount));
    let count = 0;
    for (let i = 0; i < buffer.length; i++) {
        if((buffer[i] ^ cypherBuffer[i]) === 0)
            count++;
    }
    return count/cypher.length * 100;
}
  
function findPositionOfMaxIoC(cypher){
    let max = 0;
    let keyLength = 0;
    for(let i = 1; i < cypher.length; i++){
        let count = countSamePercent(cypher, i);
        if(count > max){
            max = count;
            keyLength = i;
        }
    }
    if(max < IoC_Threshold)
        console.log("No conclusive result found (Max IoC: "+ max +"), continuing anyway...");
    //keyLength 0 does not make sense, so we set it to 1
    if(keyLength === 0)
        keyLength = 1;
    return keyLength;
}

function findPositionOfMinKeyLenght(cypher){
    const multipleOfKeyLength = findPositionOfMaxIoC(cypher);
    let factors = getFactors(multipleOfKeyLength);
    factors = factors.map(factor => [factor, countSamePercent(cypher, factor)]);
    factors = factors.filter(factor => factor[1] > IoC_Threshold);
    if(factors.length === 0)
        factors[0] = [1, countSamePercent(cypher, 1)];
    if(factors[0][1] < 5)
        console.log("Smalest Key at just IoC: "+ factors[0][1] +"), continuing anyway...");
    return factors[0][0];
}

function getFactors(num) {
    let factors = [];
    const sqrt = Math.sqrt(num);
    
    for (let i = 1; i <= sqrt; i++) {
      if (num % i === 0) {
        factors.push(i);
        if (i !== sqrt) {
          factors.push(num / i);
        }
      }
    }
  
    return factors.sort((a, b) => a - b);
}

function frequencyAnalysis(text) {
    text = text.toLowerCase();
    //making sure that the text only contains usable ASCII characters
    if(text.length !==text.replace(/[^ -~]/g, '').length)
        return {};
    //making sure that the text contains enough usable ASCII characters
    if(text.length * usableCharThreshold <= text.replace(/[^a-z]/g, '').length)
        return {};
    text = text.replace(/[^a-z]/g, '');
    
    let frequency = {};
    for (let i = 0; i < text.length; i++) {
      let char = text.charAt(i);
      if (frequency[char]) {
        frequency[char]++;
      } else {
        frequency[char] = 1;
      }
    }
    
    let relativeFrequency = Object.entries(frequency).map(a => [a[0], a[1]/text.length*100]);
    const frequencyObject = relativeFrequency.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    return frequencyObject;
}

function compareFrequencieToDefault(freq) {
    let score = 0;
    
    for (let char in englishFrequencies) {
      if (char in freq) {
        score += Math.abs(englishFrequencies[char] - freq[char]);
      } else {
        score += englishFrequencies[char];
      }
    }

    return score;
}

function generateKey(cypher, key, keyLength){
    let min = [+Infinity, ""];
    if(keyLength === 0)
        return [tryKey(cypher, key), key];
    // Loop through the lowercase letters A-Z
    for (let i = 65; i <= 90; i++) {
        let score = generateKey(cypher, key + String.fromCharCode(i), keyLength-1);
        if(score[0] < min[0])
            min = score;
    }
    
    // Loop through the lowercase letters a-z
    for (let i = 97; i <= 122; i++) {
        let score = generateKey(cypher, key + String.fromCharCode(i), keyLength-1);
        if(score[0] < min[0])
            min = score;
    }
    return min;
}


function tryKey(cypher, key){
    return compareFrequencieToDefault(frequencyAnalysis(xorEncrypt(cypher, key)));
}

function generateKeyOptimized(cypher, keyLength){
    let key = new Array(keyLength);
    let MinScores = new Array(keyLength);
    for(let i = 0; i < keyLength; i++){
        let min = [+Infinity, ""];
        const cypherLocal = everyXthChar(cypher,keyLength, i);
        for (let j = 65; j <= 90; j++) {
            let score = [tryKey(cypherLocal, String.fromCharCode(j)), String.fromCharCode(j)];
            if(score[0] < min[0])
            min = score;
        }

        // Loop through the lowercase letters a-z
        for (let j = 97; j <= 122; j++) {
            let score = [tryKey(cypherLocal, String.fromCharCode(j)), String.fromCharCode(j)];
            if(score[0] < min[0])
            min = score;
        }

        key[i] = min[1];
        MinScores[i] = min[0];
    }
    return [MinScores, everyXthChar(key.toString(),2,0)];
}

function everyXthChar(str, step, offset) {
    let newStr = '';
    for (let i = offset; i < str.length; i += step) {
      newStr += str[i];
    }
    return newStr;
}

function getKey(cypher, keyLength){
    //const key = generateKey(cypher, "", keyLength);
    const key = generateKeyOptimized(cypher, keyLength);
    //console.log(key[0]);
    return key[1];
}

function decryptShortXOR(cypher){
    const keyLength = findPositionOfMinKeyLenght(cypher);
    //const key = getKey(cypher, keyLength);
    const key = getKey(cypher, keyLength);
    return xorEncrypt(cypher, key);
}

//first test
const plain = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Tortor consequat id porta nibh venenatis. Vitae auctor eu augue ut lectus arcu bibendum. Tincidunt augue interdum velit euismod. Laoreet suspendisse interdum consectetur libero. Donec ultrices tincidunt arcu non sodales. Pellentesque massa placerat duis ultricies. Ac feugiat sed lectus vestibulum. Sed tempus urna et pharetra pharetra massa massa ultricies. Non curabitur gravida arcu ac tortor dignissim. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor.";
const key = "key";
const cypher = xorEncrypt(plain, key);
//console.log(xorEncrypt(cypher, key));
//console.log(findPositionOfMaxIoC(cypher));
//console.log(findPositionOfMinKeyLenght(cypher));
//console.log(frequencyAnalysis(plain));
//console.log(xorEncrypt(xorEncrypt(cypher, shiftString(cypher, key.length)), plain));
//console.log(frequencyAnalysis(plain));
//console.log(compareFrequencieToDefault(frequencyAnalysis(plain)));
//console.log(tryKey(cypher, "KD"));
console.log(decryptShortXOR(cypher));
