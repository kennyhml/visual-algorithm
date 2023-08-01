var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 320;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")

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



const endProbability = 0.25;
const randomDepth = 4;
var rootNode = generateRandomBinaryTree(randomDepth);


const tree = new BinaryTree(canvas, context, rootNode);
tree.draw()




