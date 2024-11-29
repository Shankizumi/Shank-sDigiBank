document.addEventListener("DOMContentLoaded", () => {
  const registerSection = document.getElementById("register");
  const listSection = document.getElementById("list");
  const searchSection = document.createElement("section");
  searchSection.id = "search-results";
  searchSection.classList.add("hidden");
  document.querySelector("main").appendChild(searchSection);

  const registerLink = document.getElementById("register-link");
  const listLink = document.getElementById("list-link");
  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById("search-btn");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");

  const employeeForm = document.getElementById("employee-form");
  const employeeList = document.getElementById("employee-list");

  let employees = JSON.parse(localStorage.getItem("employees")) || [];

  // Toggle Sections
  const showSection = (section) => {
    registerSection.classList.add("hidden");
    listSection.classList.add("hidden");
    searchSection.classList.add("hidden");
    section.classList.remove("hidden");
  };

  registerLink.addEventListener("click", () => showSection(registerSection));
  listLink.addEventListener("click", () => {
    renderEmployees();
    showSection(listSection);
  });

  // Hamburger Menu Toggle
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  // Capitalize the first letter of each word
  const capitalizeText = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Validate joining date
  const isFutureDate = (date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  };

  // Validate "About Me" field
  const hasMinimumWords = (text, minWords) => {
    return text.trim().split(/\s+/).length >= minWords;
  };

  // Save Employee with Validations
  employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameField = document.getElementById("name");
    const positionField = document.getElementById("position");
    const aboutField = document.getElementById("about");
    const joiningDateField = document.getElementById("joining_date");

    const name = nameField.value.trim();
    const position = positionField.value.trim();
    const about = aboutField.value.trim();
    const joiningDate = joiningDateField.value;

    // Validation checks
    if (name === "") {
      alert("Name is required.");
      return;
    }

    if (position === "") {
      alert("Position is required.");
      return;
    }

    if (!hasMinimumWords(about, 3)) {
      alert("About Me must have at least 3 words.");
      return;
    }

    if (joiningDate === "" || isFutureDate(joiningDate)) {
      alert("Joining Date cannot be in the future. Please select a valid date.");
      return;
    }

    // Automatically capitalize the name and About Me fields
    const formattedName = capitalizeText(name);
    const formattedAbout = capitalizeText(about);

    // Save the validated employee
    const employee = {
      name: formattedName,
      position,
      about: formattedAbout,
      joining_date: joiningDate,
    };

    employees.push(employee);
    localStorage.setItem("employees", JSON.stringify(employees));

    // Reset form and show listing page
    employeeForm.reset();
    showSection(listSection);
    renderEmployees();
  });

  // Render Employees
  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((employee, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${employee.name}</td>
        <td>${employee.position}</td>
        <td>${employee.about}</td>
        <td>${employee.joining_date}</td>
        <td><button data-index="${index}" class="delete-btn">Delete</button></td>
      `;
      employeeList.appendChild(row);
    });
  };

  // Delete Employee
  employeeList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const index = e.target.getAttribute("data-index");
      employees.splice(index, 1);
      localStorage.setItem("employees", JSON.stringify(employees));
      renderEmployees();
    }
  });

  // Render Search Results
  const renderSearchResults = (searchTerm) => {
    searchSection.innerHTML = `<h2>Search Results for "${searchTerm}"</h2>`;
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>About</th>
          <th>Joining Date</th>
        </tr>
      </thead>
      <tbody id="search-list"></tbody>
    `;
    searchSection.appendChild(table);

    const searchList = document.getElementById("search-list");
    const filteredEmployees = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredEmployees.length === 0) {
      
      searchList.innerHTML = `<tr><td colspan="4">No results found.</td></tr>`;
    } else {
      
      filteredEmployees.forEach((employee) => {
        console.log(employee)
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${employee.name}</td>
          <td>${employee.position}</td>
          <td>${employee.about}</td>
          <td>${employee.joining_date}</td>
          
        `;
        table.appendChild(row);
      });
    }
  };

  // Search Functionality
  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === "") {
      alert("Please enter a search term.");
      return;
    }
    renderSearchResults(searchTerm);
    showSection(searchSection);
  });

  // Initial Render
  renderEmployees();
});
