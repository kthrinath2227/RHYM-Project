import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const EditableExpensesForm = () => {
  const [savedExpenses, setSavedExpenses] = useState([]);
  const [editedExpenses, setEditedExpenses] = useState([]);

  useEffect(() => {
    const fetchSavedExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/fetch-saved-expenses');
        const expensesWithFormattedDate = response.data.map(expense => ({
          ...expense,
          date: moment(expense.date).format('YYYY-MM-DD'),
        }));
        setSavedExpenses(expensesWithFormattedDate);
        // Initialize edited expenses with the fetched data
        setEditedExpenses(expensesWithFormattedDate.map(expense => ({ ...expense })));
      } catch (error) {
        console.error('Error fetching saved expenses:', error);
      }
    };

    fetchSavedExpenses();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedExpenses = [...editedExpenses];
    updatedExpenses[index][field] = value;
    setEditedExpenses(updatedExpenses);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post('http://localhost:8000/upsert-multiple-expenses', {
        expenses: editedExpenses,
        action: 'save',
      });

      console.log(response.data); // Handle the response as needed

      // Update the status of all edited expenses to 'saved'
      setEditedExpenses(editedExpenses.map(expense => ({ ...expense, status: 'saved' })));
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      const response = await axios.post('http://localhost:8000/upsert-multiple-expenses', {
        expenses: editedExpenses,
        action: 'submit',
      });

      console.log(response.data); // Handle the response as needed

      // Update the status of all edited expenses to 'submitted for approval'
      setEditedExpenses(editedExpenses.map(expense => ({ ...expense, status: 'submitted for approval' })));
    } catch (error) {
      console.error('Error submitting for approval:', error);
    }
  };

  const handleDiscardChanges = () => {
    // Reset edited expenses to the original saved state
    setEditedExpenses(savedExpenses.map(expense => ({ ...expense })));
  };

  return (
    <div>
      <h2>Saved Expenses</h2>
      {editedExpenses.map((expense, index) => (
        <div key={index}>
          <label>
            EID:
            <input type="text" value={expense.eid} onChange={(e) => handleInputChange(index, 'eid', e.target.value)} />
          </label>
          <br />
          <label>
            Category:
            <input type="text" value={expense.category} onChange={(e) => handleInputChange(index, 'category', e.target.value)} />
          </label>
          <br />
          <label>
            Description:
            <input type="text" value={expense.description} onChange={(e) => handleInputChange(index, 'description', e.target.value)} />
          </label>
          <br />
          <label>
            Amount:
            <input type="number" value={expense.amount} onChange={(e) => handleInputChange(index, 'amount', e.target.value)} />
          </label>
          <br />
          <label>
            Date:
            <input type="date" value={expense.date} onChange={(e) => handleInputChange(index, 'date', e.target.value)} />
          </label>
          <br />
          <label>
            Receipt:
            <input type="text" value={expense.receipt} onChange={(e) => handleInputChange(index, 'receipt', e.target.value)} />
          </label>
          <hr />
        </div>
      ))}

      <h2>Actions</h2>
      <button onClick={handleSaveChanges}>Save</button>
      <button onClick={handleSubmitForApproval}>Submit for Approval</button>
      <button onClick={handleDiscardChanges}>Discard</button>
    </div>
  );
};

export default EditableExpensesForm;