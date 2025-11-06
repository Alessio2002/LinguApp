// LogicEngine.js

/**
 * CORE IONIAN LANGUAGE DATA
 * This data is extracted from the 'Parlar Ioniâno' and 'Standard Ionian verb tables' documents.
 */
const IonianData = {
  // Basic Pronunciation and Alphabet (used for Lesson 1)
  alphabet: [
    { letter: "A", ipa: "[a]", notes: "Also [a:] (long)" },
    { letter: "B", ipa: "[b]" },
    { letter: "C", ipa: "[t͡ʃ]", notes: "Before i or e, otherwise [k]" },
    { letter: "D", ipa: "[d]" },
    { letter: "E", ipa: "[e]", notes: "Also [e:] (long)" },
    { letter: "F", ipa: "[f]" },
    { letter: "G", ipa: "[d͡ʒ]", notes: "Before i or e, otherwise [g]" },
    { letter: "H", ipa: "(silent)" },
    { letter: "I", ipa: "[i]" },
    { letter: "J", ipa: "[j]" },
  ],
  // Basic Vocabulary (Introduction)
  vocabulary: [
    { ionian: "Salvê", english: "Hello", pronunciation: "[sal’ve]" },
    { ionian: "Vale", english: "Bye", pronunciation: "[va.le]" },
    {
      ionian: "Ce vîderemo",
      english: "See you later",
      pronunciation: "[t͡ʃe...]",
    },
    { ionian: "Sì", english: "Yes" },
    { ionian: "Nôn", english: "No" },
    { ionian: "Pizze", english: "pizzas" },
    { ionian: "Aqua", english: "water" },
    { ionian: "le", english: "the" }, // Article for sentence builder
    { ionian: "nil", english: "in the" }, // Contraction for sentence builder
    { ionian: "Avviamo", english: "We have" }, // Verb for sentence builder
  ],
  // Grammatical Gender Rules
  genderRules: {
    masculine: {
      singular: ["-o", "-u", "consonant", "-e"],
      plural: ["-i"], // (Citation: 1515)
    },
    feminine: {
      singular: ["-a", "consonant", "-e"],
      plural: ["-e"], // (Citation: 1516)
    },
    neuter: {
      // inanimate only
      singular: ["-û", "consonant", "-e"], // (Citation: 1513)
      plural: ["-a"], // Neuter merges with plural feminine form, but uses suffix -a (except for -e words) (Citation: 1517)
    },
  },
  // Irregular Verb: Esser (To be) - Present Tense
  esserPresent: {
    Jo: "Sô", // I am
    Tu: "Sê", // You are (informal singular)
    "Lu/Ila": "E", // He/She/It is
    Noi: "Sjamo", // We are
    Voi: "Este", // You are (informal plural)
    "Ei/Lôr": "Sôn", // They are
  },
  // Verb: Habitar (To live) - Present Tense (1st form conjugation)
  habitarPresent: {
    Jo: "Habito",
    Tu: "Habiti",
    "Lu/Ila": "Habita",
    Noi: "Habitamo",
    Voi: "Habitate",
    "Ei/Lôr": "Habitano",
  },
  // Definite Articles (Citation: 1466, 1238)
  articles: {
    masc_sg: "Lo",
    fem_sg: "La",
    neut_sg: "Lu",
    masc_pl: "Li",
    fem_pl: "Le",
  },
};

/**
 * LESSON STRUCTURE
 * This defines the content flow of your Structural Review lessons.
 */
