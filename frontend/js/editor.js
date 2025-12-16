/**
 * CodeMirror editor setup module
 */

/**
 * Initialize the CodeMirror editor
 * @param {string} elementId - The ID of the textarea element
 * @returns {CodeMirror} - The CodeMirror editor instance
 */
function initEditor(elementId) {
    const textarea = document.getElementById(elementId);

    const editor = CodeMirror.fromTextArea(textarea, {
        mode: 'swift',
        theme: 'dracula',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        lineWrapping: true,
        autofocus: true,
        matchBrackets: true,
        autoCloseBrackets: true,
    });

    // Set default example code to help beginners
    editor.setValue(`// Try some simple Swift code!
let greeting = "Hello, World!"
let sum = 1 + 2 * 3

if sum > 5 {
    print(greeting)
} else {
    print("Sum is small")
}

// Try adding a function:
func add(_ a: Int, _ b: Int) -> Int {
    return a + b
}
`);

    return editor;
}
