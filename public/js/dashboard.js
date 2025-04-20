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
            <p class="max-w-[250px] text-white bg-[#544DEA] p-2 rounded-b-[15px] rounded-l-[15px]">${text}</p>
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
                <p class="max-w-[250px] bg-white p-2 rounded-b-[15px] rounded-r-[15px]">${response}</p>
            </div>`;
    });
};

// ===== VOCAB QUIZ LOGIC =====

const quizQuestions = [
    {
        question: 'What does "ambulance" mean?',
        choices: ['Fire Truck', 'Police Car', 'Emergency Vehicle', 'Bus'],
        correct: 2
    },
    {
        question: 'What does "classroom" mean?',
        choices: ['Hospital', 'Office', 'Place to Study', 'Gym'],
        correct: 2
    },
    {
        question: 'What does "evacuate" mean?',
        choices: ['Enter', 'Stay', 'Leave Quickly', 'Sleep'],
        correct: 2
    },
    {
        question: 'What does "pencil" mean?',
        choices: ['Something you write with', 'Something you eat', 'Clothing', 'Furniture'],
        correct: 0
    },
    {
        question: 'What does "fire drill" mean?',
        choices: ['Real Fire', 'Cooking Show', 'Practice Emergency', 'Tool'],
        correct: 2
    }
];

let currentQuestionIndex = 0;
let score = 0;

const quizSection = document.querySelector("#vocabulary-questions-container");
const createForm = document.getElementById("create-vocab-form");
const questionBox = quizSection.querySelectorAll("form")[1];
const questionWrapper = questionBox.parentElement;

const renderQuestion = () => {
    const q = quizQuestions[currentQuestionIndex];
    let optionsHtml = "";
    q.choices.forEach((choice, idx) => {
        optionsHtml += `
            <div class="flex flex-row space-x-2 items-center">
                <input name="vocabulary" type="radio" value="${idx}" id="choice${idx}">
                <label for="choice${idx}">${choice}</label>
            </div>`;
    });

    questionWrapper.innerHTML = `
        <p class="text-[18px] mb-2">${q.question}</p>
        <form class="text-[16px] space-y-2">${optionsHtml}</form>
        <button id="check-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-0.5 rounded-[15px]">Check</button>
        <p id="feedback" class="text-[16px] mt-2 font-bold"></p>
    `;

    document.querySelector("#check-btn").addEventListener("click", checkAnswer);
};

const checkAnswer = (e) => {
    e.preventDefault();
    const selected = document.querySelector('input[name="vocabulary"]:checked');
    const feedback = document.getElementById("feedback");

    if (!selected) {
        feedback.textContent = "Please select an answer.";
        feedback.classList.add("text-red-500");
        return;
    }

    const selectedIndex = parseInt(selected.value);
    const isCorrect = selectedIndex === quizQuestions[currentQuestionIndex].correct;

    if (isCorrect) {
        feedback.textContent = "Correct! ✅";
        feedback.classList.remove("text-red-500");
        feedback.classList.add("text-green-600");
        score++;
    } else {
        const correctText = quizQuestions[currentQuestionIndex].choices[quizQuestions[currentQuestionIndex].correct];
        feedback.textContent = `Wrong ❌ — Correct answer is "${correctText}".`;
        feedback.classList.remove("text-green-600");
        feedback.classList.add("text-red-500");
    }

    document.getElementById("check-btn").textContent = "Next";
    document.getElementById("check-btn").removeEventListener("click", checkAnswer);
    document.getElementById("check-btn").addEventListener("click", nextQuestion);
};

const nextQuestion = (e) => {
    e.preventDefault();
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        renderQuestion();
    } else {
        showScore();
    }
};

const showScore = () => {
    questionWrapper.innerHTML = `
        <p class="text-[20px] font-bold text-center">Quiz Complete! 🎉</p>
        <p class="text-[18px] text-center">You got ${score} out of ${quizQuestions.length} correct.</p>
        <button id="restart-btn" class="mt-2 bg-[#544DEA] text-white px-3 py-1 rounded-[15px] mx-auto block">Restart Quiz</button>
    `;

    document.getElementById("restart-btn").addEventListener("click", () => {
        currentQuestionIndex = 0;
        score = 0;
        renderQuestion();
    });
};

const createVocabQuiz = (event) => {
    event.preventDefault();

    createForm.parentElement.style.display = "none";
    questionWrapper.style.display = "flex";
    renderQuestion();
};

createForm.addEventListener("submit", createVocabQuiz);