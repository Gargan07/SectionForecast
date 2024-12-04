import * as tf from "@tensorflow/tfjs";
import { useState, useEffect } from "react";

const TrainModelButton = ({ data, onModelTrained }) => {
    const [processedData, setProcessedData] = useState([]);
    const [model, setModel] = useState(null);

    // Preprocess the data to encode course codes
    const preprocessData = () => {
        const courseEncoded = {};
        const yearEncoded = {};
        let courseIndex = 0;
        let yearIndex = 0;

        const processedData = data.map((item) => {
            const course = item.courseCode;
            if (courseEncoded[course] === undefined) {
                courseEncoded[course] = courseIndex;
                courseIndex++;
            }

            const year = item.year;
            if (yearEncoded[year] === undefined) {
                yearEncoded[year] = yearIndex;
                yearIndex++;
            }

            return {
                year: yearEncoded[year],
                course: item.courseCode,
                courseCode: courseEncoded[course],
                students: item.students
            };
        });
        setProcessedData(processedData);
    };

    // Prepare data for training (must be called after `processedData` is updated)
    const prepareData = () => {
        const quantities = processedData.map((entry) => entry.students);
        const numSamples = quantities.length - 1;

        if (numSamples <= 0) {
            throw new Error("Insufficient data points after slicing.");
        }

        const xs = tf.tensor2d(
            processedData.slice(0, numSamples).map((entry) => [
                entry.year,
                entry.courseCode
            ]),
            [numSamples, 2]
        );

        const ys = tf.tensor1d(quantities.slice(1));

        return { xs, ys };
    };

    // Handle training of the model
    const handleTrainModel = () => {
        preprocessData();
    };

    // UseEffect to trigger model training after processedData is updated
    useEffect(() => {
        if (processedData.length === 0) return;

        const { xs, ys } = prepareData();

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 64, inputShape: [2], activation: "relu" }));
        model.add(tf.layers.dense({ units: 32, activation: "relu" }));
        model.add(tf.layers.dense({ units: 1, activation: "linear" }));

        model.compile({ optimizer: tf.train.adam(0.01), loss: "meanSquaredError" });

        model.fit(xs, ys, {
            epochs: 250,
            callbacks: [
                {
                    onEpochEnd: (epoch, logs) => {
                        console.log(`Epoch: ${epoch + 1}, Loss: ${logs.loss}`);
                    },
                },
            ],
        }).then(() => {
            setModel(model); // Set the model state after training is done
        });
    }, [processedData]); // Only trigger when processedData changes

    // UseEffect to trigger predictAll when model changes
    useEffect(() => {
        if (model !== null) {
            predictAll(model);
        }
    }, [model]); // Run predictAll only after model is set

    // Predict all sections
    const predictAll = (model) => {
        const uniqueCourses = [...new Set(processedData.map(item => item.courseCode))];

        uniqueCourses.forEach(course => {

            const lastYear = processedData[processedData.length - 1].year;

            const inputTensor = tf.tensor2d([[lastYear, course]]);

            const outputTensor = model.predict(inputTensor);
            const prediction = outputTensor.dataSync()[0];

            const roundedPrediction = Math.round(prediction);
            
            const courseCode = processedData.find(item => item.courseCode === course).course;
            
            onModelTrained({
                courseCode: courseCode,
                students: roundedPrediction,
                predictedSections: Math.ceil(roundedPrediction / 30)
            });
        });

    };

    return (
        <button onClick={handleTrainModel}>Train Model</button>
    );
};

export default TrainModelButton;
