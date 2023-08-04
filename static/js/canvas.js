var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 320;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")


var toolSection = document.getElementById("tools")
var selectedNodeSection = document.getElementById("selected-node")



import { BinaryTree } from "./tree/binary_tree.js"
import { TreeNode } from "./tree/tree_node.js"


let count = 0;

function generateRandomBinaryTree(depth) {
    if (depth <= 0) {
        return null;
    }

    const node = new TreeNode(count++);
    if (Math.random() > endProbability) {
        node.left = generateRandomBinaryTree(depth - 1);
    }
    if (Math.random() > endProbability) {
        node.right = generateRandomBinaryTree(depth - 1);
    }
    return node;
}


const nodeValueField = document.getElementById("node-value");
const nodeLeftField = document.getElementById("node-left-child")
const nodeRightField = document.getElementById("node-right-child")

const nodeDepthField = document.getElementById("node-depth")
const nodeIsLeafField = document.getElementById("node-leaf-node")
const nodeIsRootField = document.getElementById("node-root-node")


function updateSelectedNodeFields(node, root, depth) {
    console.log(node)
    const args = {
        value: node === null ? "-" : node.value,
        left: node === null ? "-" : node.left === null ? "null" : node.left.value,
        right: node === null ? "-" : node.right === null ? "null" : node.right.value,
        leaf: node === null ? '-' : node.isLeafNode ? "Yes" : "No",
        depth,
        root: node === null ? "-" : root
    };

    console.log(args)
    nodeValueField.value = args.value;
    nodeLeftField.value = args.left;
    nodeRightField.value = args.right;
    nodeDepthField.value = args.depth;
    nodeIsLeafField.value = args.leaf;
    nodeIsRootField.value = args.root;

}





const endProbability = 0.25;
const randomDepth = 3;
var rootNode = generateRandomBinaryTree(randomDepth);


const tree = new BinaryTree(canvas, context, rootNode);


tree.onSelectedNodeChanged = updateSelectedNodeFields



tree.draw()




