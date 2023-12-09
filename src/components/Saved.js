import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { DataGrid,  GridActionsCellItem } from '@mui/x-data-grid';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardHeader, Divider} from '@mui/material';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import FactCheckIcon from '@mui/icons-material/FactCheck';








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
    <Card style={{width:'89vw',  padding:"10px"}}>
      <CardHeader title={
          <React.Fragment>
            <FactCheckIcon  style={{ fontSize: '40px',position:'relative',top:'1vh' }}/> 
            Saved Expenses
          </React.Fragment> 
      }/>
      <Divider/>
      <div>
    
      <div style={{ height: 400, widhth:'85vw', marginBottom:'20px' }}>
      <DataGrid style={{ }}
    rows={editedExpenses}
      columns={[
    { field: 'eid', headerName: 'EID', width: 100, editable: true },
    { field: 'category', headerName: 'Category', width: 150, editable: true },
    { field: 'description', headerName: 'Description', width: 200, editable: true },
    { field: 'amount', headerName: 'Amount', width: 120, editable: true },
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 120,
      editable: true,
      valueGetter: (params) => new Date(params.row.date),
    },
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
  getRowId={(row) => row._id}
/>
      </div>
      <div>
        {/* <button onClick={handleAddRecord}>Add Record</button> */}
        <Button style={{marginRight:"20px", textAlign:"center"}} variant="contained" color="success" size="medium" type="button" onClick={handleSaveChanges}>
          <SaveIcon style={{height:"1.5vh" , marginRight:'5px'}}/> Save
        </Button>
        <Button style={{marginRight:"20px"}} variant="contained" color="error" size="medium" type="button" onClick={handleDiscardChanges}>
       <CancelIcon style={{height:"1.5vh" , marginRight:'5px'}}/> Cancel
        </Button>
        <Button style={{marginRight:"20px"}} variant="contained" color="secondary" size="medium" type="button"  onClick={handleSubmitForApproval}>
         <TurnedInNotIcon style={{height:"1.5vh" , marginRight:'5px'}}/> Submit
        </Button>
      </div>
    </div>
    </Card>
  );
};

export default EditableExpensesForm;
