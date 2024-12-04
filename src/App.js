import React, { useState, useEffect } from "react";
import InputForm from "./components/InputForm";
import TrainModelButton from "./components/TrainModelButton";
import PredictionTable from "./components/PredictionTable";

const App = () => {
  const [data, setData] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const handleDataSubmit = (currentData) => {
    setData((prevData) => [...prevData, currentData]);
  };

  const handleTrainedModel = (currentPrediction) => {
    setPredictions((prevPrediction) => [...prevPrediction, currentPrediction]);
  };

  const resetPredictions = () => {
    setPredictions([]);
  };

  useEffect(() => {
      console.log("predictions: ", predictions);
  }, [predictions]);
  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Course Section Forecasting</h1>
      <div style={{ paddingBottom: '15px' }}>
        <InputForm onDataSubmit={handleDataSubmit} />
      </div>
      <div>
        {data.length > 0 && <TrainModelButton data={data} onModelTrained={handleTrainedModel} />}
        <button onClick={resetPredictions} style={{ marginLeft: '10px' }}>Reset Predictions</button>
      </div>

      
      {predictions.length > 0 && <PredictionTable predictions={predictions} />}
    </div>
  );
};

export default App;
