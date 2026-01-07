// Worksheet generation and PDF creation module

/**
 * Generate questions for selected exercise type
 * @param {Array<string>} exerciseTypes - Array with single exercise type name
 * @param {number} questionCount - Total number of questions to generate
 * @returns {Object} Object containing questions array and answers array
 */
function generateWorksheet(exerciseTypes, questionCount) {
    if (!exerciseTypes || exerciseTypes.length === 0) {
        throw new Error('An exercise type must be selected');
    }
    
    if (questionCount < 5 || questionCount > 20) {
        throw new Error('Question count must be between 5 and 20');
    }
    
    const questions = [];
    const answers = [];
    const exerciseType = exerciseTypes[0]; // Single exercise type
    
    // Track generated questions to avoid duplicates
    const generatedQuestions = new Set();
    
    // Generate all questions for the selected type
    for (let i = 0; i < questionCount; i++) {
        let question;
        let attempts = 0;
        let questionKey;
        
        // Try to generate unique questions (up to 50 attempts)
        do {
            question = generateQuestion(exerciseType);
            questionKey = `${exerciseType}-${question.question}-${question.correctAnswer}`;
            attempts++;
        } while (generatedQuestions.has(questionKey) && attempts < 50);
        
        generatedQuestions.add(questionKey);
        
        // Format question for worksheet (remove options, show blank)
        const worksheetQuestion = formatQuestionForWorksheet(question);
        
        questions.push({
            number: questions.length + 1,
            text: worksheetQuestion,
            type: exerciseType
        });
        
        answers.push({
            number: answers.length + 1,
            question: worksheetQuestion,
            answer: question.correctAnswer,
            type: exerciseType
        });
    }
    
    return {
        questions: questions,
        answers: answers,
        exerciseTypes: exerciseTypes
    };
}

/**
 * Format a question for worksheet display (with blank space)
 * @param {Object} question - Question object from generateQuestion()
 * @returns {string} Formatted question string with blank
 */
function formatQuestionForWorksheet(question) {
    switch (question.type) {
        case 'missing':
            // "3 _ 5" -> "3 _____ 5"
            return question.question.replace('_', '_____');
        case 'before':
            // "___ 7" -> "_____ 7"
            return question.question.replace('___', '_____');
        case 'after':
            // "7 ___" -> "7 _____"
            return question.question.replace('___', '_____');
        case 'greater':
            // "12 ? 10" -> "12 _____ 10"
            return question.question.replace('?', '_____');
        case 'smaller':
            // "10 ? 12" -> "10 _____ 12"
            return question.question.replace('?', '_____');
        default:
            return question.question;
    }
}

/**
 * Get display name for exercise type
 * @param {string} type - Exercise type code
 * @returns {string} Display name
 */
function getExerciseDisplayName(type) {
    const exerciseNames = {
        'missing': 'Missing Number',
        'before': 'Before',
        'after': 'After',
        'greater': 'Greater',
        'smaller': 'Smaller'
    };
    return exerciseNames[type] || type;
}

/**
 * Create a PDF worksheet with questions (no answer key) - Single page, two-column format
 * @param {Object} worksheetData - Object with questions, answers arrays, and exerciseTypes
 */
function createPDF(worksheetData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    const columnGap = 10;
    const columnWidth = (contentWidth - columnGap) / 2;
    const leftColumnX = margin;
    const rightColumnX = margin + columnWidth + columnGap;
    
    let yPos = margin;
    
    // Header Section - Fixed alignment
    doc.setFontSize(22);
    doc.setTextColor(90, 103, 216); // #5a67d8
    doc.setFont('helvetica', 'bold');
    doc.text('Math Practice Worksheet', pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    // Exercise types and number range
    doc.setFontSize(11);
    doc.setTextColor(45, 55, 72); // #2d3748
    doc.setFont('helvetica', 'bold');
    
    // Get exercise type name
    const exerciseTypeName = getExerciseDisplayName(worksheetData.exerciseTypes[0]);
    
    // Get number range from CONFIG
    const numberRange = `Numbers ${CONFIG.NUMBER_RANGE_MIN}-${CONFIG.NUMBER_RANGE_MAX}`;
    
    // Display exercise type
    doc.text(`Exercise Type: ${exerciseTypeName}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    
    // Display number range
    doc.setFont('helvetica', 'normal');
    doc.text(numberRange, pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;
    
    // Instructions
    doc.setFontSize(10);
    doc.setTextColor(45, 55, 72); // #2d3748
    doc.text('Fill in the blanks with the correct answers.', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;
    
    // Name and Date line - properly aligned
    doc.setFontSize(9);
    doc.setTextColor(113, 128, 150); // #718096
    const nameLine = 'Name: ___________________________';
    const dateLine = 'Date: ___________________________';
    doc.text(nameLine, leftColumnX, yPos);
    doc.text(dateLine, rightColumnX, yPos);
    yPos += 8;
    
    // Divider line
    doc.setDrawColor(226, 232, 240); // #e2e8f0
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    // Questions Section - Two-column format
    const questionSpacing = 7;
    const lineHeight = 6;
    const maxY = pageHeight - 15; // Leave some space at bottom
    let leftColumnY = yPos;
    let rightColumnY = yPos;
    
    worksheetData.questions.forEach((item, index) => {
        // Split questions evenly between columns
        const useLeftColumn = index < Math.ceil(worksheetData.questions.length / 2);
        let currentX = useLeftColumn ? leftColumnX : rightColumnX;
        let currentY = useLeftColumn ? leftColumnY : rightColumnY;
        
        // If left column is getting too full, switch to right column
        if (useLeftColumn && currentY > maxY - 20 && rightColumnY < currentY) {
            currentX = rightColumnX;
            currentY = rightColumnY;
        }
        
        // Question number and text
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(90, 103, 216);
        doc.text(`${item.number}.`, currentX, currentY);
        
        // Question text
        const questionX = currentX + 8;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(45, 55, 72);
        
        // Split question if needed
        const questionWidth = columnWidth - 10;
        const questionLines = doc.splitTextToSize(item.text, questionWidth);
        
        questionLines.forEach((line, lineIndex) => {
            doc.text(line, questionX, currentY + (lineIndex * lineHeight));
        });
        
        // Update Y position for the column used
        const questionHeight = Math.max(8, questionLines.length * lineHeight);
        if (currentX === leftColumnX) {
            leftColumnY = currentY + questionHeight + questionSpacing;
        } else {
            rightColumnY = currentY + questionHeight + questionSpacing;
        }
    });
    
    // Save the PDF
    const fileName = `worksheet_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
}

