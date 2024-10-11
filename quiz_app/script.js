const quizData = [
    {
        question: "What is the most used programming language in 2019?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "JavaScript",
        correct: "d",
    },
    {
        question: "Who is the President of US?",
        a: "Florin Pop",
        b: "Donald Trump",
        c: "Ivan Saldano",
        d: "Mihai Andrei",
        correct: "b",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Cascading Style Sheet",
        c: "Jason Object Notation",
        d: "Helicopters Terminals Motorboats Lamborginis",
        correct: "a",
    },
    {
        question: "What year was JavaScript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "none of the above",
        correct: "b",
    },
];

const quiz = document.querySelector(".container");
const questionel = document.querySelector(".question");
const choicesel = document.querySelector(".choices");
const answerel = document.querySelectorAll(".answer");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submit = document.querySelector(".cta");

let currentQuiz = 0;
let score = 0;

loadquiz();

function loadquiz(){
    deselectAnswers();

    const quizdata = quizData[currentQuiz];

    questionel.innerHTML = quizdata.question;
    a_text.innerHTML = quizdata.a;
    b_text.innerHTML = quizdata.b;
    c_text.innerHTML = quizdata.c;
    d_text.innerHTML = quizdata.d;
    

}


function deselectAnswers() {
    answerel.forEach((answerels) => {
        answerels.checked = false;
    });
}

function right(){
    let answer = undefined;

    answerel.forEach((mans)=>{
        if(mans.checked){
            answer = mans.id;
        }
    });

    return answer;
}

submit.addEventListener("click",()=>{
    const answer = right();

    if(answer){
        if(answer===quizData[currentQuiz].correct){
            score++;
        }

        currentQuiz++;
        if(currentQuiz<quizData.length){
            loadquiz()
        }
        else{
            questionel.innerHTML = `You have scored ${score}/${quizData.length}`
            choicesel.style.opacity = "0.01";
            submit.innerHTML = "Reload"
            submit.addEventListener("click",()=>{
                location.reload();
            })
        }
    }
});