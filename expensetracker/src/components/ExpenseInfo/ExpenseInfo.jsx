import React from "react";
import './ExpenseInfo.css';
import { getGroupedExpenses } from "../../firebase";
import { PolynomialRegression } from 'ml-regression-polynomial';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const ExpenseInfo = ({ selectedMonth, selectedYear, selectedCategory, onMonthChange, onYearChange, onCategoryChange, onResetFilters, expenses }) => {
    // grouped expenses into months
    const groupedExpenses = getGroupedExpenses(expenses);

    // create list of numbers from 1 to number of months for x-axis of chart
    const populateXAxis = () => {
        let arr = [];
        for (let i=0; i<Object.keys(groupedExpenses).length; i+=1) {
            arr.push(i+1);
        }
        return arr;
    }

    // get sums of monthly expenses
    const getMonthlySums = () => {
        const sums = [];
        const values = Object.values(groupedExpenses);

        for (let i=0; i<values.length; i+=1) {
            const totalAmount = values[i].reduce((sum, expense) => sum + Number(expense.price), 0);
            sums.push(totalAmount);
        }

        return sums;
    }

    // set x-axis and y-axis for the chart
    const xAxis = [...populateXAxis()];
    const yAxis = [...getMonthlySums()];

    // Validate data if/when less data to calculate/display chart
    if (xAxis.length === 0 || yAxis.length === 0) {
      console.error("No data available for regression.");
      return null; // Skip chart rendering or regression
    }

    // degree is 2 because linear polynomial
    const degree = Math.min(2, xAxis.length - 1); // Use degree 2, or less if data is sparse

    // create polynomial regression
    const regression = new PolynomialRegression(xAxis, yAxis, degree);

    // calculate predicted month and prediction
    const predictedMonth = Object.keys(groupedExpenses).length + 1;
    const prediction = regression.predict(predictedMonth);

    // set data for the chart
    const data = {
        labels: [...Object.keys(groupedExpenses).reverse(), 'Prediction'],
        datasets: [
            {
                label: 'Expenses',
                data: [...yAxis.reverse(), prediction],
                backgroundColor: 'rgba(0, 0, 0, 1)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1,
            },
        ],
    };

    // set options for the chart
    const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Monthly Expenses Data With Prediction',
            font: {
                size: 16,
                weight: 'bold'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Months',
              font: {
                size: 16,
                weight: 'bold',
              }
            },
          },
          y: {
            title: {
              display: true,
              text: 'Expenses',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            beginAtZero: true, // Ensure the y-axis starts at 0
          },
        },
      };
  
    // get list of years
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i += 1) {
            years.push(selectedYear - i);
        }
        return years;
    };

    return (        
        <div style={{ marginTop: 100 }}>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
            <div className="expense-info">
            <div className="filters">
                <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="grocery">grocery</option>
                    <option value="gasoline">gasoline</option>
                    <option value="bill">bill</option>
                    <option value="restaurant">restaurant</option>
                    <option value="miscellaneous">miscellaneous</option>
                </select>
                <select value={selectedMonth} onChange={(e) => onMonthChange(parseInt(e.target.value))}>
                    <option value="0">All Months</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select value={selectedYear} onChange={(e) => onYearChange(parseInt(e.target.value))}>
                    <option value="0">All Years</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                    <option value={2022}>2022</option>
                    <option value={2021}>2021</option>
                    <option value={2020}>2020</option>
                </select>

                <button onClick={onResetFilters} className="reset-button">Reset</button>
            </div>
            </div>
        </div>
    );
};

export default ExpenseInfo