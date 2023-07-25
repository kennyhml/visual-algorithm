
/**
 * Represents a single node in a binary tree.
 * @class
 */
export class TreeNode {
    /**
     * @param {any} value - The value of the node.
     * @param {TreeNode} left - [Optional] Left child node.
     * @param {TreeNode} right - [Optional] Right child node.
     */
    constructor(value, left=null, right=null) {
        this.value = value;
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

};


