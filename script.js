const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
}

function saveData() {
    const tasks = [];
    const taskElements = document.querySelectorAll("li");
    taskElements.forEach(function (taskElement) {
        const task = {
            text: taskElement.querySelector("span").textContent,
            completed: taskElement.classList.contains("completed"),
            dueDate: taskElement.querySelector(".due-date").textContent,
            priority: taskElement.querySelector(".priority").textContent  // Sauvegarder la priorité
        };
        tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function loadData() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(function (task) {
            const li = document.createElement("li");
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                    <span>${task.text}</span>
                    <span class="due-date">${task.dueDate}</span>
                    <span class="priority">${task.priority}</span> <!-- Afficher la priorité -->
                    <span class="edit-btn">
                        <img src="img/modifier.svg" alt="Modifier" width="24" height="24">
                    </span>
                    <span class="delete-btn">
                        <img src="img/effacer.svg" alt="Supprimer" width="24" height="24">
                    </span> 
                </label>
            `;
            if (task.completed) {
                li.classList.add("completed");
            }
            listContainer.appendChild(li);

            const checkbox = li.querySelector("input");
            checkbox.addEventListener("click", function () {
                li.classList.toggle("completed", checkbox.checked);
                updateCounters();
                saveData();
            });

            const editBtn = li.querySelector(".edit-btn");
            const taskSpan = li.querySelector("span");
            editBtn.addEventListener("click", function () {
                const update = prompt("Modifier la tâche", taskSpan.textContent);
                if (update !== null) {
                    taskSpan.textContent = update;
                    li.classList.remove("completed");
                    checkbox.checked = false;
                    updateCounters();
                    saveData();
                }
            });

            const deleteBtn = li.querySelector(".delete-btn");
            deleteBtn.addEventListener("click", function () {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
                    li.remove();
                    updateCounters();
                    saveData();
                }
            });

            updateCounters();
        });
    }
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


function addTask() {
    const task = inputBox.value.trim();
    const dueDate = document.getElementById('due-date').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    if (!task) {
        alert("Merci de noter une tâche");
        console.log("pas de tâche");
        return;
    }

    // Vérifier la date sélectionnée
    const selectedDate = new Date(dueDate);
    const currentDate = new Date();

    if (selectedDate < currentDate ) {
        // Alerte si la date sélectionnée est passée ou égale à aujourd'hui
        alert("La date d'échéance doit être ultérieure à aujourd'hui.");
        return;
    }


    const li = document.createElement("li");
    li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
            <span class="due-date"> / ${dueDate}</span>
            <span class="priority"> / ${priority}</span>
            <span class="edit-btn">
                <img src="img/modifier.svg" alt="Modifier" width="24" height="24">
            </span>
            <span class="delete-btn">
                <img src="img/effacer.svg" alt="Supprimer" width="24" height="24">
            </span>
        </label>
    `;

    listContainer.appendChild(li);
    inputBox.value = "";
    document.getElementById('due-date').value = "";

    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("click", function () {
        li.classList.toggle("completed", checkbox.checked);
        updateCounters();
        saveData();
    });

    editBtn.addEventListener("click", function () {
        const update = prompt("Modifier la tâche", taskSpan.textContent);
        if (update !== null) {
            taskSpan.textContent = update;
            li.classList.remove("completed");
            checkbox.checked = false;
            updateCounters();
            saveData();
        }
    });

    deleteBtn.addEventListener("click", function () {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
            li.remove();
            updateCounters();
            saveData();
        }
    });

    updateCounters();
    saveData();
}




inputBox.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

loadData(); // Charger les données au chargement de la page