const IonianLessons = [
  {
    name: "Module 1: Foundations (Sounds, Greetings, & Esser)",
    steps: [
      // INFO STEP: Introduction
      {
        type: "info",
        title: "Introduction: The Ionian Alphabet",
        content: `Ionian features 5 vowels (A, E, I, O, U) and 18 consonants. A key feature is that a hard 'C', 'G', or 'SC' sound must be maintained throughout all word forms.`,
      },
      // MULTIPLE CHOICE: Vowel Recognition (Citation: 1520)
      {
        type: "mcq",
        prompt:
          "Which Ionian letter corresponds to the IPA sound [a:] (long A)?",
        correctAnswer: "A",
        options: ["A", "E", "O", "I"],
        questionType: "Pronunciation",
      },
      // MULTIPLE CHOICE: Vowel Recognition (Citation: 1540)
      {
        type: "mcq",
        prompt:
          "The letter U is pronounced [w] before which letter combinations?",
        correctAnswer: "a, e, i or o",
        options: [
          "a, e, i or o",
          "r, l, n, m",
          "consonants",
          "vowels at the end of a word",
        ],
        questionType: "Pronunciation",
      },
      // INFO STEP: Orthography Rule Check
      {
        type: "info",
        title: "Orthography Rule Review",
        content: `Note: Before 'I' or 'E', the letter C is pronounced [t͡ʃ] and G is pronounced [d͡ʒ]. The letter H is always silent.`,
      },
      // TRANSLATION: Basic Greeting
      {
        type: "translate",
        prompt: 'Select the English equivalent of the Ionian word "Vale":',
        correctAnswer: "Bye",
        options: ["Hello", "Bye", "Welcome", "Thanks"],
        questionType: "Vocabulary",
      },
      // INFO STEP: Grammatical Gender
      {
        type: "info",
        title: "Review: Three Grammatical Genders",
        content: `Ionian features three grammatical genders: Masculine, Feminine, and Neuter. The ending of a noun typically defines its gender.`,
      },
      // MCQ: Gender Rule Application (Citation: 1515)
      {
        type: "mcq",
        prompt: "Which plural ending is characteristic of a masculine noun?",
        correctAnswer: "-i",
        options: ["-a", "-e", "-i", "-o"],
        questionType: "Grammar",
      },
      // MCQ: Definite Article (Citation: 1466, 1238)
      {
        type: "mcq",
        prompt: "What is the correct feminine plural definite article?",
        correctAnswer: "Le",
        options: ["La", "Li", "Le", "Lu"],
        questionType: "Grammar",
      },
      // Conjugation Practice (using Esser)
      {
        type: "conjugation",
        verb: "Esser (To be)",
        pronoun: "Tu", // You (singular informal)
        prompt:
          "Provide the correct conjugation of Esser (To be) for the pronoun Tu (You, informal singular):",
        correctAnswer: "Sê",
        options: ["Sô", "E", "Sjamo", "Sê"],
        questionType: "Grammar",
      },
      // Sentence Builder: Basic SVO
      {
        type: "sentence_builder",
        prompt: 'Build the Ionian sentence: "I live."',
        correctSentence: ["Jo", "Habito"], // IonianData.habitarPresent.Jo
        options: ["Habiti", "Jo", "Sô", "Habito"],
        questionType: "Sentence Construction",
      },
      // Sentence Builder: SVO with Prepositional Phrase
      {
        type: "sentence_builder",
        prompt: 'Build the Ionian sentence: "They live in the water."',
        correctSentence: ["Ei", "Habitano", "nil", "Aqua"],
        options: ["nel", "Ei", "Habiti", "Aqua", "Habitano", "nil"],
        questionType: "Sentence Construction",
        // Assuming 'nil' is used as a contraction for 'in the' for simplicity.
      },
      // Sentence Builder: Subject + Verb + Direct Object
      {
        type: "sentence_builder",
        prompt: 'Build the Ionian sentence: "We have the pizzas."',
        correctSentence: ["Noi", "Avviamo", "le", "Pizze"],
        options: ["Avviamo", "Noi", "Pizze", "la", "le", "Sôn"],
        questionType: "Sentence Construction",
      },
      // END OF LESSON
      {
        type: "info",
        title: "Module Complete!",
        content:
          "Congratulations! You have successfully reviewed the foundational elements of Ionian phonology, greetings, verb conjugations, and basic sentence structure.",
      },
    ],
  },
];

/**
 * CORE LOGIC
 * Functions to manage state and retrieve lesson content.
 */
let currentLessonIndex = 0;
let currentStepIndex = 0;
// Note: We'll keep a simple 3-life system for demonstration, but it's now just a "score"
let accuracyScore = 3;

const currentLesson = IonianLessons[currentLessonIndex];

function getCurrentStep() {
  if (currentStepIndex < currentLesson.steps.length) {
    return currentLesson.steps[currentStepIndex];
  }
  return null;
}

function advanceStep() {
  currentStepIndex++;
  return getCurrentStep();
}

function resetLesson() {
  currentStepIndex = 0;
  accuracyScore = 3;
}

// Export the necessary data and functions for App.js
const LogicEngine = {
  IonianData,
  IonianLessons,
  getCurrentStep,
  advanceStep,
  resetLesson,
  currentLesson,
  // Utility for the app to know overall progress
  getTotalSteps: () => IonianLessons[currentLessonIndex].steps.length,
  getCurrentStepIndex: () => currentStepIndex,
  getAccuracyScore: () => accuracyScore,
  decrementAccuracy: () => {
    accuracyScore = Math.max(0, accuracyScore - 1);
  },
};
