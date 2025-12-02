// App.js

// DOM Elements - UPDATED
const lessonModuleEl = document.getElementById("lesson-module");
const questionAreaEl = document.getElementById("question-area");
const answerSelectionEl = document.getElementById("answer-selection-area");
const progressBarEl = document.getElementById("progress-bar");
const accuracyScoreEl = document.getElementById("accuracy-score");
const confirmBtn = document.getElementById("confirm-btn");
const nextBtn = document.getElementById("next-btn");
const actionBarEl = document.getElementById("action-bar");
const messageAreaEl = document.getElementById("message-area");
// NEW DOM Elements for Hint System
const hintBtn = document.getElementById("hint-btn");
const hintModalEl = document.getElementById("hint-modal");
const hintContentEl = document.getElementById("hint-content");
const hintCloseBtn = document.getElementById("hint-close-btn");

let currentCorrectAnswer = null; // Used for MCQ/Translate
let currentCorrectSentence = []; // Used for Sentence Builder
let selectedAnswer = null;
let assembledSentence = []; // Used for Sentence Builder

// --- UI Management Functions ---

function updateProgress() {
  const total = LogicEngine.getTotalSteps();
  const current = LogicEngine.getCurrentStepIndex();
  const percentage = (current / total) * 100;
  progressBarEl.style.width = `${percentage}%`;
  accuracyScoreEl.textContent = `${LogicEngine.getAccuracyScore()}/3`;
}

// NEW FUNCTION: Displays the hint modal with relevant content
function showHint(step) {
  let hintText = "No specific hint available for this question type.";

  // Determine hint content based on step type
  if (
    step.type === "mcq" ||
    step.type === "translate" ||
    step.type === "conjugation"
  ) {
    // For simple selection/input, offer a reminder of the core rule
    hintText = `
        <p class="font-bold mb-2">Remember the basics:</p>
        <ul class="list-disc list-inside ml-4 text-gray-700">
            <li>Check the ${step.questionType} rules you reviewed.</li>
            <li>For conjugation, recall the subject pronoun (**${
              step.pronoun || "Tu"
            }**) and the verb form (**${step.verb || "Esser"}**).</li>
        </ul>
    `;
  } else if (step.type === "sentence_builder") {
    // For sentence builder, offer word order guidance
    hintText = `
        <p class="font-bold mb-2">Sentence Builder Hint:</p>
        <p class="mb-3">Ionian typically follows a **Subject-Verb-Object (SVO)** word order.</p>
        <p class="text-sm text-gray-600">Think: **[Subject]** + **[Verb]** + **[Object/Prepositional Phrase]**.</p>
        <ul class="list-disc list-inside ml-4 text-gray-700 mt-2">
            <li>Ensure your verb is correctly conjugated for the subject.</li>
            <li>Articles (e.g., 'le', 'nil') usually precede the noun.</li>
        </ul>
    `;
  }

  hintContentEl.innerHTML = hintText;
  hintModalEl.classList.remove("hidden");
}

// NEW FUNCTION: Hides the hint modal
function hideHint() {
  hintModalEl.classList.add("hidden");
}

// Bind the hint button listeners
hintBtn.addEventListener("click", () => showHint(LogicEngine.getCurrentStep()));
hintCloseBtn.addEventListener("click", hideHint);

function displayInfoStep(step) {
  questionAreaEl.innerHTML = "";
  answerSelectionEl.innerHTML = "";
  confirmBtn.classList.add("hidden");
  hintBtn.classList.add("hidden"); // Hide hint for info steps

  // Structure the information screen
  lessonModuleEl.innerHTML = `
        <div class="info-card">
            <h3>${step.title}</h3>
            <p>${step.content}</p>
        </div>
    `;

  nextBtn.textContent =
    LogicEngine.getCurrentStepIndex() === 0 ? "BEGIN REVIEW" : "NEXT MODULE";
  nextBtn.classList.remove("hidden");
}

function displayMCQ(step) {
  const displayPrompt = `<h2>${step.prompt}</h2>`;

  lessonModuleEl.innerHTML = displayPrompt;
  questionAreaEl.innerHTML = "";
  answerSelectionEl.innerHTML = "";

  currentCorrectAnswer = step.correctAnswer;
  selectedAnswer = null;

  // Render answer tiles
  step.options.forEach((option) => {
    const tile = document.createElement("div");
    tile.classList.add("answer-tile");
    tile.textContent = option;
    tile.addEventListener("click", () => handleAnswerSelection(tile, option));
    answerSelectionEl.appendChild(tile);
  });

  confirmBtn.classList.remove("hidden");
  hintBtn.classList.remove("hidden"); // Show hint for questions
  nextBtn.classList.add("hidden");
  confirmBtn.disabled = true;
}

