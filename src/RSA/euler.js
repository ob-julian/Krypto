const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function gcdExtendedRecursive(a, b) {
    if (b == 0) {
        s = 1;
        t = 0;
        return { gcd: a, s: s, t: t}
    }
    let d = gcdExtendedRecursive(b, a % b);
    let t1 = d.t;
    let s1 = d.s;
    s = t1;
    t = s1 - Math.floor(a / b) * t1;
    return { gcd: d.gcd, s, t }
}

function gcdExtendedIterative(a, b) {
    let s = 1;
    let t = 0;
    let u = 0;
    let v = 1;
    while (b != 0) {
        extra_log(`a: ${a} b: ${b} s: ${s} t: ${t} u: ${u} v: ${v}`);
        let q = Math.floor(a / b);
        let b1 = b;
        b = a - q * b;
        a = b1;
        let u1 = u;
        u = s - q * u;
        s = u1;
        let v1 = v;
        v = t - q * v;
        t = v1;
    }
    extra_log(`a: ${a} b: ${b} s: ${s} t: ${t} u: ${u} v: ${v}`);
    return { gcd: a, s, t }
}

function ggT(a, b) {
    if(a<b){
        var tmp = a;
        a = b;
        b = tmp;
    }
    if (a == 0)
        return b;
    while (b !== 0) {
        extra_log(`a: ${a} b: ${b}`);
        let tmp = a % b;
        a = b;
        b = tmp;
    }
    extra_log(`a: ${a} b: ${b}`);
    return a;
}

function main() {
    readline.question("Zahl 1: ", a => {
        readline.question("Zahl 2: ", b => {
            let d = gcdExtendedRecursive(a, b);
            console.log(`ggT: ${d.gcd} = ${d.s} * ${a} + ${d.t} * ${b}`);
            console.log("-".repeat(50));
            d = gcdExtendedIterative(a, b);
            console.log(`ggT: ${d.gcd} = ${d.s} * ${a} + ${d.t} * ${b}`);
            console.log("-".repeat(50));
            console.log(`ggT: ${ggT(a, b)}`);
            readline.close();
            readline.removeAllListeners();
        });
    });
}

function extra_log(str) {
    console.log(str);
}

main();