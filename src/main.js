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

function countSamePercent(cypher, amount){
    const cypherBuffer = Buffer.from(cypher);
    const buffer = Buffer.from(rot(cypher, amount));
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
    if(max < 4)
        console.log("No conclusive result found (Max IoC: "+ max +"), continuing anyway...");
    //keyLength 0 does not make sense, so we set it to 1
    if(keyLength === 0)
        keyLength = 1;
    return keyLength;
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
  

function findPositionOfMinKeyLenght(cypher){
    const multipleOfKeyLength = findPositionOfMaxIoC(cypher);
    let factors = getFactors(multipleOfKeyLength);
    factors = factors.map(factor => [factor, countSamePercent(cypher, factor)]);
    factors = factors.filter(factor => factor[1] > 4);
    if(factors.length === 0)
        factors[0] = [1, countSamePercent(cypher, 1)];
    if(factors[0][1] < 5)
        console.log("Smales Key at just IoC: "+ factors[0][1] +"), continuing anyway...");
    return factors[0][0];
}

function recursivTry(text, array, offset, keyLength){
    
}

function decrypt(cypher, keyLength){
    let shiftPossibilities = new Array(cypher.length);
    const cypherBuffer = Buffer.from(cypher);
    let shift = keyLength;
    do{
        const buffer = Buffer.from(rot(cypher, shift));
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = buffer[i] ^ cypherBuffer[i]
        }
        shiftPossibilities[shift] = buffer;
        shift = (shift + keyLength) % cypher.length;
    } while(shift % cypher.length !== keyLength);
    
    let guess = new Array(cypher.length);
    tryToFill(shiftPossibilities, guess, 0);
    return guess.toString().replace(/,/g, '');
}

function tryToFill(shiftPossibilities, guess, offset){
    if(offset === guess.length)
        return true;
    console.log("Start: " + guess.toString().replace(/,/g, ''));
    // Loop through the uppercase letters A-Z
    for (let j = 65; j <= 90; j++) {
        let localGuess = guess.slice();
        localGuess[offset] = String.fromCharCode(j);
        for(let i = 1; i <= shiftPossibilities.length; i++){
            localOffset = (offset + i) % shiftPossibilities.length;
            if(shiftPossibilities[localOffset] !== undefined) {
                if(localGuess[localOffset] !== undefined) {
                    if(localGuess[localOffset] !== shiftPossibilities[localOffset][offset])
                        return false;
                }
                else
                    localGuess[localOffset] = shiftPossibilities[localOffset][offset] ^ String.fromCharCode(j);
            }
        }
        if(tryToFill(shiftPossibilities, localGuess, offset + 1)){
            console.log("Found: " + localGuess.toString().replace(/,/g, ''));
            guess = localGuess;
            return true;
        }
    }
    
    // Loop through the lowercase letters a-z
    for (let i = 97; i <= 122; i++) {
        //console.log(String.fromCharCode(i));
    }
    return false;
}


//first test
const plain1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus sollicitudin bibendum. Mauris vel quam sed lacus tristique dignissim. Aliquam quis elit vel neque blandit bibendum. Nullam malesuada tortor sapien, eu sagittis elit laoreet sit amet. Proin vel velit ut nisl rhoncus sodales eget a lectus. Integer tincidunt turpis id augue ultrices, id eleifend dolor ultricies. Duis in velit sed dolor pharetra hendrerit. Sed molestie tincidunt nibh, eu tincidunt risus vestibulum vel. Nullam quis ex id erat finibus bibendum. Nunc non erat vel mi ultrices tincidunt vitae nec massa. Suspendisse eleifend orci eget odio varius convallis. Sed eget sapien sapien. Aenean eu tellus ac nisi pellentesque pellentesque. Donec vel lectus et quam bibendum vulputate eu vel felis.'
const plain2 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."   
const plain = "Ich wir";
const key = "key";
const cypher = xorEncrypt(plain, key);
console.log(decrypt(cypher, 3));
