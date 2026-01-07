// Simple page state handling and navigation

/**
 * Get URL parameter by name
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Navigate to exercise page with selected type
 * @param {string} exerciseType - Type of exercise to start
 */
function navigateToExercise(exerciseType) {
    // Track exercise start and navigation
    if (typeof trackExerciseStart === 'function') {
        trackExerciseStart(exerciseType);
    }
    if (typeof trackNavigation === 'function') {
        trackNavigation('navigate_to_exercise', 'Menu', `Exercise - ${exerciseType}`);
    }
    window.location.href = `exercise.html?type=${exerciseType}`;
}

/**
 * Navigate back to menu
 */
function navigateToMenu() {
    // Track navigation back to menu
    const exerciseType = getCurrentExerciseType();
    if (typeof trackNavigation === 'function') {
        trackNavigation('back_to_menu', `Exercise - ${exerciseType || 'unknown'}`, 'Menu');
    }
    window.location.href = 'index.html';
}

/**
 * Get current exercise type from URL
 * @returns {string|null} Exercise type or null
 */
function getCurrentExerciseType() {
    return getURLParameter('type');
}

