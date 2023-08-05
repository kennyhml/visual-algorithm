var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 320;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")


import { BinaryTree } from "./tree/binary_tree.js"
import { TreeNode } from "./tree/tree_node.js"


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
    checkInsertionAllowed()
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

const tree = new BinaryTree(canvas, context, null);
tree.onSelectedNodeChanged = updateSelectedNodeFields
tree.draw()

const insertButton = document.getElementById("insert-node")
const insertDirection = document.getElementById("insert-position")
const insertValue = document.getElementById("new-node-value")

insertButton.onclick = () => {
    const val = insertValue.value;

    if (!val) {
        window.alert("Invalid node value! Please enter a valid value.")
    } else if (tree.selectedNode === null && tree.root !== null) {
        window.alert("Please select the node to insert a child for.")
    } else if (tree.selectedNode !== null && tree.selectedNode.depth >= 4) {
        window.alert("A depth higher than 4 is currently not allowed.")
    } else {
        tree.insert(val, insertDirection.value.toLowerCase());
        tree.draw();
        insertValue.value = '';
        checkInsertionAllowed()
    }
}


function checkInsertionAllowed() {
    
    if (insertValue.value !== '' && (tree.selectedNode !== null || tree.root === null)) {
        insertButton.disabled = false;
    } else {
        insertButton.disabled = true;
    }
}

insertValue.onkeyup = checkInsertionAllowed





