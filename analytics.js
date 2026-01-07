// Firebase Analytics helper module
// Centralized analytics tracking functions

let analyticsInstance = null;
let logEventFunction = null;

/**
 * Initialize Firebase Analytics
 * Must be called before using any tracking functions
 */
async function initAnalytics() {
    try {
        // Import Firebase modules
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js");
        const { getAnalytics, logEvent } = await import("https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js");
        
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyC-cIDWcUYhEB94ntRpKur0AAK3a0yStmk",
            authDomain: "kids-learning-app-2492d.firebaseapp.com",
            projectId: "kids-learning-app-2492d",
            storageBucket: "kids-learning-app-2492d.firebasestorage.app",
            messagingSenderId: "320829788478",
            appId: "1:320829788478:web:5ec192ab0b5846dc329c6f",
            measurementId: "G-0X2KW1YB9Z"
        };
        
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        analyticsInstance = getAnalytics(app);
        logEventFunction = logEvent;
        
        return analyticsInstance;
    } catch (error) {
        console.error('Error initializing Firebase Analytics:', error);
        return null;
    }
}

/**
 * Track a page view
 * @param {string} pageName - Name of the page (e.g., "Menu", "Exercise - missing")
 */
function trackPageView(pageName) {
    if (!analyticsInstance || !logEventFunction) {
        console.warn('Analytics not initialized');
        return;
    }
    
    try {
        logEventFunction(analyticsInstance, 'page_view', {
            page_name: pageName,
            page_path: window.location.pathname
        });
    } catch (error) {
        console.error('Error tracking page view:', error);
    }
}

/**
 * Track when user starts an exercise
 * @param {string} exerciseType - Type of exercise (missing, before, after, etc.)
 */
function trackExerciseStart(exerciseType) {
    if (!analyticsInstance || !logEventFunction) {
        console.warn('Analytics not initialized');
        return;
    }
    
    try {
        logEventFunction(analyticsInstance, 'exercise_start', {
            exercise_type: exerciseType
        });
    } catch (error) {
        console.error('Error tracking exercise start:', error);
    }
}

/**
 * Track answer submission
 * @param {string} exerciseType - Type of exercise
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {string|number} selectedAnswer - The answer the user selected
 */
function trackAnswer(exerciseType, isCorrect, selectedAnswer) {
    if (!analyticsInstance || !logEventFunction) {
        console.warn('Analytics not initialized');
        return;
    }
    
    try {
        logEventFunction(analyticsInstance, 'answer_submitted', {
            exercise_type: exerciseType,
            is_correct: isCorrect,
            selected_answer: String(selectedAnswer)
        });
    } catch (error) {
        console.error('Error tracking answer:', error);
    }
}

/**
 * Track worksheet download
 * @param {string} exerciseType - Type of exercise in the worksheet
 * @param {number} questionCount - Number of questions in the worksheet
 */
function trackWorksheetDownload(exerciseType, questionCount) {
    if (!analyticsInstance || !logEventFunction) {
        console.warn('Analytics not initialized');
        return;
    }
    
    try {
        logEventFunction(analyticsInstance, 'worksheet_downloaded', {
            exercise_type: exerciseType,
            question_count: questionCount
        });
    } catch (error) {
        console.error('Error tracking worksheet download:', error);
    }
}

/**
 * Track navigation events
 * @param {string} action - Navigation action (navigate_to_exercise, back_to_menu)
 * @param {string} from - Source page
 * @param {string} to - Destination page
 */
function trackNavigation(action, from, to) {
    if (!analyticsInstance || !logEventFunction) {
        console.warn('Analytics not initialized');
        return;
    }
    
    try {
        logEventFunction(analyticsInstance, 'navigation', {
            action: action,
            from: from,
            to: to
        });
    } catch (error) {
        console.error('Error tracking navigation:', error);
    }
}

// Make functions globally available
window.initAnalytics = initAnalytics;
window.trackPageView = trackPageView;
window.trackExerciseStart = trackExerciseStart;
window.trackAnswer = trackAnswer;
window.trackWorksheetDownload = trackWorksheetDownload;
window.trackNavigation = trackNavigation;

