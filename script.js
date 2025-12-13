let students = [];
let editingId = null; 

// LocalStorage 
function loadStudents() {
  let data = localStorage.getItem("studentsData");
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

// LocalStorage me save
function saveStudents() {
  localStorage.setItem("studentsData", JSON.stringify(students));
}

// Grade function
function getGrade(percentage) {
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

// Form submit (Add / Update)
function handleFormSubmit(event) {
  event.preventDefault();

  let nameInput = document.getElementById("name");
  let rollInput = document.getElementById("roll");
  let m1Input = document.getElementById("marks1");
  let m2Input = document.getElementById("marks2");
  let m3Input = document.getElementById("marks3");

  let name = nameInput.value.trim();
  let roll = rollInput.value.trim();
  let m1 = parseFloat(m1Input.value);
  let m2 = parseFloat(m2Input.value);
  let m3 = parseFloat(m3Input.value);

  if (!name || !roll || isNaN(m1) || isNaN(m2) || isNaN(m3)) {
    alert("Please fill all fields correctly.");
    return;
  }

  let total = m1 + m2 + m3;
  let percentage = total / 3;
  let grade = getGrade(percentage);

  if (editingId === null) {
    // Naya student
    let student = {
      id: Date.now().toString(),
      name: name,
      roll: roll,
      marks1: m1,
      marks2: m2,
      marks3: m3,
      total: total,
      percentage: percentage,
      grade: grade
    };
    students.push(student);
  } else {
    // Existing student update
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === editingId) {
        students[i].name = name;
        students[i].roll = roll;
        students[i].marks1 = m1;
        students[i].marks2 = m2;
        students[i].marks3 = m3;
        students[i].total = total;
        students[i].percentage = percentage;
        students[i].grade = grade;
        break;
      }
    }
  }

  saveStudents();
  renderTable(students);
  resetForm();
}

// Table render 
function renderTable(list) {
  let tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  if (list.length === 0) {
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.colSpan = 10;
    cell.textContent = "No students found.";
    cell.style.textAlign = "center";
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  for (let i = 0; i < list.length; i++) {
    let s = list[i];
    let tr = document.createElement("tr");

    tr.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.roll + "</td>" +
      "<td>" + s.marks1 + "</td>" +
      "<td>" + s.marks2 + "</td>" +
      "<td>" + s.marks3 + "</td>" +
      "<td>" + s.total + "</td>" +
      "<td>" + s.percentage.toFixed(2) + "</td>" +
      "<td>" + s.grade + "</td>" +
      "<td>" +
        '<button class="action-btn edit-btn" onclick="startEdit(\'' + s.id + '\')">Edit</button>' +
        '<button class="action-btn delete-btn" onclick="deleteStudent(\'' + s.id + '\')">Delete</button>' +
      "</td>";

    tbody.appendChild(tr);
  }
}

// Edit start
function startEdit(id) {
  let s = null;
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      s = students[i];
      break;
    }
  }
  if (!s) return;

  editingId = id;

  document.getElementById("name").value = s.name;
  document.getElementById("roll").value = s.roll;
  document.getElementById("marks1").value = s.marks1;
  document.getElementById("marks2").value = s.marks2;
  document.getElementById("marks3").value = s.marks3;

  document.getElementById("saveBtn").textContent = "Update Student";
}

// Delete student
function deleteStudent(id) {
  if (!confirm("Delete this student?")) return;

  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      students.splice(i, 1);
      break;
    }
  }
  saveStudents();
  renderTable(students);
}

// Search
function handleSearch() {
  let term = document.getElementById("searchInput").value.toLowerCase();

  let filtered = [];
  for (let i = 0; i < students.length; i++) {
    let s = students[i];
    if (
      s.name.toLowerCase().includes(term) ||
      s.roll.toLowerCase().includes(term)
    ) {
      filtered.push(s);
    }
  }

  renderTable(filtered);
}

// Form clear
function resetForm() {
  document.getElementById("studentForm").reset();
  editingId = null;
  document.getElementById("saveBtn").textContent = "Add Student";
}

// Page load
document.addEventListener("DOMContentLoaded", function () {
  students = loadStudents();
  renderTable(students);

  document
    .getElementById("studentForm")
    .addEventListener("submit", handleFormSubmit);

  document
    .getElementById("clearBtn")
    .addEventListener("click", resetForm);

  document
    .getElementById("searchInput")
    .addEventListener("input", handleSearch);
});