import React, { useState } from "react";
import {
  insertionSort,
  selectionSort,
  mergeSort,
  shellSort,
} from "../helpers/sorts_2";
import { generateRandomArray, arrayToString } from "../algorithms/sorts";
import "../styles/Sorts.css";
import Modal from "./Modal";
import ArrayCuadraditos from "./ArrayGraph";
import fileService from "../service/arrayFile";

const TestSort = () => {
  const [algorithm, setAlgorithm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [array, setArray] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [isRandom, setIsRandom] = React.useState(false);
  const [text, setText] = useState("");
  const [readOnly, setReadOnly] = useState(false);
  const [Disabled, setDisabled] = useState(false);
  const [operations, setOperations] = useState(0);
  const [runtime, setRuntime] = useState(0);

  const handleShowModal = () => {
    setShowModal(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    const arrayFromText = e.target.value.split(",").map(Number); // Convertir texto a arreglo
    // Validar que el texto ingresado sea un arreglo de numeros
    if (arrayFromText.some(isNaN)) {
      alert("Porfavor ingrese un valor valido");
      return;
    }
    setArray(arrayFromText);
    // console.log(array);
  };
  // const autoResize = (e) => {
  //   e.target.style.height = "auto";
  //   e.target.style.height = e.target.scrollHeight + "px";
  // }

  const handleClear = () => {
    setText("");
    setArray([]);
    setSortedArray([]);
    setReadOnly(false);
    setIsRandom(false);
    setDisabled(false);
  };

  const handleRandomArray = () => {
    let n = prompt("Cuántos elementos ingresará?");
    const randomArray = generateRandomArray(n);
    // console.log("Arreglo aleatorio", randomArray);
    setIsRandom(true);
    setArray(randomArray);
    setText(arrayToString(randomArray));
    setDisabled(true);
    // const textarea = document.getElementById("textarea");
    // autoResize.call(textarea, { target: textarea });
  };
  const handleInsertionSort = () => {
    if (array.length === 0) {
      alert("El arreglo está vacío");
      return;
    }
    const copyArrayAux = [...array]; // Copiar el arreglo desordenado en un nuevo arreglo
    const sortedArrayAux = insertionSort(copyArrayAux);
    setSortedArray([...sortedArrayAux.sortedArray]); // Copiar el arreglo ordenado en un nuevo arreglo
    // console.log("Arreglo ordenado - Insertion", sortedArrayAux.sortedArray);
    // console.log("Operaciones - Insertion", sortedArray.numOperations);
    // console.log("Runtime - Insertion", sortedArray.runtime);
    setOperations(sortedArrayAux.numOperations);
    setRuntime(sortedArrayAux.runtime);
    setAlgorithm("Insertion Sort");
    setShowModal(!showModal);
  };

  const handleSelectionSort = () => {
    if (array.length === 0) {
      alert("El arreglo está vacío");
      return;
    }
    const copyArrayAux = [...array]; // Copiar el arreglo desordenado en un nuevo arreglo

    const sortedArrayAux = selectionSort(copyArrayAux);
    // Copiar el arreglo ordenado en un nuevo arreglo
    // console.log("Arreglo ordenado - Selection", sortedArrayAux.sortedArray);
    // console.log("Operaciones - Selection", sortedArrayAux.numOperations);
    // console.log("Runtime - Selection", sortedArrayAux.runtime);
    setShowModal(!showModal);
    setSortedArray([...sortedArrayAux.sortedArray]);
    setOperations(sortedArrayAux.numOperations);
    setRuntime(sortedArrayAux.runtime);
    setAlgorithm("Selection Sort");
  };

  const handleShellSort = () => {
    if (array.length === 0) {
      alert("El arreglo está vacío");
      return;
    }
    const copyArrayAux = [...array]; // Copiar el arreglo desordenado en un nuevo arreglo
    const sortedArrayAux = shellSort(copyArrayAux);
    // console.log("Arreglo ordenado - Shell", sortedArrayAux.sortedArray);
    // console.log("Operaciones - Shell", sortedArrayAux.numOperations);
    // console.log("Runtime - Shell", sortedArrayAux.runtime);
    setShowModal(!showModal);
    setSortedArray([...sortedArrayAux.sortedArray]);
    setOperations(sortedArrayAux.numOperations);
    setRuntime(sortedArrayAux.runtime);
    setAlgorithm("Shell Sort");
  };

  const handleMergeSort = () => {
    if (array.length === 0) {
      alert("El arreglo está vacío");
      return;
    }
    const copyArrayAux = [...array]; // Copiar el arreglo desordenado en un nuevo arreglo
    const sortedArrayAux = mergeSort(copyArrayAux);
    // console.log("Arreglo ordenado - Merge", sortedArrayAux.sortedArray);
    // console.log("Operaciones - Merge", sortedArrayAux.numSteps);
    // console.log("Runtime - Merge", sortedArrayAux.runtime);
    setShowModal(!showModal);
    setSortedArray([...sortedArrayAux.sortedArray]);
    setOperations(sortedArrayAux.numSteps);
    setRuntime(sortedArrayAux.runtime);
    setAlgorithm("Merge Sort");
  };

  const handleFileDownload = () => {
    if (array.length === 0) {
      alert("El arreglo está vacío");
      return;
    }
    const fileName = prompt("Introduzca el nombre del archivo");
    if (fileName === null) return;
    // console.log(fileName);
    fileService.downloadArray(array, `${fileName}.json`);
  };

  const handleFileUpload = async (event) => {
    await fileService.uploadArray(event).then((response) => {
      // console.log(response);
      setIsRandom(true);
      setArray(response.array);
      setText(arrayToString(response.array));
      setDisabled(true);
      // const textarea = document.getElementById("textarea");
      // autoResize.call(textarea, { target: textarea });
    });
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
        }}
      >
        Algoritmos de Ordenamiento
      </h1>
      <br />

      <div>
        <input
          id="file-input"
          type="file"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        <textarea
          id="textarea"
          rows="1"
          value={isRandom ? array : text}
          onChange={handleTextChange}
          // onInput={autoResize}
          // style={{ height: "auto", overflow: "hidden" }}
          disabled={readOnly}
        />
      </div>
      <div className="row-intial">
        <button
          className="buttonSort"
          onClick={handleRandomArray}
          disabled={Disabled}
        >
          Arreglo Aleatorio
        </button>
        <button className="buttonSort" onClick={handleClear}>
          Limpiar
        </button>
        <button className="buttonSort" onClick={handleFileDownload}>
          {" "}
          Descargar Arreglo
        </button>

        <button
          className="buttonSort"
          onClick={() => document.getElementById("file-input").click()}
        >
          Cargar Arreglo
        </button>
        <br />
        <button
          className="buttonSort"
          onClick={() =>
            window.open(
              "https://docs.google.com/document/u/0/d/19a-S0iG242SVOKOlIre3ltMluHy514fI3p2VMhAvp9w/edit?pli=1",
              "_blank"
            )
          }
        >
          Manual de Usuario
        </button>
      </div>

      <div className="row">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif"
          alt="Insertion Sort"
          width="200"
          height="200"
        />
        <img
          src="https://res.cloudinary.com/practicaldev/image/fetch/s--T5-4vODQ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://i0.wp.com/algorithms.tutorialhorizon.com/files/2019/01/Selection-Sort-Gif.gif%3Fzoom%3D1.25%26fit%3D300%252C214%26ssl%3D1"
          alt="Selection Sort"
          width="200"
          height="200"
        />
      </div>

      <div className="row">
        <button onClick={handleInsertionSort}>Insertion Sort</button>
        <button onClick={handleSelectionSort}>Selection Sort</button>
      </div>

      <div className="row">
        <img
          src="https://cdn.hashnode.com/res/hashnode/image/upload/v1651064131557/DwUHiegcH.gif"
          alt="Shell Sort"
          width="200"
          height="200"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif"
          alt="Merge Sort"
          width="200"
          height="200"
        />
      </div>

      <div className="row">
        <button onClick={handleShellSort}>Shell Sort</button>
        <button onClick={handleMergeSort}>Merge Sort</button>
      </div>

      {showModal ? (
        <div>
          <Modal
            className="modal-main"
            content={
              <ArrayCuadraditos
                array={array}
                sortedArray={sortedArray}
                algorithm={algorithm}
                operations={operations}
                runtime={runtime}
              />
            }
            show={showModal}
            onClose={handleShowModal}
          ></Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default TestSort;
