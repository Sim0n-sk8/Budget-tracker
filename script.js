document.addEventListener("DOMContentLoaded", () => {

    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");
    const totalAmount = document.getElementById("totalAmount");
    const filterCategory = document.getElementById("filterCategory");

    // Initialize expenses from localStorage or empty array
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    // Display saved expenses when the page loads
    displayExpenses(expenses);
    updateTotalAmount();

    expenseForm.addEventListener("submit" , (e) => {
        e.preventDefault();

        const name = document.getElementById("expenseName").value;
        const amount = parseFloat(document.getElementById("expenseAmount").value);
        const category = document.getElementById("expenseCategory").value;
        const date = document.getElementById("expenseDate").value;

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date
        };

        expenses.push(expense);
        saveToLocalStorage();
        displayExpenses(expenses);
        updateTotalAmount();

        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e)=> {
        if(e.target.classList.contains("deleteBtn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            
            saveToLocalStorage();
            displayExpenses(expenses);
            updateTotalAmount();
        }
        
        if(e.target.classList.contains("editBtn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            document.getElementById("expenseName").value = expense.name;
            document.getElementById("expenseAmount").value = expense.amount;
            document.getElementById("expenseDate").value = expense.date;
            document.getElementById("expenseCategory").value = expense.category;

            expenses = expenses.filter(expense => expense.id !== id);
            saveToLocalStorage();
            displayExpenses(expenses);
            updateTotalAmount();
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;

        if(category === "All") {
            displayExpenses(expenses);
        } else {
            const filterExpenses = expenses.filter(expense => 
                expense.category === category);

            displayExpenses(filterExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${expense.name}</td>
            <td>R${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button class="editBtn" data-id="${expense.id}">Edit</button>
                <button class="deleteBtn" data-id="${expense.id}">Delete</button>
            </td>
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }
    
    // Function to save expenses to localStorage
    function saveToLocalStorage() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }
    
    // Add a clear all function
    window.clearAllExpenses = function() {
        if (confirm("Are you sure you want to delete all expenses?")) {
            expenses = [];
            saveToLocalStorage();
            displayExpenses(expenses);
            updateTotalAmount();
        }
    };
});