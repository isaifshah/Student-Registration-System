let submitBtn = document.getElementById("submit");
let currentIndex = null; // Track the index of the student being edited

// Object to store student information
const info = {
    student_name: '',
    student_id: '',
    email_id: '',
    contact_number: ''
};

// Function to collect data from the form
const getData = () => {
    info.student_name = document.getElementById('student-name').value.trim();
    info.student_id = document.getElementById('student-id').value.trim();
    info.email_id = document.getElementById('email-id').value.trim();
    info.contact_number = document.getElementById('contact-number').value.trim();

    // Fetch existing data from localStorage
    let infoItem = localStorage.getItem("infoSection")
        ? JSON.parse(localStorage.getItem("infoSection"))
        : [];

    if (currentIndex !== null) {
        // Update the existing record if editing
        infoItem[currentIndex] = { ...info };
    } else {
        // Add new record
        infoItem.push(info);
    }

    // Save updated data back to localStorage
    localStorage.setItem("infoSection", JSON.stringify(infoItem));
};

// Function to validate the form before submission
const validateForm = () => {
    // Collect form data first to check the inputs
    getData(); // This makes sure that the data is collected before validation

    const email = info.email_id;
    const contactNumber = info.contact_number;

    // Check if all fields are filled
    if (!info.student_name || !info.student_id || !email || !contactNumber) {
        alert("All fields are required!");
        return false;
    }

    // Email validation: must contain '@' symbol
    if (!email.includes('@')) {
        alert("Please enter a valid email with '@' symbol.");
        return false;
    }

    // Contact number validation: must be 10 digits
    if (contactNumber.length !== 10 || isNaN(contactNumber)) {
        alert("Please enter a valid 10-digit contact number.");
        return false;
    }

    return true;
};

// Function to display student data on the page
const showData = () => {
    let cardContainer = document.getElementById("cardContainer");
    let cards = '';

    // Fetch data from localStorage
    let getLocalStorage = localStorage.getItem("infoSection");

    if (!getLocalStorage) {
        console.log("No data found.");
    } else {
        let cardDivArr = JSON.parse(getLocalStorage);

        // Generate HTML for each student card
        cardDivArr.forEach((item, index) => {
            cards += `
                <div class="card">
                    <div class="info">
                        <p><strong>Name:</strong> ${item.student_name}</p>
                        <p><strong>Student ID:</strong> ${item.student_id}</p>
                        <p><strong>Email:</strong> ${item.email_id}</p>
                        <p><strong>Contact:</strong> ${item.contact_number}</p>
                        <button onclick="deleteData(${index})">Delete</button>
                        <button onclick="editData(${index})">Edit</button>
                    </div>
                </div>`;
        });
    }

    // Insert cards into the container
    cardContainer.innerHTML = cards;
};

// Function to delete student data
const deleteData = (index) => {
    let getList = JSON.parse(localStorage.getItem("infoSection"));

    // Remove the selected item
    getList.splice(index, 1);

    // Update localStorage
    localStorage.setItem("infoSection", JSON.stringify(getList));

    // Reload the data display
    showData();
};

// Function to edit student data
const editData = (index) => {
    let getList = JSON.parse(localStorage.getItem("infoSection"));
    let student = getList[index];

    // Pre-fill the form with existing data
    document.getElementById('student-name').value = student.student_name;
    document.getElementById('student-id').value = student.student_id;
    document.getElementById('email-id').value = student.email_id;
    document.getElementById('contact-number').value = student.contact_number;

    // Set the current index to know which record to update
    currentIndex = index;

    // Change submit button text to "Update"
    submitBtn.textContent = "Update";
};

// Event listener for the submit button
submitBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission

    // Validate the form
    if (validateForm()) {
        showData(); // Display the updated data
        // Reset the form and submit button text after successful update
        document.querySelector('form').reset();
        submitBtn.textContent = "Submit";
        currentIndex = null; // Reset the editing state
    }
});

// Display existing data on page load
showData();
