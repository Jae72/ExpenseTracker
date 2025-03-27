import './PredictionAlgo.css'; // Import the CSS file for styling
import React, { useEffect, useState } from "react"; // Import React hooks
import regression from "regression"; // Import regression library for prediction
import { Bar } from "react-chartjs-2"; // Import Bar chart component from react-chartjs-2
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js"; // Import necessary components from Chart.js
import { ResponsiveContainer } from 'recharts'; // Import ResponsiveContainer for adaptive chart size

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the PredictionAlgo component
const PredictionAlgo = ({ expenses }) => {
  const [predictedData, setPredictedData] = useState([]); // State to store predicted expenses
  const [totalByCategory, setTotalByCategory] = useState({}); // State to store total expenses by category

  // Function to group expenses by category and month
  const groupExpensesByCategoryAndMonth = () => {
    const grouped = {}; // Object to hold grouped expenses
    const total = {}; // Object to hold total expenses per category

    // Loop through expenses and group them by category and month
    expenses.forEach((expense) => {
      const { category, price, date } = expense;
      const month = new Date(date).getMonth() + 1; // Convert date to 1-based month

      // Initialize objects for new categories
      if (!grouped[category]) {
        grouped[category] = {};
        total[category] = 0;
      }
      // Initialize monthly total if not already present
      if (!grouped[category][month]) {
        grouped[category][month] = 0;
      }
      // Update monthly and category totals
      grouped[category][month] += parseFloat(price);
      total[category] += parseFloat(price);
    });

    setTotalByCategory(total); // Update state with total by category
    return grouped;
  };

  // Generate predicted data when expenses change
  useEffect(() => {
    if (expenses.length > 0) {
      const groupedData = groupExpensesByCategoryAndMonth(); // Group data by category and month
      const predictionResults = []; // Array to store predictions

      // Loop through each category
      Object.keys(groupedData).forEach((category) => {
        // Convert grouped data to an array of [month, total] pairs
        const monthlyData = Object.entries(groupedData[category])
          .map(([month, total]) => [parseInt(month), total]);

        // Perform polynomial regression (order 2)
        const result = regression.polynomial(monthlyData, { order: 2 });

        // Predict the expense for the next month
        const nextMonth = Math.max(...monthlyData.map(([month]) => month)) + 1;
        let predictedExpense = result.predict(nextMonth)[1];
        predictedExpense = Math.max(predictedExpense, 0); // Ensure non-negative predictions

        // Add prediction result for the category
        predictionResults.push({ category, predictedExpense });
      });

      setPredictedData(predictionResults); // Update state with predicted data
    }
  }, [expenses]); // Dependency array to trigger effect when expenses change

  // Prepare data for the Bar chart
  const chartData = {
    labels: predictedData.map((data) => data.category), // Use category names as labels
    datasets: [
      {
        label: "Predicted Expense for Next Month ($)", // Dataset label
        data: predictedData.map((data) => data.predictedExpense), // Predicted values
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
        borderColor: "rgba(75, 192, 192, 1)", // Border color
        borderWidth: 1, // Border width
      },
    ],
  };

  // Chart configuration options
  const chartOptions = {
    responsive: true, // Make chart responsive
    plugins: {
      legend: { display: true, position: "top" }, // Display legend at the top
      title: { display: true, text: "Predicted Total Expenses for Next Month by Category" }, // Chart title
    },
    scales: {
      y: {
        beginAtZero: true, // Start y-axis at 0
        title: { display: true, text: "Predicted Expense ($)" }, // Y-axis label
      },
      x: {
        title: { display: true, text: "Category" }, // X-axis label
      },
    },
  };

  // Render the component
  return (
    <div className="prediction-container">
      <h1 className='headerChart'>Predicted Total Expenses for Next Month</h1>
      <ResponsiveContainer className='chart' width="75%" height={700}>
        <Bar data={chartData} options={chartOptions} /> {/* Render Bar chart */}
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionAlgo; // Export component for use in other parts of the app
