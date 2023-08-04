
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
    constructor(value, x = 0, y = 0, left = null, right = null, depth = 0) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.left = left;
        this.right = right;
        this.depth = depth;
    };
    /**
     * A node is a leaf node if it has no left or right child.
     * @returns {boolean} Whether the node is a leaf node.
     */
    get isLeafNode() {
        return !this.left && !this.right;
    };

    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

};


