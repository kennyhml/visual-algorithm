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
    const args = {
        value: node === null ? "-" : node.value,
        left: node === null ? "-" : node.left === null ? "null" : node.left.value,
        right: node === null ? "-" : node.right === null ? "null" : node.right.value,
        leaf: node === null ? '-' : node.isLeafNode ? "Yes" : "No",
        depth,
        root: node === null ? "-" : root
    };

    nodeValueField.value = args.value;
    nodeLeftField.value = args.left;
    nodeRightField.value = args.right;
    nodeDepthField.value = args.depth;
    nodeIsLeafField.value = args.leaf;
    nodeIsRootField.value = args.root;

}

function collapseSidebar() {
    const sidebar = document.getElementById("sidebar");
    const div = document.getElementById("expand-sidebar");
    const button = document.getElementById("expand-sidebar-button")
    console.log(sidebar.style.display)
    if (sidebar.style.width === "300px") {
        // Collapse the sidebar
        sidebar.style.width = "0";
        sidebar.style.padding = "0";
        button.innerHTML = ">";
        div.style.left = "0";
      } else {
        // Expand the sidebar
        sidebar.style.width = "300px";
        sidebar.style.padding = "5px";
        button.innerHTML = "<";
        div.style.left = "310px";
      }
  }
  
const button = document.getElementById("expand-sidebar-button");
button.addEventListener("click", collapseSidebar);


const endProbability = 0.25;
const randomDepth = 3;
var rootNode = generateRandomBinaryTree(randomDepth);


const tree = new BinaryTree(canvas, context, rootNode);


tree.onSelectedNodeChanged = updateSelectedNodeFields



tree.draw()




