import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog,DialogContent, Card,CardHeader,Divider,DialogActions, TextField,Typography, Button,Snackbar,Alert } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Tooltip from '@mui/material/Tooltip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const ApprovalForm = () => {
  const [submittedExpenses, setSubmittedExpenses] = useState([]);
  const [pendingChanges, setPendingChanges] = useState([]);
  const serverURL = 'http://localhost:8000';
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState([]);
  const [thumbsDownClicked, setThumbsDownClicked] = useState([]);

  const handleThumbsUpClick = (index) => {
    // Toggle the clicked status for the thumbs up button
    const updatedThumbsUpClicked = [...thumbsUpClicked];
    updatedThumbsUpClicked[index] = !updatedThumbsUpClicked[index];
    setThumbsUpClicked(updatedThumbsUpClicked);

    // Reset the thumbs down button to its normal color
    const updatedThumbsDownClicked = [...thumbsDownClicked];
    updatedThumbsDownClicked[index] = false;
    setThumbsDownClicked(updatedThumbsDownClicked);

    // Call handleStatusChange with the 'approved' status
    handleStatusChange(index, 'approved');
  };


  const handleThumbsDownClick = (index) => {
    // Toggle the clicked status for the thumbs down button
    const updatedThumbsDownClicked = [...thumbsDownClicked];
    updatedThumbsDownClicked[index] = !updatedThumbsDownClicked[index];
    setThumbsDownClicked(updatedThumbsDownClicked);

    // Reset the thumbs up button to its normal color
    const updatedThumbsUpClicked = [...thumbsUpClicked];
    updatedThumbsUpClicked[index] = false;
    setThumbsUpClicked(updatedThumbsUpClicked);

    // Call handleStatusChange with the 'rejected' status
    handleStatusChange(index, 'rejected');
  };
  
  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  useEffect(() => {
    const fetchSubmittedExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getSubmittedExpenses');
        setSubmittedExpenses(response.data);
        
      } catch (error) {
        console.error('Error fetching submitted expenses:', error);
      }
    };

    fetchSubmittedExpenses();
  }, []);

  const handleStatusChange = (index, newStatus) => {
    const updatedExpenses = [...submittedExpenses];
    updatedExpenses[index].status = newStatus;
    setSubmittedExpenses(updatedExpenses);
  
    const change = {
      expenseId: submittedExpenses[index]._id,
      action: newStatus === 'approved' ? 'approve' : 'reject',
    };

    const updatedChanges = [...pendingChanges];
    const existingChangeIndex = updatedChanges.findIndex((item) => item.expenseId === change.expenseId);

    if (existingChangeIndex !== -1) {
      updatedChanges[existingChangeIndex] = change;
    } else {
      updatedChanges.push(change);
    }

    setPendingChanges(updatedChanges);
  };

  const handleReasonChange = (index, newReason) => {
    const updatedExpenses = [...submittedExpenses];
    updatedExpenses[index].reason = newReason;
    setSubmittedExpenses(updatedExpenses);
  };

  const handleSaveAll = async () => {
    try {
      const payload = pendingChanges.map((change) => ({
        expenseId: change.expenseId,
        action: change.action,
        reason: submittedExpenses.find((expense) => expense._id === change.expenseId)?.reason || '',
      }));
      console.log(payload.data)
      

      const response = await axios.put('http://localhost:8000/updateStatus', { expenseUpdates: payload });

      console.log('Server response:', response.data);
      if(response.data.length===0)
      {
        setSnackbarOpen(true);
        return;
      }
else
{
  setSuccessDialogOpen(true);
  setPendingChanges([]);
}
const updatedResponse = await axios.get('http://localhost:8000/getSubmittedExpenses');
    setSubmittedExpenses(updatedResponse.data);
     
    } catch (error) {
      console.error('Error updating expenses:', error);
    }
  };
  const showSnackbar = () => {
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 5000);
  };

  return (
    <Card className="expense-card" style={{width:'88vw',}}>
      <CardHeader
        title={
          <React.Fragment>
            <FactCheckIcon  style={{ fontSize: '40px',position:'relative',top:'1vh', marginRight:'10px' }}/> 
            Expense Approval
          </React.Fragment>
        }
      />
        <Divider/>
      <div className="container">
      {submittedExpenses && submittedExpenses.length > 0 ? (
        <TableContainer  component={Paper}>
          <Table >
            <TableHead >
              <TableRow>
                <TableCell style={{color:'white', whiteSpace: 'nowrap'}}>EID</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Category</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Description</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Receipt</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Amount</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Date</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Action</TableCell>
                <TableCell style={{color:'white', whiteSpace: 'nowrap',}}>Reason for Rejection</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submittedExpenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.eid}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.category}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.description}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>
                    <a href={`${serverURL}/${expense.receipt}`} target="_blank" rel="noopener noreferrer">
                      View Receipt
                    </a>
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.amount}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>{expense.date.substring(0, 10)}</TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>
                  <Tooltip title="Approve" arrow>
                      <Button onClick={() => handleThumbsUpClick(index)}
                style={{ color: thumbsUpClicked[index] ? 'green' : 'blue' }}>
                        Approve
                      </Button>
                    </Tooltip>
                    <Tooltip title="Reject" arrow>
                      <Button onClick={() => handleThumbsDownClick(index)}
                style={{ color: thumbsDownClicked[index] ? 'red' : 'blue' }}>
                        Reject
                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell style={{ whiteSpace: 'nowrap'}}>
                    {expense.status === 'rejected' && (
                      <TextField
                        type="text"
                        value={expense.reason}
                        onChange={(e) => handleReasonChange(index, e.target.value)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ background: 'blue', color: 'black' }}>
            <TableRow>
            <TableCell style={{color:'white'}}>EID</TableCell>
                <TableCell style={{color:'white'}}>Category</TableCell>
                <TableCell style={{color:'white'}}>Description</TableCell>
                <TableCell style={{color:'white'}}>Receipt</TableCell>
                <TableCell style={{color:'white'}}>Amount</TableCell>
                <TableCell style={{color:'white'}}>Date</TableCell>
                <TableCell style={{color:'white'}}>Action</TableCell>
                <TableCell style={{color:'white'}}>Reason for Rejection</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} align="center">
                <Alert severity="warning" sx={{  color: 'black' }}>
                  No Data Available
                </Alert>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      )}

      {submittedExpenses.length > 0 && (
        <div  style={{ width: '100%',display:'flex',justifyContent:'center'}}>
          <Button style={{background:'blue',color:'white',borderRadius:'50px',margin:'3vh'}}onClick={handleSaveAll}>Save All</Button>
        </div>
      )}
       <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose} maxWidth="xs" fullWidth>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircleIcon style={{ color: 'green', fontSize: '2rem', marginBottom: '1rem' }} />
          <Typography variant="h6" align="center" gutterBottom>
            Success!
          </Typography>
          <Typography variant="body1" align="center">
            Thank you for submitting your responses. The user will be notified about the same.
          </Typography>
        </DialogContent>
        <DialogActions style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
          <Button onClick={handleSuccessDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Alert severity="warning" sx={{ backgroundColor: 'red', color: 'white' }}>
          Incomplete Response
        </Alert>
      </Snackbar>
    </div>
    </Card>
  );
};

export default ApprovalForm;