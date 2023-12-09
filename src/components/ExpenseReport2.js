import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import debounce from 'lodash.debounce';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Card,
  CardHeader,} from '@mui/material';
  import FactCheckIcon from '@mui/icons-material/FactCheck';


const SearchAndFilter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM-YYYY'));
  const [expenseData, setExpenseData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
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
    const filteredResults = lowerCaseQuery
      ? originalData.filter((expense) =>
          expense.category.toLowerCase().includes(lowerCaseQuery) ||
          expense.description.toLowerCase().includes(lowerCaseQuery)
        )
      : originalData;

    setExpenseData([...filteredResults]);
  }, 300);



  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Expense Data for ${selectedMonth}`, 14, 10);
    pdf.autoTable({ html: '#expense-table' });
    pdf.save(`Expense_Data_${selectedMonth}.pdf`);
  };

  return (
   <Card style={{width:'90vw',  padding:"10px"}}>
   <CardHeader title={
          <React.Fragment>
            <FactCheckIcon  style={{ fontSize: '40px',position:'relative',top:'1vh' }}/> 
            Saved Expenses
          </React.Fragment> 
      }/>
     <div className="search-and-filter-container">

      <div className="search-and-filter-controls">
        <TextField
        style={{marginRight:'15px',}}
          type="text"
          label="Search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          label="Select Month"
        >
          <MenuItem value="">Select Month</MenuItem>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </div>
      {expenseData.length > 0 && (
        <Paper style={{width:'88vw', margin:"20px", padding:"10px"}} className="expense-table-paper">
          <h2 className="expense-table-heading">Expense Data for {selectedMonth}</h2>
          <Table  id="expense-table" ref={tableRef}>
            <TableHead style={{background:'black',color:'white'}}>
              <TableRow>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>EID</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Date</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Category</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Description</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Amount</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Status</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Approved Date</TableCell>
                <TableCell  style={{color:'white', whiteSpace: 'nowrap'}}>Approved By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseData.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.eid}</TableCell>
                  <TableCell>{expense.date.substring(0, 10)}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.status}</TableCell>
                  <TableCell>{expense.approvedDate.substring(0, 10)}</TableCell>
                  <TableCell>{expense.approvedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    
      <Button onClick={handleDownloadPDF} variant="contained" color="secondary">
        Download as PDF
      </Button>
    </div>
   </Card>
  );
};

export default SearchAndFilter;