// NEW FUNCTION: Sentence Builder Interface
function displaySentenceBuilder(step) {
  currentCorrectSentence = step.correctSentence;
  assembledSentence = [];
  selectedAnswer = null;

  // 1. Display Prompt
  lessonModuleEl.innerHTML = `<h2>Translate and construct the Ionian sentence: "${step.prompt}"</h2>`;
  questionAreaEl.innerHTML = `
        <div id="sentence-assembly-area" class="border p-4 mb-4 rounded-md min-h-[80px] flex flex-wrap gap-2 justify-center">
            </div>
    `;
  answerSelectionEl.innerHTML = `
        <div id="word-bank-area" class="flex flex-wrap gap-2 justify-center mt-4">
            </div>
    `;

  const assemblyArea = document.getElementById("sentence-assembly-area");
  const wordBankArea = document.getElementById("word-bank-area");

  // Helper function to render the assembled sentence
  const renderAssembly = () => {
    // Clear and rebuild the assembly area
    assemblyArea.innerHTML = assembledSentence
      .map(
        (word, index) =>
          `<button class="btn-sentence-word assembled-word" data-word="${word}" data-index="${index}">${word}</button>`
      )
      .join(" ");

    // Add listeners to assembled words to move them back
    assemblyArea.querySelectorAll(".assembled-word").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // Remove the word from the assembled array using its content
        const wordToRemove = e.target.getAttribute("data-word");
        // Find the index of the first occurrence of this word (to maintain original insertion order if multiple identical words exist)
        const index = assembledSentence.indexOf(wordToRemove);
        if (index > -1) {
          assembledSentence.splice(index, 1);
        }
        renderAssembly();
        renderWordBank();
      });
    });

    // Disable CONFIRM button if no words are selected
    confirmBtn.disabled = assembledSentence.length === 0;
  };

  // Helper function to render the word bank (shuffled)
  const renderWordBank = () => {
    // Shuffle options to prevent giving away the order
    const shuffledOptions = [...step.options].sort(() => Math.random() - 0.5);

    // Use a temporary array to track which words from the options are still available
    // NOTE: This logic needs to be robust for duplicate words, but using array removal (splice) is a common quick method.
    const availableWords = [...step.options];
    assembledSentence.forEach((usedWord) => {
      const index = availableWords.indexOf(usedWord);
      if (index > -1) {
        availableWords.splice(index, 1);
      }
    });

    wordBankArea.innerHTML = availableWords
      .map((word) => {
        return `<button class="btn-sentence-word bank-word" data-word="${word}">${word}</button>`;
      })
      .join("");

    // Add listeners to bank words to move them to assembly
    wordBankArea.querySelectorAll(".bank-word").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const wordToAdd = e.target.getAttribute("data-word");
        assembledSentence.push(wordToAdd);
        renderAssembly();
        renderWordBank();
      });
    });
  };

  // Initial render
  renderWordBank();

  confirmBtn.classList.remove("hidden");
  hintBtn.classList.remove("hidden"); // Show hint for questions
  nextBtn.classList.add("hidden");
  confirmBtn.disabled = true;
}

// Handler for when a user clicks an answer tile (MCQ/Translate/Conjugation)
function handleAnswerSelection(clickedTile, answer) {
  document.querySelectorAll(".answer-tile").forEach((tile) => {
    tile.classList.remove("selected");
  });

  clickedTile.classList.add("selected");
  selectedAnswer = answer;
  confirmBtn.disabled = false;
}

