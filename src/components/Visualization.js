// src/components/Visualization.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components needed for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visualization = ({ predictions }) => {
    const chartData = {
        labels: predictions.map(pred => pred.courseCode), // X-axis labels (course codes)
        datasets: [
            {
                label: 'Predicted Sections', // Legend label for predicted sections
                data: predictions.map(pred => pred.predictedSections), // Y-axis data (predicted sections)
                backgroundColor: 'rgba(230, 190, 255, 0.8)', // Bar color for predicted sections
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Position of the legend
            },
            title: {
                display: true,
                text: 'Predicted Enrollment and Sections per Course', // Chart title
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default Visualization;