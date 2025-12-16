/**
 * Main application entry point
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize editor
    const editor = initEditor('codeEditor');

    // Initialize tree visualizer
    const visualizer = new TreeVisualizer('treeContainer', displayNodeInfo);

    // Get UI elements
    const parseBtn = document.getElementById('parseBtn');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetViewBtn = document.getElementById('resetView');
    const errorToast = document.getElementById('errorToast');
    const toastMessage = errorToast.querySelector('.toast-message');
    const toastClose = errorToast.querySelector('.toast-close');

    /**
     * Show error toast notification
     * @param {string} message - Error message to display
     */
    function showError(message) {
        toastMessage.textContent = message;
        errorToast.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorToast.classList.add('hidden');
        }, 5000);
    }

    /**
     * Hide error toast
     */
    function hideError() {
        errorToast.classList.add('hidden');
    }

    /**
     * Set loading state on parse button
     * @param {boolean} loading - Whether loading is active
     */
    function setLoading(loading) {
        parseBtn.disabled = loading;
        parseBtn.classList.toggle('loading', loading);
    }

    /**
     * Parse the current code and render the tree
     */
    async function parseAndRender() {
        const code = editor.getValue().trim();

        if (!code) {
            showError('Please enter some Swift code to parse');
            return;
        }

        setLoading(true);
        hideError();

        try {
            const result = await parseSwiftCode(code);

            if (result.errors && result.errors.length > 0) {
                console.warn('Parse errors:', result.errors);
                const errorMessages = result.errors.map(e =>
                    `Line ${e.line}: ${e.message}`
                ).join('\n');
                showError(`Parse warnings: ${errorMessages}`);
            }

            visualizer.render(result);

            // Clear node info
            displayNodeInfo(null);

        } catch (error) {
            console.error('Failed to parse:', error);
            showError(`Failed to parse code: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    // Event listeners
    parseBtn.addEventListener('click', parseAndRender);

    // Keyboard shortcut: Cmd/Ctrl + Enter to parse
    editor.setOption('extraKeys', {
        'Cmd-Enter': parseAndRender,
        'Ctrl-Enter': parseAndRender,
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', () => visualizer.zoomIn());
    zoomOutBtn.addEventListener('click', () => visualizer.zoomOut());
    resetViewBtn.addEventListener('click', () => visualizer.resetView());

    // Toast close button
    toastClose.addEventListener('click', hideError);

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            visualizer.initSvg();
            visualizer.addLegend();
        }, 250);
    });

    // Log ready message
    console.log('Swift Parse Tree Visualizer loaded!');
    console.log('Enter Swift code and click "Parse Code" or press Ctrl/Cmd + Enter');
});
