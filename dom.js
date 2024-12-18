const getSubmitBtn = document.getElementById("submit-btn");
const getTableBody = document.getElementById("table-body");

// Var
let isEdit = false;
const existingStudentIds = [];
let currentEditingRow = null;

getSubmitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log('isEdit', isEdit)
    if (isEdit) {
        updateStudent();
    } else {
        addNewStudent();
    }
});



function addNewStudent() {
    const name = document.getElementById("name")
    const studentId = document.getElementById("studentId")
    const email = document.getElementById("email")
    const mobileNumber = document.getElementById("mobile")

    if (!name.value || !studentId.value || !email.value || !mobileNumber.value) {
        alert("Please fill all the details");
        return;
    }

    if (!validateInputs(name.value, studentId.value, email.value, mobileNumber.value)) {
        return;
    }

    if (existingStudentIds.includes(studentId.value)) {
        alert("Student ID must be unique. Please use a different ID.");
        return;
    }

    existingStudentIds.push(studentId.value);

    const tableRow = document.createElement("tr");
    tableRow.classList = `student-${studentId.value}`;

    tableRow.innerHTML = `
        <td class="name">${name.value}</td>
        <td class="student-id">${studentId.value}</td>
        <td class="email">${email.value}</td>
        <td class="mobile">${mobileNumber.value}</td>
        <td class="action-col">
            <button class="edit-btn">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn">
                <i class="fas fa-trash-alt"></i> Delete
            </button>
        </td>
    `;

    name.value = "";
    studentId.value = "";
    email.value = "";
    mobileNumber.value = "";

    // Append the new row to the table body
    getTableBody.appendChild(tableRow);

    const delBtn = tableRow.querySelector(".delete-btn");
    delBtn.addEventListener("click", () => deleteFun(tableRow));

    const editBtn = tableRow.querySelector(".edit-btn");
    // before we update we need to re fill the input with existing row data
    editBtn.addEventListener("click", () => fillFormInput(tableRow));
    saveToLocalStorage()
}

function deleteFun(row) {
    // Remove selected id from the array
    const inputName = document.getElementById('name')
    const inputId = document.getElementById('studentId')
    const inputEmail = document.getElementById('email')
    const inputMobile = document.getElementById('mobile');

    const studentId = row.querySelector(".student-id").textContent;

    const index = existingStudentIds.indexOf(studentId);
    if (index > -1) {
        existingStudentIds.splice(index, 1);
    }

    // Remove the row from the table
    row.remove();
    saveToLocalStorage();
    inputName.value = "";
    inputId.value = "";
    inputEmail.value = "";
    inputMobile.value = "";

    currentEditingRow = null;
    isEdit = false;
    inputId.disabled = false;
    getSubmitBtn.textContent = "Add New Student";
}

function fillFormInput(row) {
    // taking current row data to re fill in input fields
    const name = row.querySelector(".name").textContent;
    const studentId = row.querySelector(".student-id").textContent;
    const email = row.querySelector(".email").textContent;
    const mobile = row.querySelector(".mobile").textContent;

    const inputName = document.getElementById('name')
    const inputId = document.getElementById('studentId')
    const inputEmail = document.getElementById('email')
    const inputMobile = document.getElementById('mobile');

    // assigning existing row data to our form
    inputName.value = name;
    inputId.value = studentId;
    inputEmail.value = email;
    inputMobile.value = mobile;

    getSubmitBtn.textContent = "Update Student";
    inputId.disabled = true;
    currentEditingRow = row;
    isEdit = true;
}

function updateStudent() {
    const inputName = document.getElementById('name')
    const inputId = document.getElementById('studentId')
    const inputEmail = document.getElementById('email')
    const inputMobile = document.getElementById('mobile');

    // Checking for empty field
    if (!inputName.value || !inputId.value || !inputEmail.value || !inputMobile.value) {
        alert("Please fill all the details");
        return;
    }
    // validate
    if (!validateInputs(inputName.value, inputId.value, inputEmail.value, inputMobile.value)) {
        return;
    }

    // getting all table data from current table row 
    const cells = currentEditingRow.getElementsByTagName("td");
    // update row data with new data
    cells[0].textContent = inputName.value;
    cells[2].textContent = inputEmail.value;
    cells[3].textContent = inputMobile.value;

    // Empty input fields
    inputName.value = "";
    inputId.value = "";
    inputEmail.value = "";
    inputMobile.value = "";

    // reset field
    currentEditingRow = null;
    isEdit = false;
    inputId.disabled = false;
    getSubmitBtn.textContent = "Add New Student";
    saveToLocalStorage()
}

// Save the table data to localStorage
function saveToLocalStorage() {
    // get from table row
    const rows = Array.from(getTableBody.getElementsByTagName("tr"));
    const students = rows.map(row => {
        const cells = row.getElementsByTagName("td");
        // extract values and save to localstorage
        return {
            name: cells[0].textContent,
            id: cells[1].textContent,
            email: cells[2].textContent,
            mobile: cells[3].textContent
        };
    });
    // save to Local storage
    localStorage.setItem("students", JSON.stringify(students));
}

function loanFromLocalStorage() {
    const getTableBody = document.getElementById("table-body");
    const students = JSON.parse(localStorage.getItem("students"));

    students.forEach((item) => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td class="name">${item.name}</td>
                <td class="student-id">${item.id}</td>
                <td class="email">${item.email}</td>
                <td class="mobile">${item.mobile}</td>
                <td class="action-col">
                    <button class="edit-btn">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
            </td>
        `
        const editBtn = tableRow.querySelector(".edit-btn");
        editBtn.addEventListener("click", () => fillFormInput(tableRow))

        const delBtn = tableRow.querySelector(".delete-btn");
        delBtn.addEventListener("click", () => deleteFun(tableRow));

        getTableBody.appendChild(tableRow);
    })
}

function validateInputs(name, id, email, mobile) {
    // Validate name (only alphabetic characters)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!name || !nameRegex.test(name)) {
        alert("Name should contain only letters and spaces.");
        return false;
    }

    // Validate student ID (must be numeric)
    if (!id || isNaN(id)) {
        alert("Student ID must be a numeric value.");
        return false;
    }

    // Validate email (using email regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    // Validate mobile (must be numeric and 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobile || !mobileRegex.test(mobile)) {
        alert("Contact number must be a 10-digit numeric value.");
        return false;
    }

    return true;
}


document.addEventListener("DOMContentLoaded", loanFromLocalStorage)