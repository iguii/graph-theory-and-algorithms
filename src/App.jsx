import Flow from "./components/Flow";
import "./styles/styles.css";
import "./styles/Navbar.css";
import "reactflow/dist/style.css";

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Sidebar";
import TestSort from "./components/TestSorts";
import AssignmentScreen from "./components/AssignmentScreen";
import NorthWest from "./components/NorthWestScreen";
import Compet from "./components/Compet";
import Kruskal from "./components/Kruskal";
import Dijkstra from "./components/DijkstraScreen";
import BinaryTree from "./components/BinaryTree";
import BinaryTrees from "./components/binary-tree/BinaryTrees";
import Perceptron from "./components/Perceptron";

/*
 * Generate the App component.
 * @returns {JSX.Element} The App component.
 */
const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/*" element={<Flow />}></Route>
          <Route
            path="graph-theory-and-algorithms/jhonson"
            element={<Flow />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/asignacion"
            element={<AssignmentScreen />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/northwest"
            element={<NorthWest />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/sort"
            element={<TestSort />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/binary-tree"
            element={<BinaryTree />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/binary-trees"
            element={<BinaryTrees />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/compet"
            element={<Compet />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/perceptron"
            element={<Perceptron />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/dijkstra"
            element={<Dijkstra />}
          ></Route>
          <Route
            path="graph-theory-and-algorithms/kruskal"
            element={<Kruskal />}
          ></Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
