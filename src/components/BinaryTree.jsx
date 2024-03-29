import React, { useState } from "react";

import ReactFlow, { MiniMap, Controls, ControlButton } from "reactflow";

import RemoveAllIcon from "/icons/removeAll.png";
import TreeIcon from "/icons/tree.png";
import DownloadIcon from "/icons/download.png";
import UploadIcon from "/icons/upload.png";
import ModeIcon from "/icons/mode.png";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import MiniMapNode from "./MiniMapNode";
import Modal from "./Modal";
import fileService from "../service/treeFile";
import BinaryTreeOrder from "./BinaryTreeOrder";
import useFlowStore from "../store/FlowStore";
import { shallow } from "zustand/shallow";
import {
  generateTreeFromList,
  generateListFromOrders,
  getOrdersFromList,
} from "../algorithms/binaryTree";
import "../styles/BinaryTree.css";

const bgColor = "#fff";

const nodeTypes = {
  "graph-node-start": GraphNode,
};

const edgeTypes = {
  "graph-edge": GraphEdge,
};

const selector = (state) => ({
  // Persona
  deletePersona: state.deletePersona,
  toggleDeletePersona: state.toggleDeletePersona,

  // adjacency matrix
  adjacencyMatrix: state.adjacencyMatrix,
  setAdjacencyMatrix: state.setAdjacencyMatrix,

  //assignation matrix
  assignationMatrix: state.assignationMatrix,
  setAssignationMatrix: state.setAssignationMatrix,

  //Positions matrix
  posMatrix: state.posMatrix,
  setPosMatrix: state.setPosMatrix,

  //costo total
  totalCost: state.totalCost,
  setTotalCost: state.setTotalCost,

  // nodes
  nodes: state.nodes,
  addNode: state.addNode,
  setNodes: state.setNodes,
  onNodesChange: state.onNodesChange,
  setWeight: state.setWeight,

  // edges
  edges: state.edges,
  setEdges: state.setEdges,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

const BinaryTree = () => {
  const {
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowStore(selector, shallow);

  const [listModeActive, setListModeActive] = useState(false);
  const [list, setList] = useState([]);
  const [listText, setListText] = useState("");
  const [preOrderText, setPreOrderText] = useState("");
  const [postOrderText, setPostOrderText] = useState("");
  const [preOrder, setPreOrder] = useState([]);
  const [inOrder, setInOrder] = useState([]);
  const [postOrder, setPostOrder] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // uses /service/file.js to upload the graph and set the nodes and edges
  const handleFileUpload = async (event) => {
    await fileService.upload(event).then((response) => {
      setNodes(response.nodes);
      setEdges(response.edges);
      setList(response.list);
      return response;
    });
  };

  const handleFileDownload = () => {
    const fileName = prompt("Introduzca el nombre del archivo");
    if (fileName === null) return;
    fileService.download(nodes, edges, list, `${fileName}.json`);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setList([]);
    setListText("");
    setPreOrderText("");
    setPostOrderText("");
  };

  const handleTextChange = (e) => {
    setListText(e.target.value);
  };

  const handlePreOrderTextChange = (e) => {
    setPreOrderText(e.target.value);
  };

  const handlePostOrderTextChange = (e) => {
    setPostOrderText(e.target.value);
  };

  const handleModeChange = () => {
    handleClear();
    setListModeActive(!listModeActive);
  };

  const showOrder = () => {
    if (list.length === 0) {
      alert("Porfavor genere un arbol primero");
      return;
    }
    const { preOrder, inOrder, postOrder } = getOrdersFromList(list);
    setPreOrder(preOrder);
    setInOrder(inOrder);
    setPostOrder(postOrder);
    // console.log(preOrder);
    // console.log(inOrder);
    // console.log(postOrder);
    setShowModal(true);
  };

  const showTreeFromList = () => {
    // Valiation
    if (listText === "" || listText === null) {
      alert("Porfavor ingrese un valor valido");
      return;
    }
    const arrayFromText = listText.split(",").map(Number);
    // Verify that all values are numbers
    if (arrayFromText.some(isNaN)) {
      alert("Porfavor ingrese un valor valido");
      return;
    }
    // Verify that there are not repeated values in the array
    if (new Set(arrayFromText).size !== arrayFromText.length) {
      alert("No se permiten valores repetidos");
      return;
    }
    // Verify that there are no repeated values in the list
    if (list.some((value) => arrayFromText.includes(value))) {
      alert("No se permiten valores repetidos");
      return;
    }
    setList([...list, ...arrayFromText]);
    setListText("");
    // console.log([...list, ...arrayFromText]);
    // console.log([...list, ...arrayFromText]);
    const rootCoordinates = [window.innerWidth / 2, 100];
    const { binaryTree } = generateTreeFromList(
      [...list, ...arrayFromText],
      rootCoordinates
    );
    const newNodes = binaryTree.map((binaryTree) => ({
      type: "graph-node-start",
      id: `${binaryTree.label}`,
      handleId: `${binaryTree.label}`,
      data: { label: ` ${binaryTree.label} ` },
      position: { x: binaryTree.x, y: binaryTree.y },
    }));

    const root = binaryTree[0];
    const newEdges = binaryTree.map((binaryTree) => ({
      source: `${binaryTree.parent}`,
      sourceHandle:
        root.label === binaryTree.parent
          ? root.x < binaryTree.x
            ? "undefined-right"
            : "undefined-left"
          : "undefined-top",
      target: `${binaryTree.label}`,
      targetHandle: "undefined-top",
      id: `${binaryTree.parent}-${binaryTree.label}`,
      type: "graph-edge",
      markerEnd: {
        type: "arrowclosed",
        color: "#342e37",
      },
    }));
    setNodes([...newNodes]);
    setEdges([...newEdges]);
  };

  const showTreeFromOrders = () => {
    // Valiation
    if (
      preOrderText === "" ||
      preOrderText === null ||
      postOrderText === "" ||
      postOrderText === null
    ) {
      alert("Porfavor ingrese valores validos");
      return;
    }
    const preOrderArrayFromText = preOrderText.split(",").map(Number); // Convertir texto a arreglo
    const postOrderArrayFromText = postOrderText.split(",").map(Number); // Convertir texto a arreglo
    const inOrderArrayFromText = [...preOrderArrayFromText].sort(
      (a, b) => a - b
    ); // Convertir texto a arreglo

    // Verify that all values are numbers
    if (
      preOrderArrayFromText.some(isNaN) ||
      postOrderArrayFromText.some(isNaN)
    ) {
      alert("Porfavor ingrese valores validos");
      return;
    }
    // Verify that there are not repeated values in the array
    if (
      new Set(preOrderArrayFromText).size !== preOrderArrayFromText.length ||
      new Set(postOrderArrayFromText).size !== postOrderArrayFromText.length
    ) {
      alert("No se permiten valores repetidos en el mismo arreglo");
      return;
    }
    // Validate the input for preorder and
    console.table(preOrderArrayFromText);
    console.table(inOrderArrayFromText);
    const constructedPostOrder = [];
    constructedPostOrder.push(
      ...constructPostOrder(inOrderArrayFromText, preOrderArrayFromText)
    );
    console.table(constructedPostOrder);
    // Check if constructed post order is equal to the post order from the input
    if (constructedPostOrder.toString() !== postOrderArrayFromText.toString()) {
      alert("Los arreglos ingresados no son validos, no se puede construir");
      setNodes([]);
      setEdges([]);
      setList([]);
      return;
    }

    const list = generateListFromOrders(
      preOrderArrayFromText,
      postOrderArrayFromText
    );
    setList([...list]);
    const rootCoordinates = [window.innerWidth / 2, 100];
    const { binaryTree } = generateTreeFromList(list, rootCoordinates);
    const newNodes = binaryTree.map((binaryTree) => ({
      type: "graph-node-start",
      id: `${binaryTree.label}`,
      handleId: `${binaryTree.label}`,
      data: { label: ` ${binaryTree.label} ` },
      position: { x: binaryTree.x, y: binaryTree.y },
    }));

    const root = binaryTree[0];
    const newEdges = binaryTree.map((binaryTree) => ({
      source: `${binaryTree.parent}`,
      sourceHandle:
        root.label === binaryTree.parent
          ? root.x < binaryTree.x
            ? "undefined-right"
            : "undefined-left"
          : "undefined-top",
      target: `${binaryTree.label}`,
      targetHandle: "undefined-top",
      id: `${binaryTree.parent}-${binaryTree.label}`,
      type: "graph-edge",
      markerEnd: {
        type: "arrowclosed",
        color: "#342e37",
      },
    }));
    setNodes([...newNodes]);
    setEdges([...newEdges]);
    // console.log([...preOrderArrayFromText]);
    // console.log([...postOrderArrayFromText]);
  };
  //
  const constructPostOrder = (inorder, preorder) => {
    if (inorder.length === 0 || preorder.length === 0) {
      return [];
    }

    const rootValue = preorder[0];
    const rootIndex = inorder.indexOf(rootValue);

    const leftSubtreeInorder = inorder.slice(0, rootIndex);
    const rightSubtreeInorder = inorder.slice(rootIndex + 1);

    const leftSubtreePreorder = preorder.slice(1, rootIndex + 1);
    const rightSubtreePreorder = preorder.slice(rootIndex + 1);

    const leftSubtreePostorder = constructPostOrder(
      leftSubtreeInorder,
      leftSubtreePreorder
    );
    const rightSubtreePostorder = constructPostOrder(
      rightSubtreeInorder,
      rightSubtreePreorder
    );

    const postorder = leftSubtreePostorder.concat(
      rightSubtreePostorder,
      rootValue
    );
    return postorder;
  };

  return (
    <div
      style={{
        //give 80% height
        height: "100vh",
      }}
    >
      {showModal ? (
        <div>
          <Modal
            content={
              <BinaryTreeOrder
                preOrder={preOrder}
                inOrder={inOrder}
                postOrder={postOrder}
              />
            }
            show={showModal}
            onClose={() => setShowModal(false)}
            title="RECORRIDOS DE ARBOLES BINARIOS"
          ></Modal>
        </div>
      ) : (
        <></>
      )}
      <div
        className="list-input-container"
        style={{ display: listModeActive ? "none" : "block" }}
      >
        <label>Ingrese uno o mas datos del arbol</label>
        <input
          type="text"
          placeholder="Ej: 9, 2, 1, 16, 6, 11, 8, 4"
          onChange={handleTextChange}
          value={listText}
        />
        <button onClick={showTreeFromList}>Agregar - Generar arbol</button>
      </div>
      <div
        className="list-input-container"
        style={{ display: !listModeActive ? "none" : "block" }}
      >
        <label>Ingrese el recorrido en pre-orden</label>
        <input
          type="text"
          placeholder="9, 2, 1, 6, 4, 8, 16, 11"
          onChange={handlePreOrderTextChange}
          value={preOrderText}
        />
        <label>Ingrese el recorrido en post-orden</label>
        <input
          type="text"
          placeholder="1, 4, 8, 6, 2, 11, 16, 9"
          onChange={handlePostOrderTextChange}
          value={postOrderText}
        />
        <button onClick={showTreeFromOrders}>Generar arbol</button>
      </div>
      <input
        id="file-input"
        type="file"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ background: bgColor }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineType="straight"
        connectionLineStyle={{ stroke: "#342e37", strokeWidth: 2 }}
        connectionMode="loose"
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap
          nodeColor="#5e90e1"
          nodeStrokeWidth={3}
          nodeComponent={MiniMapNode}
          zoomable
          pannable
        />
        <Controls>
          <ControlButton onClick={showOrder}>
            <img
              src={TreeIcon}
              alt="A"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton onClick={handleModeChange}>
            <img
              src={ModeIcon}
              alt="A"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton onClick={handleFileDownload}>
            <img
              src={DownloadIcon}
              alt="A"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton
            onClick={() => document.getElementById("file-input").click()}
          >
            <img
              src={UploadIcon}
              alt="A"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton onClick={handleClear}>
            <img
              src={RemoveAllIcon}
              alt="Remove All"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton
            onClick={() =>
              window.open(
                "https://docs.google.com/document/u/0/d/19a-S0iG242SVOKOlIre3ltMluHy514fI3p2VMhAvp9w/edit?pli=1",
                "_blank"
              )
            }
            style={{ color: "#000" }}
          >
            ?
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
};

export default BinaryTree;
