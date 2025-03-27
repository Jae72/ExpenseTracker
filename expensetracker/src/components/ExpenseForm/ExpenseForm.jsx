import React, {useEffect, useState} from "react"
import './ExpenseForm.css';
import { saveExpense, updateExpense } from '../../firebase';
import Swal from 'sweetalert2'
//import withReactContent from 'sweetalert2-react-content'


const ExpenseForm = ({ fetchExpenses, isEditing, setIsEditing, setRecentExpense }) => {
    // store item name and price in state and set it to empty in the beginning
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
      // if editing, set price, category and date
      if (isEditing) {
        setCategory(isEditing.category);
        setPrice(isEditing.price);
        setDate(isEditing.date);
      }
    }, [isEditing])


    // this function will execute when user changes category of expense
    const onUserChangeCategory = (event) => {
      // event.target.value is the selected value, for example grocery
      setCategory(event.target.value);
    }

    // this function will execute when user changes the date of expense 
    const onUserChangeDate = (event) => {
      // event.target.value is the selected date in format like YYYY-MM-DD
      setDate(event.target.value);
      console.log(event.target.value)
    }

    // when user clicks the submit button to add expense
    const onUserClickSubmit = async () => {
      // check if category, date and price are valid
      if (category.length === 0 && date.length === 0 && price.length === 0) {
        Swal.fire({
          icon:'error',
          title: 'Empty Fields',
          text: 'Error! You did not enter the category, date and total amount for the expense',
          confirmButtonText: 'Okay'
        })
        return
      }
      // check if category is missing
      if (category.length === 0) {
        Swal.fire({
          icon:'error',
          title: 'No Category Selected',
          text: 'Error! You did not choose a category for the expense!',
          confirmButtonText: 'Okay'
        })
        return
      }

      // check if date is missing
      if (date.length === 0) {
        Swal.fire({
          icon:'error',
          title: 'No Date Selected',
          text: 'Error! You did not choose a date for the expense!',
          confirmButtonText: 'Okay'
        })
        return
      }


      // check if item price is missing
      if (price.length === 0) {
        Swal.fire({
          icon:'error',
          title: 'No Price Entered',
          text: 'Error! You did not enter the total amount for the expense!',
          confirmButtonText: 'Okay'
        })
        return
      }

      // check if price is not a number
      if (isNaN(price)) {
        Swal.fire({
          icon:'error',
          title: 'Invalid Total Amount',
          text: 'Error! Total amount must be a number!',
          confirmButtonText: 'Okay'
        })
        return
      }

      // check if price is between our range 1-10000
      if (price < 1 || price > 10000) {
        Swal.fire({
          icon:'error',
          title: 'Invalid Total Amount',
          text: 'Error! Total amount must be between 1 and 10000!',
          confirmButtonText: 'Okay'
        })
        return
      }

      if (isEditing) {
        // if user is editing, then edit the existing expense
        await updateExpense({ ...isEditing, price, date, category });
        setIsEditing(null);
        fetchExpenses();
        setPrice('');
        setCategory('');
        setDate('');
        setRecentExpense(isEditing.id)
      } else {
        // add new expense
        // when user successfully entered category, date and price, save to Database and show message
        // catch the expense into 'exp' variable to use it to highlight recent expense
        const exp = await saveExpense(category, price, date);
        fetchExpenses();
        setPrice('');
        setCategory('');
        setDate('');
        // set the expense id of the newly created expense to the recent expense
        setRecentExpense(exp.id)
      }
    }

    return(
      <div className="form-background">
        <label className="label title">ADD EXPENSE</label>
        <label className="label">Date</label>
        <input className="expense-input" value={date} onChange={onUserChangeDate} type="date"></input>
        <label className="label">Category</label>
        <select onChange={onUserChangeCategory} value={category} className="expense-input" name="category">
          <option value="">Select category</option>
          <option value="grocery">Grocery</option>
          <option value="gasoline">Gasoline</option>
          <option value="bill">Bill</option>
          <option value="utilities">Utilities</option>
          <option value="internet">Internet</option>
          <option value="rent/mortgage">Rent/Mortgage</option>
          <option value="public transport">Public Transport</option>
          <option value="auto insurance">Auto Insurance</option>
          <option value="healthcare">Healthcare</option>
          <option value="entertainment">Entertainment</option>
          <option value="education">Education</option>
          <option value="restaurant">Restaurant</option>
          <option value="miscellaneous">Miscellaneous</option>
        </select>
        <label className="label">Total Amount</label>
        <input className="expense-input" placeholder="$..." value={price} onChange={(e) => setPrice(e.target.value)}></input>
        <div id="submit-container">
          <button className="expense-submit-button" onClick={onUserClickSubmit}>{isEditing ? 'Update' : 'Add'}</button>
        </div>
        
      </div>  
    )
}

export default ExpenseForm;