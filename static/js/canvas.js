var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 320;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")

import {BinaryTree} from "./tree/binary_tree.js"
import {TreeNode} from "./tree/tree_node.js"




function generateRandomBinaryTree(depth) {
    if (depth <= 0) {
      return null;
    }
  
    const node = new TreeNode(Math.floor(Math.random() * 100)); // Change the range (0-100) as needed
  
    node.left = generateRandomBinaryTree(depth - 1);
    node.right = generateRandomBinaryTree(depth - 1);
  
    return node;
  }
  
// Example usage:
const randomDepth = 5; // Specify the depth of the random tree
var rootNode = generateRandomBinaryTree(randomDepth);


const tree = new BinaryTree(canvas, context, rootNode);
tree.draw()