function checkAnswer() {
  let isCorrect = false;

  const currentStep = LogicEngine.getCurrentStep();

  if (
    currentStep.type === "mcq" ||
    currentStep.type === "translate" ||
    currentStep.type === "conjugation"
  ) {
    isCorrect = selectedAnswer === currentCorrectAnswer;
  } else if (currentStep.type === "sentence_builder") {
    // For sentence builder, join the arrays into strings and compare
    const assembledString = assembledSentence.join(" ").toLowerCase();
    const correctString = currentCorrectSentence.join(" ").toLowerCase();
    isCorrect = assembledString === correctString;
    currentCorrectAnswer = currentCorrectSentence.join(" "); // For display in feedback
  }

  // FIX: Ensure the hint modal is closed when the user confirms their answer
  hideHint();

  // Visual Feedback
  messageAreaEl.classList.remove(
    "hidden",
    "message-correct",
    "message-incorrect"
  );
  confirmBtn.classList.add("hidden");
  hintBtn.classList.add("hidden"); // Hide hint after confirming
  nextBtn.classList.remove("hidden");

  if (isCorrect) {
    messageAreaEl.classList.add("message-correct");
    messageAreaEl.innerHTML = "Correct. Proceed to the next step.";
  } else {
    LogicEngine.decrementAccuracy(); // Decrement score
    updateProgress(); // Update the score display

    messageAreaEl.classList.add("message-incorrect");

    if (LogicEngine.getAccuracyScore() > 0) {
      messageAreaEl.innerHTML = `Error. The correct answer was "${currentCorrectAnswer}". Score remaining: ${LogicEngine.getAccuracyScore()}/3.`;
    } else {
      messageAreaEl.innerHTML = `Module Failed. The correct answer was "${currentCorrectAnswer}". Please restart the lesson.`;
      nextBtn.textContent = "RESTART MODULE";
    }
  }

  // Disable further answer interaction for all question types
  document
    .querySelectorAll(".answer-tile")
    .forEach((tile) => (tile.style.pointerEvents = "none"));
  document
    .querySelectorAll(".btn-sentence-word")
    .forEach((btn) => (btn.style.pointerEvents = "none"));
}

function renderStep() {
  hideHint(); // Always hide hint when rendering a new step

  if (LogicEngine.getAccuracyScore() === 0) {
    LogicEngine.resetLesson();
    displayInfoStep({
      type: "info",
      title: "Restarting Module",
      content:
        "Your accuracy score reached zero. You must restart the review module to continue.",
    });
    return;
  }

  const step = LogicEngine.getCurrentStep();

  messageAreaEl.classList.add("hidden");
  messageAreaEl.className = "";

  const moduleTitleEl =
    lessonModuleEl.querySelector("#lesson-title") ||
    document.createElement("h1");
  moduleTitleEl.id = "lesson-title";
  moduleTitleEl.textContent = LogicEngine.currentLesson.name;
  if (!lessonModuleEl.querySelector("#lesson-title"))
    lessonModuleEl.prepend(moduleTitleEl);

  if (!step) {
    displayLessonComplete();
    return;
  }

  updateProgress();

  if (step.type === "info") {
    displayInfoStep(step);
  } else if (
    step.type === "mcq" ||
    step.type === "translate" ||
    step.type === "conjugation"
  ) {
    displayMCQ(step);
  } else if (step.type === "sentence_builder") {
    // Handle the new step type
    displaySentenceBuilder(step);
  } else if (step.type === "match") {
    displayInfoStep({
      type: "info",
      title: `Complex Review: ${step.questionType}`,
      content: `A full matching challenge component would be rendered here. Tap NEXT MODULE to proceed.`,
    });
  }
}

function handleNext() {
  if (LogicEngine.getAccuracyScore() === 0) {
    LogicEngine.resetLesson();
  } else {
    LogicEngine.advanceStep();
  }
  renderStep();
}

function displayLessonComplete() {
  // FIX: Ensure the hint modal is closed on completion
  hideHint();

  lessonModuleEl.innerHTML = `
        <h1 class="text-2xl font-bold mb-4">Module Review Complete! 🎉</h1>
        <p class="text-gray-700">You have successfully mastered Module 1 of Ionian. Your final accuracy score was ${LogicEngine.getAccuracyScore()}/3.</p>
    `;
  questionAreaEl.innerHTML = "";
  answerSelectionEl.innerHTML = "";
  confirmBtn.classList.add("hidden");
  nextBtn.classList.add("hidden");
  hintBtn.classList.add("hidden");

  actionBarEl.innerHTML =
    '<button onclick="LogicEngine.resetLesson(); renderStep();" class="w-full p-3 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-gray-300 transition duration-200">Start Next Module / Return to Menu</button>';
}

// --- Event Listeners ---
confirmBtn.addEventListener("click", checkAnswer);
nextBtn.addEventListener("click", handleNext);
// Note: Hint button listeners are added inside showHint/hideHint functions

// --- Initialisation ---
document.addEventListener("DOMContentLoaded", () => {
  if (hintModalEl) {
    hideHint();
  }
  renderStep();
});
