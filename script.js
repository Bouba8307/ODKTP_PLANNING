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
            completed: taskElement.classList.contains("completed")
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
                    <input type="checkbox">
                    <span>${task.text}</span>
                    <span class="due-date"> A faire avant: ${task.dueDate}</span>
                    <span class="edit-btn">
                        <img src="img/modifier.svg" alt="Modifier" width="24" height="24">
                    </span>
                    <span class="delete-btn">
                        <img src="img/effacer.svg" alt="Modifier" width="24" height="24">
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
                if (confirm("Vous êtes sûr de le supprimer ?")) {
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
        let suffix = "", date = new Date(), dayOfMonth = date.getDate(), dayOfWeek = date.getDay(), Month = date.getMonth(),
            $today = $('#today'),
            $daymonth = $('#daymonth'),
            $month = $('#month');

        let dayArray = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        let monthArray = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

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
    const dueDate = document.getElementById("due-date").value;

    if (!task) {
        alert("Merci de noter une tâche");
        console.log("pas de tâche");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <label>
            <input type="checkbox">
            <span>${task}</span>
            <span class="due-date">Due: ${dueDate}</span>
            <span class="edit-btn">
                <img src="img/modifier.svg" alt="Modifier" width="24" height="24">
            </span>
            <span class="delete-btn">
                <img src="img/effacer.svg" alt="Modifier" width="24" height="24">
            </span> 
        </label>
    `;

    listContainer.appendChild(li);
    inputBox.value = "";
    document.getElementById("due-date").value = ""; // Efface la valeur du champ de date après l'ajout

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
        if (confirm("Vous êtes sûr de le supprimer ?")) {
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

