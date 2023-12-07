import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
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
      <div className={`Slider-container ${collapsed ? 'collapsed' : ''}`}>
        <Sidebar rootStyles={{ backgroundColor: '#0b2a49' }} className="slider" collapsed={collapsed}>
          <Menu>
            <MenuItem
              className={`menu1 ${selectedMenuItem === 'menu' ? 'active' : ''}`}
              icon={<MenuRoundedIcon />}
              onClick={() => handleMenuClick('menu')}
            >
              <h2>MENU</h2>
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'dashboard' ? 'active' : ''}`}
              icon={<GridViewRoundedIcon />}
              onClick={() => handleMenuClick('dashboard')}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'createExpense' ? 'active' : ''}`}
              icon={<ReceiptRoundedIcon />}
              onClick={() => handleMenuClick('createExpense')}
            >
              Create Expense 
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'EditableExpensesForm' ? 'active' : ''}`}
              icon={<SaveIcon/>}
              onClick={() => handleMenuClick('EditableExpensesForm')}
            >
              Saved Expense 
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'expenseReport' ? 'active' : ''}`}
              icon={<MonetizationOnRoundedIcon />}
              onClick={() => handleMenuClick('expenseReport')}
            >
              Expense Report
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'ApprovalForm' ? 'active' : ''}`}
              icon={<MonetizationOnRoundedIcon />}
              onClick={() => handleMenuClick('ApprovalForm')}
            >
              Expense Approval
            </MenuItem>
            <MenuItem
              className={` ${selectedMenuItem === 'logout' ? 'active' : ''}`}
              icon={<LogoutRoundedIcon />}
              onClick={() => handleMenuClick('logout')}
            >
              Logout
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
      <div className="Card-container">
        <div className='card'>{renderSelectedComponent()}</div>
      </div>
    </div>
  );
};

export default Slider;
