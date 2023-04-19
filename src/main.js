function xorEncrypt(message, key) {
    const buffer = Buffer.from(message);
    const keyBuffer = Buffer.from(key);
  
    for (let i = 0; i < buffer.length; i++) {
        const j = i % keyBuffer.length;
        buffer[i] ^= keyBuffer[j];
    }
  
    return buffer.toString('utf-8');
}

function rotR(str, x) {
    // Calculate the effective rotation amount
    const effectiveRotation = x % str.length;
  
    // Rotate the string using slice and concat
    const rotated = str.slice(-effectiveRotation) + str.slice(0, -effectiveRotation);
  
    return rotated;
}

function rotL(str, x) {
    // Calculate the effective rotation amount
    const effectiveRotation = x % str.length;
  
    // Rotate the string using slice and concat
    const rotated = str.slice(effectiveRotation) + str.slice(0, effectiveRotation);
  
    return rotated;
}

function countSame(str, amount){
    let strBuffer = Buffer.from(str);
    let buffer;
    let count = 0;
    if(amount > 0)
        buffer = Buffer.from(rotR(str, amount));
    else
        buffer = Buffer.from(rotL(str, -amount));
    for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= strBuffer[i];
        if((buffer[i] ^ strBuffer[i]) === 0)
            count++;
    }
    return count/str.length;
}
  
  
  
//first test
const plain = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus sollicitudin bibendum. Mauris vel quam sed lacus tristique dignissim. Aliquam quis elit vel neque blandit bibendum. Nullam malesuada tortor sapien, eu sagittis elit laoreet sit amet. Proin vel velit ut nisl rhoncus sodales eget a lectus. Integer tincidunt turpis id augue ultrices, id eleifend dolor ultricies. Duis in velit sed dolor pharetra hendrerit. Sed molestie tincidunt nibh, eu tincidunt risus vestibulum vel. Nullam quis ex id erat finibus bibendum. Nunc non erat vel mi ultrices tincidunt vitae nec massa. Suspendisse eleifend orci eget odio varius convallis. Sed eget sapien sapien. Aenean eu tellus ac nisi pellentesque pellentesque. Donec vel lectus et quam bibendum vulputate eu vel felis.'
const key = "lool";
const cypher = xorEncrypt(plain, key);
console.log(countSame(cypher,1));
console.log(countSame(cypher,2));
console.log(countSame(cypher,3));
console.log(countSame(cypher,4));
console.log(countSame(cypher,5));

