const textInput = document.getElementById("input-element");

textInput.onkeydown = function(key) {
    let keyCode = key.code || key.key;
    if (keyCode == "Enter") {
        sendText();
    }
};

const sendText = () => {
    const text = textInput.value;
    textInput.value = "";

    chatContainer.innerHTML += `
        <div class="flex space-x-2">
            <p class="grow"></p>
            <p class="max-w-[250px] text-white bg-[#544DEA] p-2 rounded-b-[15px] rounded-l-[15px] text-[14px]">${text}</p>
        </div>`;

    fetch("/dashboard/", {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text: text})
    })
    .then(res => res.json())
    .then(data => {
        const response = data.response;
        chatContainer.innerHTML += `
            <div class="flex space-x-2">
                <p class="text-3xl">🌎</p>
                <p class="max-w-[250px] bg-white p-2 rounded-b-[15px] rounded-r-[15px] text-[14px]">${response}</p>
            </div>`;
    });
};



let currentVocabQuestionIndex = 0;
let currentGrammarQuestionIndex = 0;
let scoreVocab = 0;
let scoreGrammar = 0;

const vocabQuizSection = document.querySelector("#vocabulary-questions-container");
const grammarQuizSection = document.querySelector("#grammar-questions-container");

const createVocabForm = document.getElementById("create-vocab-form");
const createGrammarForm = document.getElementById("create-grammar-form");

const vocabQuestionBox = vocabQuizSection.querySelectorAll("form")[1];
const grammarQuestionBox = grammarQuizSection.querySelectorAll("form")[1];

const vocabQuestionWrapper = vocabQuestionBox.parentElement;
const grammarQuestionWrapper = grammarQuestionBox.parentElement;

const renderVocabQuestion = () => {
    const q = vocabQuizQuestions[currentVocabQuestionIndex];
    let optionsHtml = "";
    q.choices.forEach((choice, idx) => {
        optionsHtml += `
            <div class="flex flex-row space-x-2 items-center">
                <input name="vocabulary" type="radio" value="${idx}" id="choice${idx}">
                <label for="choice${idx}">${choice}</label>
            </div>`;
    });

    vocabQuestionWrapper.innerHTML = `
        <p class="text-[18px] mb-2">${q.question}</p>
        <form class="text-[16px] space-y-2">${optionsHtml}</form>
        <button id="vocab-check-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-0.5 rounded-[15px]">Check</button>
        <p id="vocab-feedback" class="text-[16px] mt-2 font-bold"></p>
    `;

    document.querySelector("#vocab-check-btn").addEventListener("click", checkVocabAnswer);
};

const checkVocabAnswer = (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="vocabulary"]:checked');
    const feedback = document.getElementById("vocab-feedback");

    if (!selected) {
        feedback.textContent = "Please select an answer.";
        feedback.classList.add("text-red-500");
        return;
    }

    const selectedIndex = parseInt(selected.value);
    const isCorrect = selectedIndex === vocabQuizQuestions[currentVocabQuestionIndex].correct;

    if (isCorrect) {
        feedback.textContent = "Correct! ✅";
        feedback.classList.remove("text-red-500");
        feedback.classList.add("text-green-600");
        scoreVocab++;
    } else {
        const correctText = vocabQuizQuestions[currentVocabQuestionIndex].choices[vocabQuizQuestions[currentVocabQuestionIndex].correct];
        feedback.textContent = `Wrong ❌ — Correct answer is "${correctText}".`;
        feedback.classList.remove("text-green-600");
        feedback.classList.add("text-red-500");
    }

    document.getElementById("vocab-check-btn").textContent = "Next";
    document.getElementById("vocab-check-btn").removeEventListener("click", checkVocabAnswer);
    document.getElementById("vocab-check-btn").addEventListener("click", nextVocabQuestion);
};

const nextVocabQuestion = (e) => {
    e.preventDefault();
    currentVocabQuestionIndex++;

    if (currentVocabQuestionIndex < vocabQuizQuestions.length) {
        renderVocabQuestion();
    } else {
        showVocabScore();
    }
};

