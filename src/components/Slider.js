import React, { useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Dashboard from './Dashboard';
import ExpenseForm from './CreateExp';
import ExpenseReport from './ExpenseReport2';
import ApprovalForm from './ExpenseApproval';
import EditableExpensesForm from './Saved';
import SaveIcon from '@mui/icons-material/Save';
import Login from './components/login';



const Slider = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setCollapsed(!collapsed);
  };
  const renderSelectedComponent = () => {
    switch (selectedMenuItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'createExpense':
        return <ExpenseForm />;
      case 'EditableExpensesForm':
        return <EditableExpensesForm/>;
      case 'expenseReport':
        return <ExpenseReport />;
      case 'ApprovalForm':
        return <ApprovalForm />;
      default:
        return <Dashboard />;
    }
  };
  



  return (
    <div className="Container">
        <div className={`slider ${collapsed ? 'collapsed' : ''}`}>
          <div className={`menu1 ${selectedMenuItem === 'menu' ? 'active' : ''}`} onClick={() => handleMenuClick('menu')}> 
              <MenuRoundedIcon style={{marginRight:"10px"}} className={`${collapsed ? 'icon' : ''}`}/> <h3> Menu</h3>
          </div>
          <div className={`menu1 ${selectedMenuItem === 'dashboard' ? 'active' : ''}`}  onClick={() => handleMenuClick('dashboard')}>
            <GridViewRoundedIcon style={{marginRight:"10px"}} className={` ${collapsed ? 'icon' : ''}`} /> Dashboard 
          </div>
          <div  className={`menu1 ${selectedMenuItem === 'createExpense' ? 'active' : ''}`} onClick={() => handleMenuClick('createExpense')}> 
            <ReceiptRoundedIcon style={{marginRight:"10px"}} className={` ${collapsed ? 'icon' : ''}`}/> Create Expense

          </div>
          <div className={`menu1 ${selectedMenuItem === 'EditableExpensesForm' ? 'active' : ''}`}onClick={() => handleMenuClick('EditableExpensesForm')}>
            <SaveIcon style={{marginRight:"10px"}} className={`${collapsed ? 'icon' : ''}`}/> Saved Expense 
          </div>
          <div className={`menu1 ${selectedMenuItem === 'expenseReport' ? 'active' : ''}`} onClick={() => handleMenuClick('expenseReport')}>
            <MonetizationOnRoundedIcon style={{marginRight:"10px"}} className={` ${collapsed ? 'icon' : ''}`} /> Expense Report
          </div>
          <div    className={`menu1 ${selectedMenuItem === 'ApprovalForm' ? 'active' : ''}`} onClick={() => handleMenuClick('ApprovalForm')}>
            <MonetizationOnRoundedIcon style={{marginRight:"10px"}} className={` ${collapsed ? 'icon' : ''}`} />  Expense Approval
          </div>
          {/* <div  className={`menu1 ${selectedMenuItem === 'logout' ? 'active' : ''}`} onClick={() => handleMenuClick('logout')}>
            <LogoutRoundedIcon style={{marginRight:"10px"}} className={` ${collapsed ? 'icon' : ''}`}/> Logout

          </div> */}
        </div>
        
      <div className="Card-container">
        <div className='card'>{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default Slider;
