/**
 * D3.js Tree Visualization module
 */

class TreeVisualizer {
    constructor(containerId, onNodeSelect) {
        this.container = document.getElementById(containerId);
        this.onNodeSelect = onNodeSelect;
        this.margin = { top: 40, right: 150, bottom: 40, left: 80 };
        this.nodeRadius = 6;
        this.currentTransform = d3.zoomIdentity;
        this.selectedNode = null;

        this.initSvg();
        this.addLegend();
    }

    initSvg() {
        // Clear any existing content
        this.container.innerHTML = '';

        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;

        // Create zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on('zoom', (event) => {
                this.currentTransform = event.transform;
                this.g.attr('transform', event.transform);
            });

        // Create SVG
        this.svg = d3.select(this.container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .call(this.zoom);

        // Create main group for transformations
        this.g = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        // Create tooltip
        this.tooltip = d3.select(this.container)
            .append('div')
            .attr('class', 'tree-tooltip')
            .style('opacity', 0)
            .style('display', 'none');
    }

    addLegend() {
        const legend = document.createElement('div');
        legend.className = 'tree-legend';
        legend.innerHTML = `
            <div class="legend-item">
                <span class="legend-dot syntax"></span>
                <span>Syntax Node</span>
            </div>
            <div class="legend-item">
                <span class="legend-dot token"></span>
                <span>Token (Leaf)</span>
            </div>
        `;
        this.container.appendChild(legend);
    }

    render(data) {
        // Clear previous tree
        this.g.selectAll('*').remove();

        if (!data || !data.tree) {
            this.showPlaceholder('No parse tree to display');
            return;
        }

        // Remove placeholder
        const placeholder = this.container.querySelector('.placeholder-message');
        if (placeholder) placeholder.remove();

        // Create hierarchy
        const root = d3.hierarchy(data.tree, d => d.children);

        // Calculate tree dimensions based on node count
        const nodeCount = root.descendants().length;
        const treeHeight = Math.max(this.height - this.margin.top - this.margin.bottom, nodeCount * 25);
        const treeWidth = Math.max(this.width - this.margin.left - this.margin.right, root.height * 180);

        // Create tree layout
        const treeLayout = d3.tree()
            .size([treeHeight, treeWidth]);

        treeLayout(root);

        // Draw links
        const links = this.g.selectAll('.link')
            .data(root.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        // Draw nodes
        const nodes = this.g.selectAll('.node')
            .data(root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`)
            .on('click', (event, d) => {
                event.stopPropagation();
                this.selectNode(event.currentTarget, d);
            })
            .on('mouseover', (event, d) => this.showTooltip(event, d))
            .on('mouseout', () => this.hideTooltip());

        // Node circles
        nodes.append('circle')
            .attr('r', this.nodeRadius)
            .attr('class', d => d.data.isToken ? 'token' : '');

        // Node labels (type name)
        nodes.append('text')
            .attr('class', 'type-label')
            .attr('dy', -10)
            .attr('x', 0)
            .text(d => this.abbreviateType(d.data.type));

        // Token text (for leaf nodes)
        nodes.filter(d => d.data.isToken && d.data.text)
            .append('text')
            .attr('class', 'token-text')
            .attr('dy', 20)
            .attr('x', 0)
            .text(d => this.truncateText(d.data.text, 15));

        // Center the tree initially
        this.centerTree(root);
    }

    selectNode(element, d) {
        // Remove previous selection
        this.g.selectAll('.node').classed('selected', false);
        this.g.selectAll('.link').classed('highlighted', false);

        // Add selection to clicked node
        d3.select(element).classed('selected', true);

        // Highlight path to root
        let current = d;
        while (current.parent) {
            const link = this.g.selectAll('.link')
                .filter(l => l.target === current);
            link.classed('highlighted', true);
            current = current.parent;
        }

        this.selectedNode = d;
        if (this.onNodeSelect) {
            this.onNodeSelect(d.data);
        }
    }

    showTooltip(event, d) {
        const content = `
            <div class="tooltip-type">${d.data.type}</div>
            ${d.data.text ? `<div class="tooltip-text">"${this.escapeHtml(d.data.text)}"</div>` : ''}
        `;

        this.tooltip
            .html(content)
            .style('display', 'block')
            .style('opacity', 1)
            .style('left', (event.offsetX + 15) + 'px')
            .style('top', (event.offsetY - 10) + 'px');
    }

    hideTooltip() {
        this.tooltip
            .style('opacity', 0)
            .style('display', 'none');
    }

    abbreviateType(type) {
        // Remove "Syntax" suffix for cleaner display
        return type.replace(/Syntax$/, '');
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        const cleaned = text.replace(/\n/g, '\\n');
        if (cleaned.length <= maxLength) return `"${cleaned}"`;
        return `"${cleaned.substring(0, maxLength)}..."`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    centerTree(root) {
        // Calculate bounds
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        root.each(d => {
            if (d.x < minX) minX = d.x;
            if (d.x > maxX) maxX = d.x;
            if (d.y < minY) minY = d.y;
            if (d.y > maxY) maxY = d.y;
        });

        // Calculate scale to fit
        const treeWidth = maxY - minY + this.margin.left + this.margin.right;
        const treeHeight = maxX - minX + this.margin.top + this.margin.bottom;

        const scaleX = this.width / treeWidth;
        const scaleY = this.height / treeHeight;
        const scale = Math.min(scaleX, scaleY, 1) * 0.9;

        // Calculate translation to center
        const translateX = (this.width - treeWidth * scale) / 2 + this.margin.left;
        const translateY = (this.height - treeHeight * scale) / 2 - minX * scale + this.margin.top;

        // Apply transform
        const transform = d3.zoomIdentity
            .translate(translateX, translateY)
            .scale(scale);

        this.svg.transition()
            .duration(500)
            .call(this.zoom.transform, transform);
    }

    showPlaceholder(message) {
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-message';
        placeholder.innerHTML = `<p>${message}</p>`;
        this.container.appendChild(placeholder);
    }

    zoomIn() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        this.svg.transition()
            .duration(300)
            .call(this.zoom.scaleBy, 0.7);
    }

    resetView() {
        this.svg.transition()
            .duration(500)
            .call(this.zoom.transform, d3.zoomIdentity.translate(this.margin.left, this.margin.top));
    }
}
