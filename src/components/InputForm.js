import React, { useState } from 'react';
import Papa from 'papaparse';

const InputForm = ({ onDataSubmit }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    results.data.forEach((data) => {
                        if (data.courseCode && data.students) {
                            onDataSubmit({
                                year: parseInt(data.year, 10),
                                courseCode: data.courseCode,
                                students: parseInt(data.students, 10), // Convert students to integer
                            });
                        }
                    });
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error);
                },
            });
        }
        setFile(null);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
            />
            <button type="submit">Upload CSV</button>
        </form>
    );
};

export default InputForm;