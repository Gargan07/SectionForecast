// src/components/PredictionTable.js
import React from 'react';
import Visualization from './Visualization'; // Import the Visualization component

const PredictionTable = ({ predictions }) => {
    const data = predictions.map((p) => ({
        courseCode: p.courseCode,
        students: p.students,
        predictedSections: p.predictedSections,
    }));

    return (
        <div style={{ textAlign: 'center' }}>
            <h2>Predicted Enrollment for 2024</h2>
            <table className="table" style={{ margin: '0 auto' }}>
                <thead>
                    <tr>
                        <th>Course Code</th>
                        <th>Predicted Enrollment</th>
                        <th>Predicted Sections</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((p, index) => (
                        <tr key={index}>
                            <td>{p.courseCode}</td>
                            <td>{p.students}</td>
                            <td>{p.predictedSections}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Visualization predictions={data} /> {/* Pass predictions to Visualization */}
        </div>
    );
};

export default PredictionTable;
