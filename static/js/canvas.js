var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 322;
canvas.height = window.innerHeight - 10;

var context = canvas.getContext("2d")

import {BinaryTree} from "./tree/binary_tree.js"
import {TreeNode} from "./tree/tree_node.js"


const rootNode = new TreeNode(1, (canvas.width) / 2, 150);
rootNode.left = new TreeNode(2, -50, 40);
rootNode.right = new TreeNode(3, 50, 40);


rootNode.left.left = new TreeNode(4, -80, 80);
rootNode.left.right = new TreeNode(5, -20, 80);
rootNode.right.left = new TreeNode(6, 20, 80);
rootNode.right.right = new TreeNode(6, 20, 80);


const tree = new BinaryTree(canvas, context, rootNode);
tree.draw()




