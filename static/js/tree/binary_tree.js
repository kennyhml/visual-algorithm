
import { TreeNode } from "./tree_node.js";

const scaleFactor = 0.075;

/**
 * Represents a binary tree on the canvas.
 * 
 * It provides functionalities to create and manipulate a binary tree 
 * structure on the canvas. Allowing to insert, delete or manipulate nodes
 * at selected locations on the canvas.
 * 
 * Furthermore, it provides the required tools to calculate the positions
 * of the nodes on the canvas such as the maximum width and height of the 
 * tree.
 * 
 * @class BinaryTree
 */
export class BinaryTree {
    /**
     * Creates a binary tree from an optional root node.
     * 
     * If no root node is given, the first inserted node will be
     * the root node.
     * @param {TreeNode} root - The root node of the binary tree 
     * @param {HTMLCanvasElement} canvas - The canvas we are drawing on
     * @param {CanvasRenderingContext2D} context - The context object to draw with
     */
    constructor(canvas, context, root = null) {
        this.canvas = canvas;
        this.context = context;
        this.root = root;
        this.selectedNode = root;
        this.radius = 0;
        this.canvas.onclick = this.updateSelectedNode.bind(this);

    };
    /**
     * Inserts a new node into the binary tree at the selected node,
     * either left or right.
     * @param {any} value - The value of the node to insert. 
     * @param {string} side - The side to insert on, either 'left' or 'right'.
     */
    insert(value, side) {
        const newNode = new TreeNode(value);

        if (!this.root) {
            this.root = newNode;
        } else if (side == "left") {
            this.selectedNode.left = newNode;
        } else if (side == "right") {
            this.selectedNode.right = newNode;
        } else {
            throw TypeError(`Invalid insertion side. Expected 'left' or 'right', got ${side}.`);
        };
        this.selectedNode = newNode;
    };
    /**
     * Calculates the radius of each node based on the size of the canvas
     * and the size of the binary tree.
     */
    calculateNodeRadius() {
        const widthFactor = this.canvas.width / this.width;
        const heightFactor = this.canvas.height / this.height;

        this.radius = Math.min(widthFactor, heightFactor) * scaleFactor;
    };
    /**
     * @return {number} The maximum width of the binary tree at any level.
     */
    get width() {
        const levels = this.toArray();
        const maxWidth = Math.max(...levels.map(nodes => nodes.length));
        return maxWidth;
    };
    /**
     * @return {number} The maximum height of the binary tree.
     */
    get height() {
        let maxHeight = 0;

        function dfs(node, currentHeight) {
            if (!node) { return; };

            currentHeight++;
            maxHeight = Math.max(maxHeight, currentHeight)
            dfs(node.left, currentHeight);
            dfs(node.right, currentHeight);
        };

        dfs(this.root, maxHeight);
        return maxHeight;
    };
    /**
     * Represents the tree as a  level order traversal where `level[i]` is the 
     * `i`'th level from the root and `level[i][j]` the `j`'th node from the left.
     * @returns {Array} - The level order traversal array.
     */
    toArray() {
        const levels = [];
        let level = [this.root];

        while (this.root && level.length > 0) {
            let nextLevel = [];
            level.forEach(node => {
                if (node !== null) {
                    node.depth = levels.length;
                    nextLevel.push(node.left);
                    nextLevel.push(node.right);
                } else {
                    nextLevel.push(null);
                    nextLevel.push(null);
                };
            });

            if (level.some(node => node !== null)) {
                levels.push(level);
                level = nextLevel;
            } else {
                level.length = 0;
            }

        };
        return levels;
    };
    /**
     * Callback for a mouse click event on the canvas to check whether
     * a new node was selected or the current one is deselected.
     * The currently selected node is highlighted in red. When the selected
     * node changes, the entire tree is redrawn with the new node highlighted.
     * 
     * What node was selected is determined by checking the distance to the event
     * from each node, if the distance is within the radius then we found the selected
     * node.
     * 
     * @param {PointerEvent} clickEvent - The click event on the canvas.
     */
    updateSelectedNode(clickEvent) {
        const radius = this.radius

        function search(node) {
            if (node === null) return null;

            const p1 = clickEvent.offsetX - node.x
            const p2 = clickEvent.offsetY - node.y
            const dist = Math.sqrt((p1 ** 2) + (p2 ** 2));
            if (dist <= radius) return node;

            return search(node.left) || search(node.right);
        };

        // Store the previous node so we can see whether the current node changed
        const previousNode = this.selectedNode;
        const node = this.selectedNode = search(this.root);
        console.log(`Selected node: ${node === null ? null : node.value}`)

        if (previousNode !== this.selectedNode) {
            this.draw();
            this.onSelectedNodeChanged(
                node, this.root === node ? "Yes" : "No", node === null ? "-" : node.depth
            );
        };

    };

