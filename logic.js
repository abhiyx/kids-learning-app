// Question generation logic for all exercise types

/**
 * Generate a random number within the configured range
 */
function getRandomNumber() {
    return Math.floor(Math.random() * (CONFIG.NUMBER_RANGE_MAX - CONFIG.NUMBER_RANGE_MIN + 1)) + CONFIG.NUMBER_RANGE_MIN;
}

/**
 * Generate unique random numbers for answer options
 * @param {number} correctAnswer - The correct answer
 * @param {number} count - Number of options needed
 * @returns {Array} Array of unique numbers including correct answer
 */
function generateUniqueOptions(correctAnswer, count) {
    const options = new Set([correctAnswer]);
    
    while (options.size < count) {
        const num = getRandomNumber();
        if (num !== correctAnswer) {
            options.add(num);
        }
    }
    
    // Convert to array and shuffle
    const optionsArray = Array.from(options);
    for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    
    return optionsArray;
}

/**
 * Generate sign options for comparison questions
 * @param {string} correctSign - The correct sign ('<', '>', or '=')
 * @param {number} count - Number of options needed
 * @returns {Array} Array of unique signs including correct answer
 */
function generateSignOptions(correctSign, count) {
    const allSigns = ['<', '>', '='];
    const options = new Set([correctSign]);
    
    // Add other signs until we have enough options
    while (options.size < count && options.size < allSigns.length) {
        const randomSign = allSigns[Math.floor(Math.random() * allSigns.length)];
        options.add(randomSign);
    }
    
    // If we still need more options (unlikely with 3 options), duplicate signs
    while (options.size < count) {
        const randomSign = allSigns[Math.floor(Math.random() * allSigns.length)];
        options.add(randomSign);
    }
    
    // Convert to array and shuffle
    const optionsArray = Array.from(options);
    for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }
    
    return optionsArray;
}

/**
 * Generate a question for "missing" exercise type
 * Format: "3 _ 5" (find the missing number)
 */
function generateMissingQuestion() {
    // Ensure we have at least 3 numbers in range (min, min+1, min+2)
    if (CONFIG.NUMBER_RANGE_MAX - CONFIG.NUMBER_RANGE_MIN < 2) {
        // Range too small, use fallback
        const a = CONFIG.NUMBER_RANGE_MIN;
        const b = CONFIG.NUMBER_RANGE_MAX;
        const missing = a + 1;
        const options = generateUniqueOptions(missing, CONFIG.OPTIONS_COUNT);
        return {
            question: `${a} _ ${b}`,
            correctAnswer: missing,
            options: options,
            type: 'missing'
        };
    }
    
    // Generate two numbers that are at least 2 apart
    // First number can be from min to max-2
    const maxFirst = CONFIG.NUMBER_RANGE_MAX - 2;
    const a = Math.floor(Math.random() * (maxFirst - CONFIG.NUMBER_RANGE_MIN + 1)) + CONFIG.NUMBER_RANGE_MIN;
    const b = a + 2; // Always exactly 2 apart for simplicity
    const missing = a + 1;
    
    const options = generateUniqueOptions(missing, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${a} _ ${b}`,
        correctAnswer: missing,
        options: options,
        type: 'missing'
    };
}

/**
 * Generate a question for "before" exercise type
 * Format: "___ 7" (worksheet style)
 */
function generateBeforeQuestion() {
    // Can't ask "before" for the minimum number
    const num = Math.floor(Math.random() * (CONFIG.NUMBER_RANGE_MAX - CONFIG.NUMBER_RANGE_MIN)) + CONFIG.NUMBER_RANGE_MIN + 1;
    const correctAnswer = num - 1;
    const options = generateUniqueOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `___ ${num}`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'before'
    };
}

/**
 * Generate a question for "after" exercise type
 * Format: "7 ___" (worksheet style)
 */
function generateAfterQuestion() {
    // Can't ask "after" for the maximum number
    const num = Math.floor(Math.random() * (CONFIG.NUMBER_RANGE_MAX - CONFIG.NUMBER_RANGE_MIN)) + CONFIG.NUMBER_RANGE_MIN;
    const correctAnswer = num + 1;
    const options = generateUniqueOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${num} ___`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'after'
    };
}

/**
 * Generate a question for "greater" exercise type
 * Format: "12 ? 10" (worksheet style - pick the correct sign, answer: >)
 * The sign should make the statement TRUE: 12 > 10
 */
