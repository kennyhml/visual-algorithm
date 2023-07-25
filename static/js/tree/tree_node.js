
/**
 * Represents a single node in a binary tree.
 * @class
 */
export class TreeNode {
    /**
     * @param {any} value - The value of the node.
     * @param {int} x - The x coordinate of the tree node
     * @param {int} y - The y coordinate of the tree node
     * @param {TreeNode} left - [Optional] Left child node.
     * @param {TreeNode} right - [Optional] Right child node.
     */
    constructor(value, x, y, left=null, right=null) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.left = left;
        this.right = right;
    };
    /**
     * A node is a leaf node if it has no left or right child.
     * @returns {boolean} Whether the node is a leaf node.
     */
    get isLeafNode() {
        return !this.left && !this.right;
    };
    /**
     * The position of the tree node on a canvas
     * @return {Map} The x and y position of the node
     */
    get position() {
        return {x: this.x, y: this.y};
    };

};