    onSelectedNodeChanged(node, root, depth) {
        console.warn("nodeChangedCallback not defined.");
    };


    /**
     * Initiates a full redraw of the binary tree on the canvas.
     */
    draw() {
        if (!this.root) return;
        // We are fully redrawing the tree, not redrawing modifications
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // Node radius is based on the canvas' size and the trees' width/height .
        this.calculateNodeRadius();
        console.log(`Calculated circle for radius: ${this.radius}`);
        this.drawNodes();
    };
    /**
     * Draws a node on the canvas. The nodes' position must be set beforehand.
     * @param {TreeNode} node - The tree node to draw on the canvas.
     */
    drawNode(node) {
        // Make the selected node red, otherwise black
        const color = node === this.selectedNode ? "red" : "black";

        this.context.strokeStyle = color;
        // The arc forms the circle of the node at it's position
        this.context.beginPath();
        this.context.arc(node.x, node.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();

        // We scale the text size based on the nodes radius
        const text = node.value.toString();
        const fontSize = 9 * (this.radius / 10);

        this.context.font = `${fontSize}px Arial`;
        this.context.fillStyle = color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';

        this.context.fillText(text, node.x, node.y);
    };
    /**
     * Draws the lines from a node to each existing child, but only for the given node.
     * @param {TreeNode} node - The node to connect to it's children
     */
    connectNode(node) {
        for (let child of [node.left, node.right]) {
            if (child === null) continue;

            // Using the angle to the child and the x/y offset we can compute
            // where to start and stop the line such that it doesnt cross the arc.
            const angleToChild = Math.atan2(child.y - node.y, child.x - node.x);
            const xOffset = Math.cos(angleToChild) * this.radius;
            const yOffset = Math.sin(angleToChild) * this.radius;

            this.context.beginPath();
            this.context.strokeStyle = "black";
            this.context.moveTo(node.x + xOffset, node.y + yOffset);
            this.context.lineTo(child.x - xOffset, child.y - yOffset);
            this.context.stroke();
        };
    };
    /**
     * Computes the spacing parameters needed to draw the tree, which include.
     * - The starting x and y coordinate (on the lowest level)
     * - The amount of horizontal spacing between each node (radius excluded)
     * - The amount of vertical spacing between each node (radius excluded)
     * 
     * Takes even and uneven levels into the equation for the horizontal spacing.
     * 
     * @param {Array} levels - The reverse level order traversal of the tree.
     * @returns {Object} - An object literal containing the needed parameters. 
     */
    computeSpacings(levels) {
        // Remember that in our level traversal, we include the null nodes
        // where a node could have been, meaning our bottom most level
        // will be have the max width of the tree already.
        const levelWidth = levels[0].length;
        const treeHeight = this.height;

        // Spacing between nodes is based on the size of the tree
        // and size of the canvas
        const center = this.canvas.width / 2;
        const spacing = {
            horizontal: this.canvas.width / levelWidth,
            vertical: this.canvas.height / treeHeight
        };

        // We must make sure that the center of the row is at the center of the canvas,
        // taking uneven and even levels into consideration.
        let factor = Math.floor(levelWidth / 2);
        if (levelWidth % 2 === 0) factor -= 0.5;

        const startY = this.radius + 10 + (spacing.vertical * (treeHeight - 1));
        const startX = center - (treeHeight > 1 ? spacing.horizontal * factor : 0);

        return {
            startX, startY, ...spacing
        };
    };
    /**
     * Draws all nodes of the tree starting at the bottom to space the nodes
     * correctly, then moves up to the above layers where each nodes position
     * is the average of it's child positions.
     */
    drawNodes() {
        // We want to build bottom-up (reversed) to avoid node overlapping
        const levels = this.toArray().reverse();
        console.log('Levels to draw:', levels);

        const spacings = this.computeSpacings(levels);
        const nodePositions = [];

        for (const [i, level] of levels.entries()) {
            const y = spacings.startY - (spacings.vertical * i);
            // For the bottom most level we compute the position based on spacing
            // For the above levels, we center it between it's children
            const newPositions = level.map((node, j) => {
                const prevLevel = nodePositions.at(-1);
                const x = i === 0 ?
                    spacings.startX + (spacings.horizontal * j) :
                    (prevLevel[j * 2].x + prevLevel[(j * 2) + 1].x) / 2;
                // Draw the node if it exists. Note that we store node positions
                // regardless as we might later need them to compute a parent.
                if (node !== null) {
                    node.setPos(x, y);
                    this.drawNode(node);
                    this.connectNode(node);
                };
                return { x, y };
            });
            nodePositions.push(newPositions);
        };
    };
};
