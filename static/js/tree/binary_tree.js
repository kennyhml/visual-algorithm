
import { TreeNode } from "./tree_node.js";
export { BinaryTree }


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
class BinaryTree {
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
        newNode = new TreeNode(value);

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
        let widthFactor = this.canvas.width / this.width
        let heightFactor = this.canvas.height / this.height

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
        var maxHeight = 0;

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
     * Returns a level order traversal of the binary tree as array.
     * @returns {Array} - The levels of the tree where each level contains its nodes.
     */
    toArray() {
        var levels = [];
        var level = [this.root];

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
            levels.push(level)
            level = nextLevel;

        };
        return levels;
    };

    draw() {
        if (!this.root) {
            console.log("Tree was not drawn as it has no nodes.")
            return;
        };

        // Calculate the node radius based on the canvas size and the
        // max width or height of the binary tree.
        this.calculateNodeRadius();
        console.log(`Calculated circle for radius: ${this.radius}`);

        // Reverse the array representation of the tree to start building it
        // bottom - up.
        var levels = this.toArray();
        levels.reverse()
        console.log("Levels:", levels)

        this.drawNodes(levels);
    };
    /**
     * Draws a singular node on the canvas, granted the nodes position
     * has been set beforehand.
     * @param {TreeNode} node - The node to draw on the canvas.
     */
    drawNode(node) {
        console.log(`Drawing node ${node.value} at ${node.x} ${node.y}`)
        this.context.beginPath();
        this.context.arc(node.x, node.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();

        var text = node.value.toString();
        var metrics = this.context.measureText(node.value.toString());

        this.context.font = '18px Arial';
        this.context.fillStyle = 'black';

        this.context.fillText(text, node.x - (metrics.width / 2), node.y + 5);
    };
    connectNode(node) {
        console.log(`Connecting node ${node.value} to it's children.`)
        for (let child of [node.left, node.right]) {
            if (child == null) { return; }

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
     * Draws the nodes of the binary tree, starting from the bottom most level
     * to avoid node collisions.
     * @param {Array} levels - The levels of the binary tree in reverse
     */
    drawNodes(levels) {
        let nodes = levels[0].length;
        console.log(`Constructing lowermost level with ${nodes} nodes..`);


        // Compute the spacings and centers so we can space the nodes properly
        var center = (this.canvas.width) / 2;
        var horizontalSpacing = (this.canvas.width - padding * 2) / nodes;
        var verticalSpacing = (this.canvas.height - padding * 2) / this.height;

        console.log(`Horizontal space: ${horizontalSpacing}, vertical space: ${verticalSpacing}.`);

        // We know how much space we need per level (verticalSpacing), and we know
        // how many levels we have, so we can calculate the y-position of the final level that way
        var startY = (verticalSpacing * levels.length) + padding;
        // We know that the middle node of our bottom most level must be at the center
        var startX = center - (horizontalSpacing * (nodes / 2));

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
                    let x = (node.left.x + node.right.x) / 2;
                    node.setPos(x, y);
                    this.drawNode(node);
                    this.connectNode(node);
                };
            };
        };
    };
};
