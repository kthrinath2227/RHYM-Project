import React, { useState } from 'react';
import axios from 'axios';
import { TextField } from '@mui/material';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 




const CreateExpense = () => {
  const [expenses, setExpenses] = useState([
    {
      eid: '',
      category: '',
      description: '',
      amount: 0,
      date: '',
      receipt: null,
    },
  ]);
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
 

  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedExpenses = [...expenses];
  //   updatedExpenses[index][name] = value;
  //   setExpenses(updatedExpenses);
  // };
  const handleInputChange = (e, index) => {
    if (e && e.target) {
      const { name, value } = e.target;
      const updatedExpenses = [...expenses];
      updatedExpenses[index][name] = value;
      setExpenses(updatedExpenses);
    }
  };
  

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedExpenses = [...expenses];
    updatedExpenses[index].receipt = file;
    setExpenses(updatedExpenses);
  };

  const handleAddRow = () => {
    setExpenses([...expenses, { eid: '', category: '', description: '', amount: 0, date: '', receipt: null }]);
  };

  const handleRemoveRow = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  const handleFormSubmit = async (action) => {
    try {
      const formData = new FormData();

      // Convert expenses to a JSON string and append it to formData
      formData.append('expenses', JSON.stringify(expenses));

      // Append the receipt files to formData
      expenses.forEach((expense) => {
        formData.append('receipts', expense.receipt);
      });

      // Add the action field to indicate the desired action
      formData.append('action', action);

      // Make a single POST request to the server with formData
      const response = await axios.post('http://localhost:8000/upload-expenses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);

      // Reset the form after successful submission
      setExpenses([
        {
          eid: '',
          category: '',
          description: '',
          amount: 0,
          date: '',
          receipt: null,
        },
      ]);

      // Reset file input values
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => {
        input.value = ''; // Reset the file input value
      });
    } catch (error) {
      console.error('Error uploading expenses:', error);
    }
  };

  return (
    <div className='Expense-form-container'>
      <h1>Create Expenses</h1>
      {expenses.map((expense, index) => (
        <div className='exp-card' key={index}>
        <TextField style={{marginRight:"20px", width:"15vw"}}
          id="outlined-multiline-flexible"
          label="EID"
          multiline
          maxRows={4}
          name="eid"
          value={expense.eid}
          onChange={(e) => handleInputChange(e, index)}
          required
        />
       
          <TextField
            id="outlined-multiline-flexible"
            style={{marginRight:"20px", width:"15vw"}}
            multiline
            maxRows={4}
            label="Category"
            type="text"
            name="category"
            value={expense.category}
            onChange={(e) => handleInputChange(e, index)}
            required
          />
       
          <TextField
            id="outlined-multiline-flexible"
            style={{marginRight:"20px", width:"15vw"}}
            multiline
            maxRows={4}
            label="Description"
            type="text"
            name="description"
            value={expense.description}
            onChange={(e) => handleInputChange(e, index)}
            required
          />

          <TextField
            id="outlined-multiline-flexible"
          style={{marginRight:"20px", width:"15vw"}}
           multiline
           maxRows={4}
           type="number"
           name="amount"
           value={expense.amount}
           onChange={(e) => handleInputChange(e, index)}
           required
          />
          <DatePicker className="Calander"
            dateFormat="dd/MM/yyyy"  
            placeholderText="DD/MM/YYYY"
            name="date"
            selected={expense.date}  
            onChange={(date) => handleInputChange({ target: { name: 'date', value: date } }, index)}
            />

       
         
          <Button style={{marginRight:"10px", height:"4vh", width:"6.5vw",fontSize:"10px"}} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
                <VisuallyHiddenInput type="file" onChange={(e) => handleFileChange(e, index)} />
          </Button>
         
          {index === expenses.length - 1 && (
            <Fab style={{width:"40px", height:"4vh"}} color="primary" aria-label="add" type="button" onClick={handleAddRow}>
              <AddIcon />
            </Fab>
          )}
          {index !== 0 && (
            <IconButton style={{color:"red"}} aria-label="delete" size="large" type="button" onClick={() => handleRemoveRow(index)}>
                  <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}
      {expenses.length > 0 && (
        <div>
        <Button style={{marginRight:"20px", textAlign:"center"}} variant="contained" color="success" size="small" type="button" onClick={() => handleFormSubmit('save')}>
          <SaveIcon style={{height:"1.5vh"}}/> Save
        </Button>
        <Button style={{marginRight:"20px"}} variant="contained" color="error" size="medium" type="button" onClick={() => setExpenses([{ eid: '', category: '', description: '', amount: 0, date: '', receipt: null }])}>
       <CancelIcon/> Cancel
        </Button>
        <Button style={{marginRight:"20px"}} variant="contained" color="secondary" size="large" type="button"  onClick={() => handleFormSubmit('submit')} >
         <TurnedInNotIcon/> Submit for Approval
        </Button>
      </div>
      )}
      {/* <div>
          <EditableExpensesForm/>
      </div> */}
    </div>
  );
};

export default CreateExpense;
