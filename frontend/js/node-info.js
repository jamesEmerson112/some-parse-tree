/**
 * Node information display module
 */

/**
 * Display information about a selected node
 * @param {Object|null} node - The selected node data
 */
function displayNodeInfo(node) {
    const container = document.getElementById('nodeInfo');

    if (!node) {
        container.innerHTML = '<p class="placeholder">Click a node to see details</p>';
        return;
    }

    const locationStr = node.range
        ? `Line ${node.range.startLine}:${node.range.startColumn} - ${node.range.endLine}:${node.range.endColumn}`
        : 'Unknown';

    const childCount = node.children ? node.children.length : 0;

    container.innerHTML = `
        <div class="info-item">
            <label>Node Type</label>
            <span class="value type">${escapeHtml(node.type)}</span>
        </div>

        ${node.text ? `
        <div class="info-item">
            <label>Text Content</label>
            <span class="value text">"${escapeHtml(node.text)}"</span>
        </div>
        ` : ''}

        <div class="info-item">
            <label>Location</label>
            <span class="value">${locationStr}</span>
        </div>

        <div class="info-item">
            <label>Children</label>
            <span class="value">${childCount} node${childCount !== 1 ? 's' : ''}</span>
        </div>

        <div class="info-item">
            <label>Node Category</label>
            <span class="value ${node.isToken ? 'token' : 'type'}">${node.isToken ? 'Token (Leaf)' : 'Syntax Node'}</span>
        </div>

        ${node.children && node.children.length > 0 ? `
        <div class="info-item">
            <label>Child Types</label>
            <span class="value">${node.children.map(c => abbreviateType(c.type)).join(', ')}</span>
        </div>
        ` : ''}
    `;
}

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Abbreviate type name by removing "Syntax" suffix
 * @param {string} type - Full type name
 * @returns {string} - Abbreviated type name
 */
function abbreviateType(type) {
    return type.replace(/Syntax$/, '');
}
