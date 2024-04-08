const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("tr:not(.completed)").length - 1;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

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

function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
        addTaskToTable(task);
    });
    updateCounters();
}

$(document).ready(function () {
    function showDate() {
        var suffix = "", date = new Date(), dayOfMonth = date.getDate(), dayOfWeek = date.getDay(), Month = date.getMonth(),
            $today = $('#today'),
            $daymonth = $('#daymonth'),
            $month = $('#month');

        var dayArray = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        var monthArray = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];


        // Mettre à jour la date dans le HTML
        $today.text(dayArray[dayOfWeek] + ",");
        $daymonth.text(" " + dayOfMonth + suffix);
        $month.text(monthArray[Month]);
    }

    // Appeler la fonction showDate() au chargement de la page
    showDate();
});


function addTaskToTable(task) {
    const tableRow = document.createElement("tr");
    tableRow.dataset.taskText = task.text;
    tableRow.dataset.taskDueDate = task.dueDate;
    tableRow.dataset.taskPriority = task.priority;

    const checkboxCell = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
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

    const actionsCell = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.innerHTML = `<img src="img/modifier.svg" alt="Modifier" width="24" height="24">`;
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
    deleteButton.innerHTML = `<img src="img/effacer.svg" alt="Supprimer" width="24" height="24"  >`;
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
    listContainer.appendChild(tableRow);

    updateCounters();
}

function addTask() {
    const task = inputBox.value.trim();
    const dueDate = document.getElementById('due-date').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

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

inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

loadData(); // Charger les données au chargement de la page
