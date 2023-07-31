
import { TreeNode } from "./tree_node.js";

const scaleFactor = 0.075;
const padding = 50;

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
 * @class
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
                if (node.left) {
                    nextLevel.push(node.left);
                }
                if (node.right) {
                    nextLevel.push(node.right);
                };
            })
            levels.push(level);
            level = nextLevel;

        };
        return levels;
    };
    /**
     * Initiates a full redraw of the binary tree on the canvas.
     */
    draw() {
        if (!this.root) {
            console.log("Tree was not drawn as it has no nodes.");
            return;
        };
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
        console.log(`Drawing node ${node.value} at ${node.x} ${node.y}`);

        // Draw the circle where with our computed radious around the nodes' position
        this.context.beginPath();
        this.context.arc(node.x, node.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();

        // TODO: Scale the size of the text with the node size
        const text = node.value.toString();
        const metrics = this.context.measureText(node.value.toString());
        this.context.font = '18px Arial';
        this.context.fillStyle = 'black';

        // To center the text value we put the center of the text at the center of the node.
        this.context.fillText(text, node.x - (metrics.width / 2), node.y + 5);
    };
    /**
     * Draws the lines from a node to each existing child, but only for the given node.
     * @param {TreeNode} node - The node to connect to it's children
     */
    connectNode(node) {
        console.log(`Connecting node ${node.value} to it's children.`)

        for (let child of [node.left, node.right]) {
            if (child == null) { return; };

            // Using the angle to the child and the x/y offset we can compute
            // where to start and stop the line such that it doesnt cross the arc.
            const angleToChild = Math.atan2(child.y - node.y, child.x - node.x);
            const xOffset = Math.cos(angleToChild) * this.radius;
            const yOffset = Math.sin(angleToChild) * this.radius;
            
            this.context.beginPath();
            this.context.moveTo(node.x + xOffset, node.y + yOffset);
            this.context.lineTo(child.x - xOffset, child.y - yOffset);
            this.context.stroke();
        };
    };
    /**
     * Draws all nodes of the tree starting at the bottom to space the nodes
     * correctly, then moves up to the above layers where each nodes position
     * is the average of it's child positions.
     */
    drawNodes() {
        // We want to build bottom-up (reversed) to avoid node overlapping
        const levels = this.toArray();
        levels.reverse();
        console.log("Levels to draw:", levels);

        const nodes = levels[0].length;
        console.log(`Constructing lowermost level with ${nodes} nodes..`);

        // Compute the spacings and centers so we can space the nodes properly
        const center = (this.canvas.width) / 2;
        const horizontalSpacing = (this.canvas.width - padding * 2) / nodes;
        const verticalSpacing = (this.canvas.height - padding * 2) / this.height;

        console.log(`Horizontal space: ${horizontalSpacing}, vertical space: ${verticalSpacing}.`);

        // We know how much space we need per level (verticalSpacing), and we know
        // how many levels we have, so we can calculate the y-position of the final level that way
        const startY = (verticalSpacing * levels.length) + padding;
        // We know that the middle node of our bottom most level must be at the center
        const startX = center - (horizontalSpacing * (nodes / 2));

        for (let i = 0; i < levels.length; i++) {
            let y = startY - verticalSpacing * i;
            for (let j = 0; j < levels[i].length; j++) {
                let node = levels[i][j];
                // Drawing our initial bottom line
                if (i == 0) {
                    let x = startX + horizontalSpacing * j;
                    node.setPos(x, y);
                    this.drawNode(node);
                } else {
                    // Compute position based on children we just placed
                    // TODO: Handle the case where it has no children or only 1 child
                    let x = (node.left.x + node.right.x) / 2;
                    node.setPos(x, y);
                    this.drawNode(node);
                    this.connectNode(node);
                };
            };
        };
    };
};
