import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { DataGrid, GridToolbarContainer, GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material';
 
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
        setEditedExpenses(expensesWithFormattedDate.map(expense => ({ ...expense })));
      } catch (error) {
        console.error('Error fetching saved expenses:', error);
      }
    };

    fetchSavedExpenses();
  }, []);

  const handleInputChange = (id, field, value) => {
    const updatedExpenses = editedExpenses.map(expense =>
      expense.id === id ? { ...expense, [field]: value } : expense
    );
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

  const handleAddRecord = () => {
    const id = Math.max(...editedExpenses.map(expense => expense.id), 0) + 1;
    setEditedExpenses([...editedExpenses, { id, name: '', age: '', isNew: true }]);
  };

  const handleEditClick = (id) => () => {
    // Implement if needed
  };

  const handleSaveClick = (id) => () => {
    // Implement if needed
  };

  const handleDeleteClick = (id) => () => {
    setEditedExpenses(editedExpenses.filter(expense => expense.id !== id));
  };

  return (
    <div>
      <h2>Saved Expenses</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={editedExpenses}
          columns={[
            { field: 'eid', headerName: 'EID', width: 100, editable: true },
            { field: 'category', headerName: 'Category', width: 150, editable: true },
            { field: 'description', headerName: 'Description', width: 200, editable: true },
            { field: 'amount', headerName: 'Amount', width: 120, editable: true },
            { field: 'date', headerName: 'Date', type: 'date', width: 120, editable: true },
            { field: 'receipt', headerName: 'Receipt', width: 200, editable: true },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 200,
              renderCell: (params) => (
                <>
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={handleSaveClick(params.id)}
                  />
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(params.id)}
                  />
                </>
              ),
            },
          ]}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          onCellEditCommit={(params) =>
            handleInputChange(params.id, params.field, params.props.value)
          }
        />
      </div>
      <div>
        <h2>Actions</h2>
        <button onClick={handleSaveChanges}>Save</button>
        <button onClick={handleSubmitForApproval}>Submit for Approval</button>
        <button onClick={handleDiscardChanges}>Discard</button>
        <button onClick={handleAddRecord}>Add Record</button>
      </div>
    </div>
  );
};

export default EditableExpensesForm;
