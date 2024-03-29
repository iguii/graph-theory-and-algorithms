import React, { useState } from "react";

import ReactFlow, { MiniMap, Controls, ControlButton } from "reactflow";

import RemoveAllIcon from "/icons/removeAll.png";
import CreateNodeIcon from "/icons/createNode.png";
import RemoveNodeIcon from "/icons/removeNode.png";
import DownloadIcon from "/icons/download.png";
import UploadIcon from "/icons/upload.png";
import GraphNode from "./GraphNode";
import GraphEdge from "./GraphEdge";
import AdjacencyMatrix from "./AdjacencyMatrix";
import AssignationMatrix from "./AssignationMatrix";
import AssignationIconMax from "/icons/maxIcon.png";
import AssignationIconMin from "/icons/minIcon.png";
import MiniMapNode from "./MiniMapNode";

import fileService from "../service/file";

import useFlowStore from "../store/FlowStore";
import { shallow } from "zustand/shallow";

import assign from "../helpers/assignation.js";
import assignWithMunkres from "../helpers/assingMatrix.js";
import assignMax from "../helpers/assignationMax.js";

import Modal from "./Modal";

const bgColor = "#fff";

const nodeTypes = {
  "graph-node-start": GraphNode,
};

const edgeTypes = {
  "graph-edge": GraphEdge,
};
/* Set state modal */
//const [isModalOpen, setIsModalOpen] = useState(false);

// const selector = (state) => ({
//   // Persona
//   deletePersona: state.deletePersona,
//   toggleDeletePersona: state.toggleDeletePersona,
//
//   // adjacency matrix
//   adjacencyMatrix: state.adjacencyMatrix,
//   setAdjacencyMatrix: state.setAdjacencyMatrix,
//
//   //assignation matrix
//   assignationMatrix: state.assignationMatrix,
//   setAssignationMatrix: state.setAssignationMatrix,
//
//   //Positions matrix
//   posMatrix: state.posMatrix,
//   setPosMatrix: state.setPosMatrix,
//
//   //costo total
//   totalCost: state.totalCost,
//   setTotalCost: state.setTotalCost,
//
//   // nodes
//   nodes: state.nodes,
//   addNode: state.addNode,
//   setNodes: state.setNodes,
//   onNodesChange: state.onNodesChange,
//   setWeight: state.setWeight,
//
//   // edges
//   edges: state.edges,
//   setEdges: state.setEdges,
//   onEdgesChange: state.onEdgesChange,
//   onConnect: state.onConnect,
// });

// WARNING: Use above selector if this doesn't work
const selector = (state) => ({
  ...state,
});

