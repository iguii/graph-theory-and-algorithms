import React from "react";
import PropTypes from "prop-types";

import { getBezierPath, EdgeLabelRenderer, getStraightPath } from "reactflow";

import useStore from "./../store/FlowStore";
import { useLocation } from "react-router-dom";

const selector = (state) => ({
  // Persona
  deletePersona: state.deletePersona,

  // actions
  deleteEdge: state.deleteEdge,
});

const foreignObjectSize = 40;
const GraphEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    flex: "1 1",
    stroke: "#342e37",
    strokeWidth: 3,
  },
  data = { label: "", weight: 1 },
  markerEnd,
}) => {
  const setWeight = useStore((state) => state.setWeight);
  const { deletePersona, deleteEdge } = useStore(selector);

  let edgePath, controlX, controlY, labelX, labelY;
  if (source == target) {
    // Use getBezierPath to get a curved path
    const curveFactor = 0.5; // adjust this to control the curve
    [edgePath, controlX, controlY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature: curveFactor,
    });
    // Set labelX and labelY to the control point
    labelX = controlX;
    labelY = controlY;
  } else {
    // Use getStraightPath to get a straight path
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
    // Custom color for edges in jhonson algorithm
    const location = useLocation();
    if (location.pathname === "/graph-theory-and-algorithms/johnson") {
      if (data.label !== "") {
        style = {
          ...style,
          stroke: data.label === "h = 0" ? "green" : "#342e37",
        };
      }
    }
    // Custom color for edges in kruskal algorithm
    if (location.pathname === "/graph-theory-and-algorithms/kruskal") {
      if (data.label === " ") {
        style = {
          ...style,
          stroke: "green",
        };
      }
      // transparent markerEnd for edges in kruskal algorithm
      markerEnd = {
        ...markerEnd,
        color: "transparent",
      };
    }
  }
  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer id="capa2">
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
            color: "#342e37",
          }}
          className="nodrag nopan"
        >
          <br />
          <br />
          {data.label}
        </div>
      </EdgeLabelRenderer>
      <foreignObject
        id="capa1"
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <button
            className="edgebutton"
            onClick={() => (deletePersona ? deleteEdge(id) : setWeight(id))}
            style={{
              display:
                location.pathname === "/graph-theory-and-algorithms/binary-tree"
                  ? "none"
                  : "block",
            }}
          >
            {data.weight}
          </button>
        </div>
      </foreignObject>
    </>
  );
};

GraphEdge.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
  style: PropTypes.object,
  data: PropTypes.object,
  markerEnd: PropTypes.string,
};

export default GraphEdge;
