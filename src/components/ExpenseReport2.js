import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import debounce from 'lodash.debounce';

const ExpenseReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM-YYYY'));
  const [expenseData, setExpenseData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    // Fetch the list of months from your backend API
    const fetchMonths = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getListOfMonths');
        setMonths(response.data);
      } catch (error) {
        console.error('Error fetching months:', error);
      }
    };

    fetchMonths();
  }, []);

  useEffect(() => {
    // Fetch expense data for the selected month from your backend API
    const fetchExpenseDataByMonth = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/getApprovedRecordsByMonth?selectedMonth=${selectedMonth}`);
        setOriginalData(response.data);
        setExpenseData(response.data);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    if (selectedMonth) {
      fetchExpenseDataByMonth();
    }
  }, [selectedMonth]);

  const handleSearch = debounce(async (query) => {
    const lowerCaseQuery = query.toLowerCase();

    // If the query is empty, revert to the original data
    const filteredResults = lowerCaseQuery
      ? originalData.filter((expense) =>
          expense.category.toLowerCase().includes(lowerCaseQuery) ||
          expense.description.toLowerCase().includes(lowerCaseQuery)
        )
      : originalData;

    // Update the filtered data in the state
    setExpenseData([...filteredResults]); // Make sure to create a new array to trigger re-render
  }, 300); // Adjust the debounce delay as needed

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by Category or Description"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      <div>
        <label>By Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      {expenseData.length > 0 && (
        <div>
          <h2>Expense Data for {selectedMonth}</h2>
          <table>
            <thead>
              <tr>
                <th>EID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Approved Date</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {expenseData.map((expense) => (
                <tr key={expense._id}>
                  <td>{expense.eid}</td>
                  <td>{expense.date.substring(0, 10)}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.status}</td>
                  <td>{expense.approvedDate.substring(0, 10)}</td>
                  <td>{expense.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseReport;
