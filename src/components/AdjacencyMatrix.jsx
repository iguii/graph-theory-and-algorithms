import React from "react";
import PropTypes from "prop-types";

const AdjacencyMatrix = ({ nodes, matrix }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th></th>
            {nodes.map((node) => (
              <th key={node.id}>{node.data.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="labels" style={{ fontWeight: "bold" }}>
                {nodes[rowIndex].data.label}
              </td>
              {row.map((cell, cellIndex) => (
                <td className="weights" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AdjacencyMatrix.propTypes = {
  nodes: PropTypes.array.isRequired,
  matrix: PropTypes.array.isRequired,
};

export default AdjacencyMatrix;
