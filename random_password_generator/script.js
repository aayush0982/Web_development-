const passwordel = document.querySelector(".password");
const ipnutel = document.querySelector(".pleninput");
const upperel = document.querySelector(".uccheck");
const lowerel = document.querySelector(".lccheck");
const numel = document.querySelector(".numcheck");
const spsymbolel = document.querySelector(".spcheck");
const generatebtnel = document.querySelector(".generatebtn");
const copybtnel = document.querySelector(".copy");


const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+=";

function getLowercase() {
    return lowerLetters[Math.floor(Math.random() * lowerLetters.length)];
}

function getUppercase() {
    return upperLetters[Math.floor(Math.random() * upperLetters.length)];
}

function getNumber() {
    return numbers[Math.floor(Math.random() * numbers.length)];
}

function getSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function genpassword(){
    const len = ipnutel.value;
    let pass = "";
    if(upperel.checked){
        pass+= getUppercase();
    }
    if(lowerel.checked){
        pass+= getLowercase();
    }
    if(numel.checked){
        pass+= getNumber();
    }
    if(spsymbolel.checked){
        pass+= getSymbol();
    }

    for(i=pass.length; i<len;i++){
        x = genspx();
        pass+= x;
    }

    passwordel.innerText = pass;

}

function genspx(){
    const xs = [];
    if (upperel.checked) {
        xs.push(getUppercase());
    }

    if (lowerel.checked) {
        xs.push(getLowercase());
    }

    if (numel.checked) {
        xs.push(getNumber());
    }

    if (spsymbolel.checked) {
        xs.push(getSymbol());
    }

    if (xs.length === 0) return "";

    return xs[Math.floor(Math.random() * xs.length)];
}

generatebtnel.addEventListener("click", genpassword);

copybtnel.addEventListener("click", () => {
    const textarea = document.createElement("textarea");
    const password = passwordel.innerText;

    if (!password) {
        return;
    }

    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    copybtnel.src = "tick.svg";
    setTimeout(()=>{
        copybtnel.src = "copy.png";
    },800)
    // alert("Password copied to clipboard");
});