/**
 * API communication module for the Swift Parse Tree Visualizer
 */

const API_BASE = '/api';

/**
 * Parse Swift code and return the syntax tree
 * @param {string} code - The Swift code to parse
 * @returns {Promise<Object>} - The parse response containing the tree
 */
async function parseSwiftCode(code) {
    const response = await fetch(`${API_BASE}/parse`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Parse failed: ${response.status} - ${errorText}`);
    }

    return response.json();
}
