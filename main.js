let progressBar = document.querySelector(".progress"),
  questionContent = document.querySelector(".question-content"),
  questionOptions = document.querySelector(".question-options"),
  submitAnswerBtn = document.querySelector("button.next"),
  currentQuestionSpan = document.querySelectorAll(".current"),
  totalQuestionsSpan = document.querySelector(".total"),
  results = document.querySelector(".results"),
  correctAnswersHolder = document.querySelector(".correct-answers"),
  wrongAnswersHolder = document.querySelector(".wrong-answers"),
  score = document.querySelector(".score"),
  totalScore = document.querySelector(".total-score");

async function getQuestions() {
  let response = await fetch("questions.json");

  let data = await response.json();

  beginQuiz(data);
}
getQuestions();

let currentQuestion = 0;
let correctAnswersArr = [];
let wrongAnswersArr = [];

function beginQuiz(questions) {
  let questionsForCategory = questions;
  // setting total questions length to the total questions span
  totalQuestionsSpan.innerHTML = questionsForCategory.length;

  displayQuestion(currentQuestion, questionsForCategory);

  // checking on submiting answer
  function checkAnswer() {
    let options = Array.from(document.querySelectorAll(".option"));

    if (options.filter((op) => op.classList.contains("chose")).length == 0) {
      return;
    }

    let chosenAnswer = options.find((option) =>
      option.classList.contains("chose")
    ).innerHTML;

    let displayedQuestion = questions.find(
      (q) => q.question == questionContent.innerHTML
    );

    let correctAnswer = displayedQuestion.answer;

    // condition for the submitted answer
    if (chosenAnswer == correctAnswer) {
      // pushing correct answers to show them at the end

      correctAnswersArr.push({
        question: displayedQuestion.answer,
        answer: correctAnswer,
        submitted: chosenAnswer,
      });
    } else {
      // pushing wrong answers to show them at the end
      wrongAnswersArr.push({
        question: displayedQuestion.asnwer,
        answer: correctAnswer,
        submitted: chosenAnswer,
      });
    }

    if (checkToEndGame(questionsForCategory)) {
      endGame();
    } else {
      displayQuestion(++currentQuestion, questionsForCategory);
    }

    updateProgressBar(questionsForCategory.length);
    // update the question number;
    updateQuestionHTMLNumber();
  }
  submitAnswerBtn.addEventListener("click", checkAnswer);
}

function checkToEndGame(questions) {
  if (currentQuestion == questions.length - 1) {
    return true;
  } else {
    return false;
  }
}

function endGame() {
  results.classList.add("show-results");
  score.innerHTML = correctAnswersArr.length;
  totalScore.innerHTML = correctAnswersArr.length + wrongAnswersArr.length;

  correctAnswersArr.forEach((answer) =>
    createAnswers(correctAnswersHolder, answer)
  );
  wrongAnswersArr.forEach((answer) =>
    createAnswers(wrongAnswersHolder, answer)
  );

  function createAnswers(appender, answerObj) {
    let { question, submitted, answer } = answerObj;

    let answerHolder = document.createElement("div");
    answerHolder.className = "answer";

    let questionDiv = document.createElement("div");
    questionDiv.className = "question-title";
    questionDiv.appendChild(document.createTextNode(question));
    answerHolder.appendChild(questionDiv);

    let submittedAnswerSpan = document.createElement("span");
    submittedAnswerSpan.className = "submitted";
    submittedAnswerSpan.appendChild(document.createTextNode(submitted));
    answerHolder.appendChild(submittedAnswerSpan);

    let correctAnswerSpan = document.createElement("span");
    correctAnswerSpan.className = "correct";
    correctAnswerSpan.appendChild(document.createTextNode(answer));
    answerHolder.appendChild(correctAnswerSpan);

    if (answer == submitted) {
      answerHolder.innerHTML += `<ion-icon name="checkmark-outline"></ion-icon>`;
    } else {
      answerHolder.innerHTML += `<ion-icon name="add-outline"></ion-icon>`;
    }

    appender.appendChild(answerHolder);
  }
}

progressBarFilledBy = 0;
function updateProgressBar(questionsLength) {
  let increaseBy = 100 / questionsLength;
  progressBarFilledBy += increaseBy;
  progressBar.style.width = `${progressBarFilledBy}%`;
}

function updateQuestionHTMLNumber() {
  currentQuestionSpan.forEach((e) => (e.innerHTML = currentQuestion + 1));
}

function displayQuestion(questionIndex, allQuestions) {
  let { question, choices, answer } = allQuestions[questionIndex];

  updateQuestionHTML(question);

  updateChoicesHTML(choices);
}

function updateQuestionHTML(question) {
  questionContent.innerHTML = question;
}

function updateChoicesHTML(choices) {
  questionOptions.innerHTML = "";
  choices.split(",").forEach((choiceText) => {
    let choicePara = document.createElement("p");
    choicePara.appendChild(document.createTextNode(choiceText));
    choicePara.className = "option";
    questionOptions.appendChild(choicePara);
    choicePara.addEventListener("click", () => {
      document
        .querySelectorAll(".option")
        .forEach((e) => e.classList.remove("chose"));
      choicePara.classList.toggle("chose");
    });
  });
}
