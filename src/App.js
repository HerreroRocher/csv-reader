import React, { useState, useEffect } from 'react'; // Import React and hooks for state and effect management
import Papa from 'papaparse'; // Import PapaParse for CSV parsing
import './App.css'; // Import custom CSS for styling

// Main App component
export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Daniel's File-Reader using React JS</p> {/* Header text */}
      </header>
      <div>
        <FileReader /> {/* Render the FileReader component */}
      </div>
    </div>
  );
}

// FileReader component for reading and processing the CSV file
function FileReader() {
  const [textValue, setTextValue] = useState(""); // State to store the input text value
  const [csvData, setCsvData] = useState([]); // State to store the parsed CSV data
  const [result, setResult] = useState(""); // State to store the result of the search
  const [resultColor, setResultColor] = useState("#cfcccc"); // State to store the background color for result display

  useEffect(() => {
    // Use Papa.parse to fetch and parse the CSV file
    Papa.parse('funds.csv', {
      download: true,     // Option to download the file from the URL
      header: true,       // Option to treat the first row as headers
      complete: (results) => {
        // This function is called when parsing is complete
        setCsvData(results.data);  // Update state with the parsed data
      },
      error: (error) => {
        console.error('Error parsing CSV:', error); // Handle and log any errors encountered during parsing
      },
    });
  }, []); // Empty dependency array means this effect runs once on component mount

  // Function to handle the 'Calculate' button click
  const handleCalculate = () => {
    console.log('Searching for:', textValue); // Debugging log to show the current search value
    const foundRow = csvData.find(row => row['ISIN No'] === textValue); // Search for the row with matching ISIN No
    console.log('Found Row:', foundRow); // Debugging log to show the found row

    if (foundRow) {
      // If a matching row is found, create a result object with specific columns
      const filteredResult = {
        'Parent Fund': foundRow['Parent Fund'],
        'Sub Fund Name': foundRow['Sub Fund Name']
      };
      setResult(filteredResult); // Update result state with the filtered result object
      setResultColor("#6cd65e"); // Set background color to green for successful search
    } else {
      setResult('No fund found'); // Update result state if no matching row is found
      setResultColor("#f04f4f"); // Set background color to red for failed search
    }
  };

  // Function to handle key down events
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') { // Check if the pressed key is Enter
      handleCalculate(); // Call handleCalculate if Enter is pressed
    }
  };

  return (
    <>
      <p>
        Enter an ISIN No, and we will check if there's a corresponding record in our&nbsp; 
        <a href="https://assets.publishing.service.gov.uk/media/66c44db32e8f04b086cdf40b/approved-offshore-reporting-funds-list.ods">
          List of reporting funds A to Z
        </a> 
        &nbsp;of&nbsp; 
        <a target="_blank" href="https://www.gov.uk/government/publications/offshore-funds-list-of-reporting-funds">
          Approved offshore reporting funds
        </a>.
      </p> {/* Instructions and links for additional information */}
      <div className="field">
        <input
          type="text"
          value={textValue} // Bind the input field to the textValue state
          onChange={e => setTextValue(e.target.value)} // Update textValue state on input change
          onKeyDown={handleKeyPress} // Handle Enter key press to trigger search
          placeholder="AB12CD3FG456"        
        />
        <p>Current input: {textValue}</p> {/* Display current input value */}
      </div>
      <button className="calculateButton" onClick={handleCalculate}>Calculate</button> {/* Button to trigger the calculation */}
      <div className="results" style={{ backgroundColor: resultColor }}>
        <p>Result:</p>
        {typeof result === 'object' && result !== null ? (
          // Check if result is an object and not null to display the result in list format
          <>
            <ul style={{ listStyleType: 'none' }}> {/* Remove bullet points from the list */}
              <li>Parent Fund: {result['Parent Fund'] || 'N/A'}</li> {/* Display Parent Fund */}
              <li>Sub Fund Name: {result['Sub Fund Name'] || 'N/A'}</li> {/* Display Sub Fund Name */}
            </ul>
          </>
        ) : (
          <p>{result}</p> // Display the 'No fund found' message or any other string message
        )}
      </div>
    </>
  );
}
