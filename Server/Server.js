const express =  require('express');
const app = express()
const cors=require('cors')
const bodyParser=require('body-parser');


const nodemailer = require('nodemailer');

app.use(cors())
app.use(express.json())//middleware
const path = require('path');
const multer=require('multer');
const DB_URI="mongodb+srv://saikandula9278:ZPWADmVgFVdYYV0d@rhym-portal.ehvrq7e.mongodb.net/Rhym"
const mongoose=require('mongoose')
const PORT = process.env.PORT || 8000;

mongoose.connect(DB_URI).then((e)=>console.log("mongodb connected ")).catch((e)=>console.log(e))
// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },                                                                                                                                                                                                                                                                                                                  
  filename: function (req, file, cb) {
    const timestamp = Date.now(); // Get the current timestamp
    const originalName = path.parse(file.originalname).name; // Extract the original filename without extension
    const newFilename = `${originalName}-${timestamp}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

//gamilcode 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply8985@gmail.com',
    pass: 'snji zibr osxc nypj',
  },
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const verificationCodes = {};

app.post('/send-verification-code', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User Not Found');
    }
    const verificationCode = generateVerificationCode();
    verificationCodes[email] = verificationCode;

    const mailOptions = {
      from: 'noreply8985@gmail.com',
      to: email,
      subject: 'Forgot Password Verification Code',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Verification code sent successfully');
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).send( {error : 'Error sending verification code' } );
  }
});


app.post('/verify-code', (req, res) => {
  const { email, code } = req.body;

  if (verificationCodes[email] && verificationCodes[email] == code) {
    delete verificationCodes[email];
    res.status(200).send('Verification successful');
  } else {
    res.status(400).send('Invalid verification code');
  }
});

// const bcrypt = require('bcryptjs');

app.post('/change-password', async (req, res) => {
  try { 
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).send('Email and new password are required');
    }

    // Assume you have a MongoDB model named `User` with a field `password`
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User Not Found');
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);

    // Update the password
    user.password = hashedPassword;

    await user.save();

    res.status(200).send('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Error changing password');
  }
});






// login page code
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  role: String,
})
const User = mongoose.model('User', UserSchema);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.post('/register', async (req, res) => {
  const { email, password, username, role} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, username, role });
  await user.save();
  res.send({ message: 'Registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
  res.send({ token, role: user.role});
});

// app.get('/getRegisteredEmails', async (req, res) => {
//   try {
//     const users = await User.find({}, 'email' , 'role'); // Query the database for all registered users and select only the 'email' field
//     const emails = users.map(user => user.email, user.role); // Extract email addresses from the user objects
//     res.json(emails); // Send the list of email addresses as a JSON response
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'An error occurred while fetching registered emails' });
//   }
// });


app.get('/getRegisteredEmails', async (req, res) => {
  try {
    const users = await User.find({}, 'email role'); // Query the database for all registered users and select 'email' and 'role' fields
    const emailsAndRoles = users.map(user => ({ email: user.email, role: user.role })); // Extract email addresses and roles from the user objects
    res.json(emailsAndRoles); // Send the list of email addresses and roles as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while fetching registered emails' });
  }
});




app.delete('/deleteRegisteredEmail/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ error: 'Email not found' });
    }

    await User.deleteOne({ _id: user._id }); // Delete the user with the specified email
    res.send({ message: 'Registered email deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred while deleting the registered email' });
  }
});


const upload = multer({ storage: storage });

// Define schema for files
const fileSchema = new mongoose.Schema({
  filePath: String,
});

const File = mongoose.model('File', fileSchema);



    
  const expenseSchema = new mongoose.Schema({
    
      eid: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true 
    },
    amount: {
      type: Number,
      required: true,
    },
     date: {
      type: Date,
      required: true,
    },
    receipt: {
     type: String
    },
    status:
    {
      type: String,
      default: 'unsaved'
    },
    reason:
    {
      type: String,
      default: ''
    },
    approvedDate:
    {
      type: Date,
      default: Date.now,
    },
    approvedBy:
    {
      type: String,
      default: ''
    },
    uid:
    {
      type: String
    }
    
 
  
  });
  
  
  const Expense = mongoose.model('Expense', expenseSchema);
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


  app.post('/upload-expenses', upload.array('receipts', 100), async (req, res) => {
    const { v4: uuidv4 } = require('uuid');
    try {
      const expenseData = JSON.parse(req.body.expenses);
      const action = req.body.action; // New field to determine the action
  
      // Save each resume file to MongoDB and get the URLs
      const receiptPaths = req.files.map(file => `uploads/${file.filename}`);
  
      // Save student details to MongoDB
      const uidGenerator = uuidv4;
      const expenses = expenseData.map((expense, index) => ({
        eid: expense.eid,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        receipt: receiptPaths[index],
        uid: uidGenerator(),
      }));
  
      const savedExpenses = await Expense.insertMany(expenses);
  
      if (action === 'save') {
        // Update the status of expenses to 'saved'
        await Expense.updateMany({ _id: { $in: savedExpenses.map(expense => expense._id) } }, { $set: { status: 'saved' } });
      } else if (action === 'submit') {
        // Update the status of expenses to 'submitted for approval'
        await Expense.updateMany({ _id: { $in: savedExpenses.map(expense => expense._id) } }, { $set: { status: 'submitted for approval' } });
      }
  
      res.status(201).json({ message: 'Expenses uploaded successfully', students: savedExpenses });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/upsert-multiple-expenses', async (req, res) => {
    try {
      const { v4: uuidv4 } = require('uuid');
      const expensesData = req.body.expenses;
      const action = req.body.action; 
  
      const updatedExpenses = [];
      const newExpenses = [];
  
      for (const expenseData of expensesData) {
        // Check if the expense already exists based on the unique identifier (uid)
        const existingExpense = await Expense.findOne({ uid: expenseData.uid });
  
        if (existingExpense) {
          // Update the existing expense
          const updatedExpense = await Expense.findOneAndUpdate(
            { uid: expenseData.uid },
            { $set: { ...expenseData } },
            { new: true } // Return the updated document
          );
          updatedExpenses.push(updatedExpense);
        } else {
          // Insert a new expense with a new uid if it doesn't exist
          const newExpense = {
            uid: uuidv4(),
            ...expenseData,
          };
          const insertedExpense = await Expense.create(newExpense);
          newExpenses.push(insertedExpense);
        }
      }
  
      // Handle the action
      if (action === 'save') {
        // Update the status of expenses to 'saved'
        await Expense.updateMany({ _id: { $in: updatedExpenses.map(expense => expense._id) } }, { $set: { status: 'saved' } });
      } else if (action === 'submit') {
        // Update the status of expenses to 'submitted for approval'
        await Expense.updateMany({ _id: { $in: updatedExpenses.map(expense => expense._id) } }, { $set: { status: 'submitted for approval' } });
      }
  
      res.status(200).json({
        message: 'Expenses inserted/updated successfully',
        updatedExpenses,
        newExpenses,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/fetch-saved-expenses', async (req, res) => {
    try {
      const savedExpenses = await Expense.find({ status: 'saved' });
      res.status(200).json(savedExpenses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
app.get('/getSubmittedExpenses', async (req, res) => {
  try {
    const submittedExpenses = await Expense.find({ status: 'submitted for approval' });
    res.status(200).json(submittedExpenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.put('/updateStatus', async (req, res) => {
  try {
    const { expenseUpdates } = req.body;

    // Iterate through each expense update
    for (const update of expenseUpdates) {
      const { expenseId, action, reason } = update;

      // Validate that the action is either 'approve' or 'reject'
      if (action !== 'approve' && action !== 'reject') {
        return res.status(400).json({ error: 'Invalid action' });
      }

      // Determine the status based on the action
      const status = action === 'approve' ? 'approved' : 'rejected';

      // Create an object to update
      const updateObj = { $set: { status } };

      // If action is 'reject', add the reason to the update object
      if (action === 'reject') {
        updateObj.$set.reason = reason;
      }
      if (action === 'approve') {
        updateObj.$set.approvedDate = new Date().toISOString().slice(0, 10);
      }

      // Update the status of the individual expense
      await Expense.updateOne({ _id: expenseId }, updateObj);
    }

    res.status(200).json({ message: 'Expenses updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/searchExpenses', async (req, res) => {
  try {
    const { searchQuery } = req.query;

    const approvedRecords = await Expense.find({
      status: 'approved',
      $or: [
        { category: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive search for category
        { description: { $regex: new RegExp(searchQuery, 'i') } }, // Case-insensitive search for description
      ],
    });

    res.status(200).json(approvedRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getApprovedRecordsByMonth', async (req, res) => {
  try {
    const moment=require('moment')
    const { selectedMonth } = req.query;

    const approvedRecords = await Expense.find({
      status: 'approved',
      date: {
        $gte: new Date(moment(selectedMonth).startOf('month')),
        $lte: new Date(moment(selectedMonth).endOf('month')),
      },
    });

    res.status(200).json(approvedRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/currentMonthCosts', async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; 
    const totalCosts = await Expense.aggregate([
      {
        $match: {
          status: 'approved',
          $expr: {
            $eq: [{ $month: '$date' }, currentMonth],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    if (totalCosts.length > 0) {
      res.status(200).json({ totalCosts: totalCosts[0].total });
    } else {
      res.status(200).json({ totalCosts: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/lastMonthCosts', async (req, res) => {
  try {
    const currentDate = new Date();
   const currentMonth = currentDate.getMonth() + 1; 
   const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const totalCosts = await Expense.aggregate([
      {
        $match: {
          status: 'approved',
          $expr: {
            $and: [
              { $eq: [{ $year: '$date' }, lastYear] },
              { $eq: [{ $month: '$date' }, lastMonth] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    if (totalCosts.length > 0) {
      res.status(200).json({ totalCosts: totalCosts[0].total });
    } else {
      res.status(200).json({ totalCosts: 0 });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getExpenseDataMonthwise', async (req, res) => {
  try {
    const moment = require('moment');
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();
    const expenseData = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-${currentMonth}-01`),
            $lt: new Date(moment(`${currentYear}-${currentMonth}-01`).endOf('month')),
          },
          status: 'approved',
        },
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    res.status(200).json(expenseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getExpenseStatusCount', async (req, res) => {
  try {
    const moment = require('moment');
    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    const expenseStatusCount = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-${currentMonth}-01`),
            $lt: new Date(moment(`${currentYear}-${currentMonth}-01`).endOf('month')),
          },
          status: { $in: ['approved', 'rejected', 'submitted for approval'] },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$status', 'submitted for approval'] },
              then: 'pending', // Display as 'pending'
              else: '$status', // Keep other statuses unchanged
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          color: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'approved'] }, then: 'green' },
                { case: { $eq: ['$_id', 'rejected'] }, then: 'red' },
                { case: { $eq: ['$_id', 'pending'] }, then: 'orange' },
              ],
              default: 'gray',
            },
          },
        },
      },
    ]);

    res.status(200).json(expenseStatusCount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getApprovedExpensesLast3Months', async (req, res) => {
  try {
    const moment = require('moment');

    const currentMonth = moment().month() + 1;
    const currentYear = moment().year();

    const approvedExpensesLast3Months = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: moment().subtract(3, 'months').startOf('month').toDate(),
            $lte: moment().endOf('month').toDate(),
          },
          status: 'approved',
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%mm-%Y',
              date: '$date',
            },
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: {
          '_id': -1, // Sort in ascending order
        },
      },
    ]);

    res.status(200).json(approvedExpensesLast3Months);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/getListOfMonths', async (req, res) => {
  try {
    const moment=require('moment')
    const oldestExpense = await Expense.findOne({ status:'approved'}, {}, { sort: { date: 1 } });
    const newestExpense = await Expense.findOne({ status:'approved'}, {}, { sort: { date: -1 } });
      console.log(oldestExpense)
      console.log(newestExpense)
   
    const startMonth = oldestExpense ? moment(oldestExpense.date).startOf('month') : moment().startOf('month');

    
    const endMonth = newestExpense ? moment(newestExpense.date).startOf('month') : moment().startOf('month');

    const generateMonthsList = () => {
      const monthsList = [];
      let current = startMonth.clone();

      while (current.isSameOrBefore(endMonth, 'month')) {
        monthsList.push(current.format('MMMM-YYYY'));
        current.add(1, 'month');
      }

      return monthsList;
    };

    const listOfMonths = generateMonthsList();

    res.json(listOfMonths);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getExpenseSummaryByCategory', async (req, res) => {
  try {
    const moment = require('moment');

    const getMonthYearString = (date) => moment(date).format('MMMM-YYYY');

    const expenses = await Expense.find().lean();
    const approvedExpenses = await Expense.find({ status: 'approved' }).lean();
    const summary = expenses.reduce((acc, expense) => {
      const monthYear = getMonthYearString(expense.date);
      const category = expense.category;
      const status = expense.status || 'pending';
      const amount = expense.amount || 0;

      // Initialize counters for the month if not present
      acc[monthYear] = acc[monthYear] || { categories: {}, counts: { approved: 0, rejected: 0, pending: 0 } };
      acc[monthYear].categories[category] = acc[monthYear].categories[category] || { approved: 0, rejected: 0, pending: 0, amount: 0 };

      // Accumulate amounts based on status
      acc[monthYear].categories[category][status]++;
      acc[monthYear].categories[category].amount += amount;
      acc[monthYear].counts[status]++;
      acc[monthYear].counts.amount += amount;

      return acc;
    }, {});

    // Convert the summary into the desired format
    const result = Object.entries(summary).reduce((formattedResult, [monthYear, data]) => {
      formattedResult[monthYear] = {
        ...Object.entries(data.categories).reduce((categoryResult, [category, counts]) => {
          // Include amounts for all categories
          categoryResult[category] = counts.amount;
          return categoryResult;
        }, {}),
        pending: data.counts.pending,
        approved: data.counts.approved,
        rejected: data.counts.rejected,
      };
      return formattedResult;
    }, {});

    res.json(result);
  } catch (error) {
    console.error('Error fetching expense summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


   