const AssignmentScreen = () => {
  const {
    deletePersona,
    toggleDeletePersona,
    adjacencyMatrix,
    assignationMatrix,
    setAssignationMatrix,
    posMatrix,
    setPosMatrix,
    totalCost,
    setTotalCost,
    nodes,
    addNode,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useFlowStore(selector, shallow);
  // // adjacency matrix
  // const adjMatrix = useFlowStore((state) => state.adjMatrix);
  // const setAdjMatrix = useFlowStore((state) => state.setAdjMatrix);
  //
  const [showMatrix, setShowMatrix] = useState(false);

  //const [showMatrix2, setShowMatrix2] = useState(false);
  const [showAssignationMin, setShowAssignationMin] = useState(false);
  const [showAssignationMax, setShowAssignationMax] = useState(false);

  const [showModal, setShowModal] = useState(false);

  /*const [showModalMin, setShowModalMin] = useState(false);
  
  const [showModalMax, setShowModalMax] = useState(false);*/

  const [showModalAssignation, setShowModalAssignation] = useState(false);
  const [titleAssignation, setTitleAssignation] = useState("");

  //Matriz de adyancecia
  const handleCloseModal = () => {
    setShowModal(false);
    setShowMatrix(false);
  };

  //modal de asignación
  const handleCloseModalAssignation = () => {
    setShowAssignationMin(false);
    setShowModalAssignation(false);
  };
  const handleAssignationMin_2 = () => {
    function removeZeros(matrix) {
      const filteredMatrix = matrix.map((row) =>
        row.filter((elem) => elem !== 0)
      );
      for (let i = 0; i < filteredMatrix.length; i++) {
        if (filteredMatrix[i].length === 0) {
          filteredMatrix.splice(i, 1);
          i--;
        }
      }
      return filteredMatrix;
    }
    let matrix = [];
    // fill matrix with zeros
    for (let i = 0; i < nodes.length; i++) {
      matrix[i] = new Array(nodes.length).fill(0);
    }

    edges.forEach((edge) => {
      matrix[edge.source][edge.target] =
        typeof edge.data.weight === "undefined" ? 1 : edge.data.weight;
    });
    matrix = matrix.map((innerArr) => innerArr.map(Number));
    // convertir la matrix sin conexiones
    let matrixFinal = removeZeros(matrix);
    //algoritmo de asignación
    //FIXME: no maximiza unu
    const totalCost1 = assign(matrixFinal);
    let mat2 = matrixFinal;
    let x = assignWithMunkres(mat2, true);

    setTotalCost(totalCost1);
    let ceros = assignInitial(x);
    setPosMatrix(ceros);
    setShowModalAssignation(!showModalAssignation);
    setAssignationMatrix(mat2);
    setTitleAssignation("Minimización");
    setShowAssignationMin(!showAssignationMin);
  };

  const handleAssignationMax = () => {
    //TODO: quitar esta función de acá y ponerla en el helper
    function removeZeros(matrix) {
      const filteredMatrix = matrix.map((row) =>
        row.filter((elem) => elem !== 0)
      );
      for (let i = 0; i < filteredMatrix.length; i++) {
        if (filteredMatrix[i].length === 0) {
          filteredMatrix.splice(i, 1);
          i--;
        }
      }
      return filteredMatrix;
    }

    let matrix = [];
    // fill matrix with zeros
    for (let i = 0; i < nodes.length; i++) {
      matrix[i] = new Array(nodes.length).fill(0);
    }

    edges.forEach((edge) => {
      matrix[edge.source][edge.target] =
        typeof edge.data.weight === "undefined" ? 1 : edge.data.weight;
    });
    matrix = matrix.map((innerArr) => innerArr.map(Number));
    // convertir la matrix sin conexiones
    let matrixFinal = removeZeros(matrix);

    //algoritmo de asignación
    //FIXME: no maximiza unu
    const totalCost1 = assignMax(matrixFinal);
    let mat2 = [...matrixFinal];
    let x = assignWithMunkres(mat2, false);
    setTotalCost(totalCost1);
    //console.log("matrix",typeof(mat2));
    let ceros = assignInitial(x);
    setPosMatrix(ceros);
    setAssignationMatrix(mat2);

    setShowAssignationMax(!showAssignationMax);
    setShowModalAssignation(!showModalAssignation);
    setTitleAssignation("Máximizar");
    //setShowModalOptions(!showModalOptions);

    //mostrar matriz
  };

  function assignInitial(matrix) {
    let assignments = [];
    let rows = matrix.length;
    let cols = matrix[0].length;

    let assignedRows = new Set();
    let assignedCols = new Set();

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] == 1 && !assignedRows.has(i) && !assignedCols.has(j)) {
          assignments.push([i, j]);
          assignedRows.add(i);
          assignedCols.add(j);
        }
      }
    }

    return assignments;
  }

  // TODO: add delete persona
  // uses /service/file.js to upload the graph and set the nodes and edges
  const handleFileUpload = async (event) => {
    await fileService.upload(event).then((response) => {
      setNodes(response.nodes);
      setEdges(response.edges);
      return response;
    });
  };

  const handleFileDownload = () => {
    const fileName = prompt("Introduzca el nombre del archivo");
    if (fileName === null) return;
    // console.log(fileName);
    fileService.download(nodes, edges, `${fileName}.json`);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div
      style={{
        //give 80% height
        height: "100vh",
      }}
    >
      {showMatrix ? (
        <div>
          <Modal
            title={`Matriz de Adyacencia`}
            content={<AdjacencyMatrix nodes={nodes} matrix={adjacencyMatrix} />}
            show={showModal}
            onClose={handleCloseModal}
          ></Modal>
        </div>
      ) : (
        <></>
      )}

      {showModalAssignation ? (
        <Modal
          show={showModalAssignation}
          onClose={handleCloseModalAssignation}
          title={`Asignacion de nodos ${titleAssignation}`}
          content={
            <AssignationMatrix
              matrixpos={posMatrix}
              nodes={nodes}
              matrix={assignationMatrix}
              totalCost={totalCost}
            />
          }
        ></Modal>
      ) : (
        <> </>
      )}

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
        // onEdgeClick={(event, edge) => {
        //   console.log("edge", edge);
        // }}
      >
        <MiniMap
          nodeColor="#5e90e1"
          nodeStrokeWidth={3}
          nodeComponent={MiniMapNode}
          zoomable
          pannable
        />
        <Controls>
          <ControlButton onClick={addNode}>
            <img
              src={CreateNodeIcon}
              alt="A"
              style={{
                width: "20px",
                hover: "pointer",
              }}
            />
          </ControlButton>
          <ControlButton
            onClick={toggleDeletePersona}
            style={{ backgroundColor: deletePersona ? "#ff0000" : "#fff" }}
          >
            <img
              src={RemoveNodeIcon}
              alt="A"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>

          <ControlButton onClick={handleAssignationMin_2}>
            <img
              src={AssignationIconMin}
              alt="assignation"
              style={{
                width: "20px",
              }}
            />
          </ControlButton>
          <ControlButton onClick={handleAssignationMax}>
            <img
              src={AssignationIconMax}
              alt="assignation"
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
                "https://docs.google.com/document/d/19a-S0iG242SVOKOlIre3ltMluHy514fI3p2VMhAvp9w/edit?pli=1"
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

export default AssignmentScreen;