function generateGreaterQuestion() {
    let num1 = getRandomNumber();
    let num2 = getRandomNumber();
    
    // Ensure they're different (retry up to 10 times)
    let attempts = 0;
    while (num1 === num2 && attempts < 10) {
        num2 = getRandomNumber();
        attempts++;
    }
    
    // If still same (very unlikely), use min and max
    if (num1 === num2) {
        num1 = CONFIG.NUMBER_RANGE_MAX;
        num2 = CONFIG.NUMBER_RANGE_MIN;
    }
    
    // Ensure num1 > num2 so the correct answer is ">" (making the statement true)
    if (num1 < num2) {
        [num1, num2] = [num2, num1];
    }
    
    const correctAnswer = '>';
    const options = generateSignOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${num1} ? ${num2}`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'greater'
    };
}

/**
 * Generate a question for "smaller" exercise type
 * Format: "10 ? 12" (worksheet style - pick the correct sign, answer: <)
 * The sign should make the statement TRUE: 10 < 12
 */
function generateSmallerQuestion() {
    let num1 = getRandomNumber();
    let num2 = getRandomNumber();
    
    // Ensure they're different (retry up to 10 times)
    let attempts = 0;
    while (num1 === num2 && attempts < 10) {
        num2 = getRandomNumber();
        attempts++;
    }
    
    // If still same (very unlikely), use min and max
    if (num1 === num2) {
        num1 = CONFIG.NUMBER_RANGE_MIN;
        num2 = CONFIG.NUMBER_RANGE_MAX;
    }
    
    // Ensure num1 < num2 so the correct answer is "<" (making the statement true)
    if (num1 > num2) {
        [num1, num2] = [num2, num1];
    }
    
    const correctAnswer = '<';
    const options = generateSignOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${num1} ? ${num2}`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'smaller'
    };
}

/**
 * Generate a question for "addition" exercise type
 * Format: "3 + 5 = __" (find the sum)
 */
function generateAdditionQuestion() {
    // Randomly choose num1 from 1 to MAX_SUM-1
    // This ensures we can always find a valid num2
    const num1 = Math.floor(Math.random() * (CONFIG.MAX_SUM - 1)) + 1;
    // Choose num2 from 1 to (MAX_SUM - num1) to ensure sum ≤ MAX_SUM
    const num2 = Math.floor(Math.random() * (CONFIG.MAX_SUM - num1)) + 1;
    const correctAnswer = num1 + num2;
    
    const options = generateUniqueOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${num1} + ${num2} = __`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'addition'
    };
}

/**
 * Generate a question for "subtraction" exercise type
 * Format: "8 - 3 = __" (find the difference)
 * Ensures num1 ≥ num2 (no negative results) and difference ≤ MAX_DIFFERENCE
 */
function generateSubtractionQuestion() {
    // Randomly choose result (difference) from 0 to MAX_DIFFERENCE
    const result = Math.floor(Math.random() * (CONFIG.MAX_DIFFERENCE + 1));
    // Randomly choose num2 from 1 to MAX_DIFFERENCE
    // This ensures we can calculate num1 = result + num2
    const num2 = Math.floor(Math.random() * CONFIG.MAX_DIFFERENCE) + 1;
    const num1 = result + num2;
    
    const correctAnswer = result;
    const options = generateUniqueOptions(correctAnswer, CONFIG.OPTIONS_COUNT);
    
    return {
        question: `${num1} - ${num2} = __`,
        correctAnswer: correctAnswer,
        options: options,
        type: 'subtraction'
    };
}

/**
 * Generate a question based on exercise type
 * @param {string} exerciseType - Type of exercise ('missing', 'before', 'after', 'greater', 'smaller', 'addition', 'subtraction')
 * @returns {Object} Question object with question, correctAnswer, options, and type
 */
function generateQuestion(exerciseType) {
    switch (exerciseType) {
        case 'missing':
            return generateMissingQuestion();
        case 'before':
            return generateBeforeQuestion();
        case 'after':
            return generateAfterQuestion();
        case 'greater':
            return generateGreaterQuestion();
        case 'smaller':
            return generateSmallerQuestion();
        case 'addition':
            return generateAdditionQuestion();
        case 'subtraction':
            return generateSubtractionQuestion();
        default:
            // Default to missing if type is invalid
            return generateMissingQuestion();
    }
}

