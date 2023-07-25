
import { TreeNode } from "./tree_node.js";
export { BinaryTree }


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
 * @class
 */
class BinaryTree {
    /**
     * Creates a binary tree from an optional root node.
     * 
     * If no root node is given, the first inserted node will be
     * the root node.
     * @param {TreeNode} root - The root node of the binary tree 
     */
    constructor(root = null) {
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

    calculateRadius(canvas) {
        var factorWidth = (canvas.width - canvas.offsetLeft) / this.width;
        var factorHeight = canvas.height / this.height;
        this.radius = Math.min(factorWidth, factorHeight) * scaleFactor;
    };
    /**
     * @return {number} The maximum width of the binary tree at any level.
     */
    get width() {
        var level = [this.root];
        var maxWidth = 0

        while (this.root && level.length > 0) {
            maxWidth = Math.max(maxWidth, level.length);
            let nextLevel = [];

            level.forEach(node => {
                if (node.left) {
                    nextLevel.push(node.left);
                }
                if (node.right) {
                    nextLevel.push(node.right);
                };
            });
            level = nextLevel;
        };
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

    draw(canvas, context) {
        if (!this.root) { return; };
        this.calculateRadius(canvas);
        this.drawNode(this.root, context)
        this.drawChildren(this.root, context);
    }

    calculateChildPosition(node, side) {
        
        if (!["left", "right"].includes(side)) {
            throw TypeError(`Unknown child '${side}'.`)
        }

        var x = node.x + (side == 'right' ? 50 : -50)
        var y = node.y + 50

        return [x, y];
    };

    drawNode(node, context) {
        console.log(`Drawing ${node.x} ${node.y}`)
        context.beginPath();
        context.arc(node.x, node.y, this.radius, 0, Math.PI * 2);
        context.stroke();

    }
    drawChildren(node, context) {
        if (node.left) {
            node.left.setPos(...this.calculateChildPosition(node, "left"));
            this.drawNode(node.left, context);
            this.drawChildren(node.left, context);
        };

        if (node.right) {
            node.right.setPos(...this.calculateChildPosition(node, "right"));
            this.drawNode(node.right, context);
            this.drawChildren(node.right, context);
        };

    }
};
