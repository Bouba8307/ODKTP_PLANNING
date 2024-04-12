// Variables globales
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Fonction pour mettre à jour les compteurs
function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("tr:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks - 1;
}

// Fonction pour sauvegarder les données dans le localStorage
function saveData() {
    const tasks = [];
    const taskRows = document.querySelectorAll("#list-container tr");
    taskRows.forEach(function (taskRow) {
        const taskData = {
            text: taskRow.dataset.taskText,
            completed: taskRow.classList.contains("completed"),
            dueDate: taskRow.dataset.taskDueDate,
            priority: taskRow.dataset.taskPriority
        };
        tasks.push(taskData);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fonction pour charger les données depuis le localStorage
function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
        addTaskToTable(task);
    });
    updateCounters();
}

// Fonction pour ajouter une tâche au tableau
function addTaskToTable(task) {
    const tableRow = document.createElement("tr");
    tableRow.dataset.taskText = task.text;
    tableRow.dataset.taskDueDate = task.dueDate;
    tableRow.dataset.taskPriority = task.priority;

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("role", "checkbox");
    checkbox.setAttribute("aria-label", "Terminer cette tâche");
    checkbox.addEventListener("change", function () {
        tableRow.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveData();
    });
    checkboxCell.appendChild(checkbox);
    tableRow.appendChild(checkboxCell);

    const taskCell = document.createElement("td");
    taskCell.textContent = task.text;
    tableRow.appendChild(taskCell);

    const dueDateCell = document.createElement("td");
    dueDateCell.textContent = task.dueDate;
    tableRow.appendChild(dueDateCell);

    const priorityCell = document.createElement("td");
    priorityCell.textContent = task.priority;
    tableRow.appendChild(priorityCell);

    tableRow.classList.add("task-row");
    listContainer.appendChild(tableRow);

    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.innerHTML = `<img src="img/modifier.svg" alt="Modifier" width="24" height="24">`;
    editButton.setAttribute("role", "button");
    editButton.setAttribute("aria-label", "Modifier cette tâche");
    editButton.addEventListener("click", function () {
        const newText = prompt("Modifier la tâche", task.text);
        if (newText !== null) {
            taskCell.textContent = newText;
            tableRow.classList.remove("completed");
            checkbox.checked = false;
            updateCounters();
            saveData();
        }
    });
    actionsCell.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<img src="img/effacer.svg" alt="Supprimer" width="24" height="24">`;
    deleteButton.setAttribute("role", "button");
    deleteButton.setAttribute("aria-label", "Supprimer cette tâche");
    deleteButton.addEventListener("click", function () {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            tableRow.remove();
            updateCounters();
            saveData();
        }
    });
    actionsCell.appendChild(deleteButton);

    tableRow.appendChild(actionsCell);
    tableRow.classList.toggle("completed", task.completed);
    updateCounters();
}

// Fonction pour ajouter une nouvelle tâche
function addTask() {
    const task = inputBox.value.trim();
    const dueDate = document.getElementById('due-date').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    const selectedDate = new Date(dueDate);
    const currentDate = new Date();

    if (currentDate >= selectedDate) {
        alert("La date d'échéance doit être ultérieure à aujourd'hui.");
        return;
    }

    if (!task) {
        alert("Merci de noter une tâche");
        return;
    }

    const newTask = {
        text: task,
        completed: false,
        dueDate: dueDate,
        priority: priority
    };

    addTaskToTable(newTask);
    inputBox.value = "";
    document.getElementById('due-date').value = "";

    saveData();
}

// Ajout d'un écouteur d'événement pour la touche Entrée
inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Chargement des données au chargement de la page
loadData();

// Fonction utilitaire pour générer un identifiant unique
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}