const showVocabScore = () => {
    vocabQuestionWrapper.innerHTML = `
        <p class="text-[20px] font-bold text-center">Quiz Complete! 🎉</p>
        <p class="text-[18px] text-center">You got ${scoreVocab} out of ${vocabQuizQuestions.length} correct.</p>
        <button id="restart-vocab-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-1 rounded-[15px] mx-auto block">Okay</button>
    `;

    document.getElementById("restart-vocab-btn").addEventListener("click", () => {
        currentVocabQuestionIndex = 0;
        scoreVocab = 0;
        renderVocabQuestion();
    });
};

const createVocabQuiz = (event) => {
    event.preventDefault();
    setTimeout(() => {
    createVocabForm.parentElement.style.display = "none";
    vocabQuestionWrapper.style.display = "flex";
    renderVocabQuestion();
    }, 6000);
};

createVocabForm.addEventListener("submit", createVocabQuiz);

// Grammar Quiz section

const renderGrammarQuestion = () => {
    
    const q = grammarQuizQuestions[currentGrammarQuestionIndex];
    let optionsHtml = "";
    q.choices.forEach((choice, idx) => {
        optionsHtml += `
            <div class="flex flex-row space-x-2 items-center">
                <input name="grammar" type="radio" value="${idx}" id="choice${idx}">
                <label for="choice${idx}">${choice}</label>
            </div>`;
    });

    grammarQuestionWrapper.innerHTML = `
        <p class="text-[18px] mb-2">${q.question}</p>
        <form class="text-[16px] space-y-2">${optionsHtml}</form>
        <button id="grammar-check-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-0.5 rounded-[15px]">Check</button>
        <p id="grammar-feedback" class="text-[16px] mt-2 font-bold"></p>
    `;

    document.querySelector("#grammar-check-btn").addEventListener("click", checkGrammarAnswer);
    
};

const checkGrammarAnswer = (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="grammar"]:checked');
    const feedback = document.getElementById("grammar-feedback");

    if (!selected) {
        feedback.textContent = "Please select an answer.";
        feedback.classList.add("text-red-500");
        return;
    }

    const selectedIndex = parseInt(selected.value);
    const isCorrect = selectedIndex === grammarQuizQuestions[currentGrammarQuestionIndex].correct;

    if (isCorrect) {
        feedback.textContent = "Correct! ✅";
        feedback.classList.remove("text-red-500");
        feedback.classList.add("text-green-600");
        scoreGrammar++;
    } else {
        const correctText = grammarQuizQuestions[currentGrammarQuestionIndex].choices[grammarQuizQuestions[currentGrammarQuestionIndex].correct];
        feedback.textContent = `Wrong ❌ — Correct answer is "${correctText}".`;
        feedback.classList.remove("text-green-600");
        feedback.classList.add("text-red-500");
    }

    document.getElementById("grammar-check-btn").textContent = "Next";
    document.getElementById("grammar-check-btn").removeEventListener("click", checkGrammarAnswer);
    document.getElementById("grammar-check-btn").addEventListener("click", nextGrammarQuestion);
};

const nextGrammarQuestion = (e) => {
    e.preventDefault();
    currentGrammarQuestionIndex++;

    if (currentGrammarQuestionIndex < grammarQuizQuestions.length) {
        renderGrammarQuestion();
    } else {
        showGrammarScore();
    }
};

const showGrammarScore = () => {
    grammarQuestionWrapper.innerHTML = `
        <p class="text-[20px] font-bold text-center">Grammar Quiz Complete! 🎉</p>
        <p class="text-[18px] text-center">You got ${scoreGrammar} out of ${grammarQuizQuestions.length} correct.</p>
        <button id="restart-grammar-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-1 rounded-[15px] mx-auto block">Okay</button>
    `;

    document.getElementById("restart-grammar-btn").addEventListener("click", () => {
        currentGrammarQuestionIndex = 0;
        scoreGrammar = 0;
        renderGrammarQuestion();
    });
};

const createGrammarQuiz = (event) => {
    event.preventDefault();

    setTimeout(() => {
    createGrammarForm.parentElement.style.display = "none";
    grammarQuestionWrapper.style.display = "flex";
    renderGrammarQuestion();
    }, 5500);
};

createGrammarForm.addEventListener("submit", createGrammarQuiz);