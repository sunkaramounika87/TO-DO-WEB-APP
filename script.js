// ===============================
// To-Do Web App
// ===============================


// Get HTML elements

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingCount = document.getElementById("pendingCount");

const filters = document.querySelectorAll(".filter");


// Edit Modal

const editModal = document.getElementById("editModal");

const editForm = document.getElementById("editForm");

const editTaskInput = document.getElementById("editTaskInput");
const editTaskDate = document.getElementById("editTaskDate");
const editTaskTime = document.getElementById("editTaskTime");

const closeModal = document.getElementById("closeModal");
const cancelEdit = document.getElementById("cancelEdit");


// Store tasks

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

let editingTaskId = null;


// ===============================
// Display Tasks
// ===============================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });


    // Empty state

    if (filteredTasks.length === 0) {

        taskList.appendChild(emptyState);

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

        filteredTasks.forEach(task => {

            const taskCard = createTaskCard(task);

            taskList.appendChild(taskCard);

        });

    }


    updateCounters();
}


// ===============================
// Create Task Card
// ===============================

function createTaskCard(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }


    let dateText = "";

    let timeText = "";


    if (task.date) {

        const date = new Date(task.date + "T00:00:00");

        dateText = "📅 " + date.toLocaleDateString();

    }


    if (task.time) {
        timeText = "⏰ " + formatTime(task.time);
    }


    card.innerHTML = `

        <button class="check-btn" onclick="toggleTask(${task.id})">
            ${task.completed ? "✓" : ""}
        </button>


        <div class="task-info">

            <h3>${escapeHTML(task.title)}</h3>

            <div class="task-meta">

                ${dateText ? `<span>${dateText}</span>` : ""}

                ${timeText ? `<span>${timeText}</span>` : ""}

                ${
                    task.completed
                    ? "<span>✓ Completed</span>"
                    : "<span>⏳ Pending</span>"
                }

            </div>

        </div>


        <div class="task-actions">

            <button
                class="action-btn edit-btn"
                onclick="openEditModal(${task.id})"
                title="Edit Task"
            >
                ✏️
            </button>


            <button
                class="action-btn delete-btn"
                onclick="deleteTask(${task.id})"
                title="Delete Task"
            >
                🗑️
            </button>

        </div>

    `;

    return card;
}


// ===============================
// Add Task
// ===============================

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title = taskInput.value.trim();

    if (title === "") {
        return;
    }


    const newTask = {

        id: Date.now(),

        title: title,

        date: taskDate.value,

        time: taskTime.value,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskForm.reset();


    displayTasks();

});


// ===============================
// Complete / Uncomplete Task
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });


    saveTasks();

    displayTasks();
}


// ===============================
// Delete Task
// ===============================

function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmDelete) {
        return;
    }


    tasks = tasks.filter(task => task.id !== id);


    saveTasks();

    displayTasks();
}


// ===============================
// Open Edit Modal
// ===============================

function openEditModal(id) {

    const task = tasks.find(task => task.id === id);


    if (!task) {
        return;
    }


    editingTaskId = id;


    editTaskInput.value = task.title;

    editTaskDate.value = task.date;

    editTaskTime.value = task.time;


    editModal.classList.add("show");
}


// ===============================
// Save Edited Task
// ===============================

editForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const title = editTaskInput.value.trim();


    if (title === "") {
        return;
    }


    tasks = tasks.map(task => {

        if (task.id === editingTaskId) {

            return {

                ...task,

                title: title,

                date: editTaskDate.value,

                time: editTaskTime.value

            };

        }


        return task;

    });


    saveTasks();


    closeEditModal();

    displayTasks();

});


// ===============================
// Close Modal
// ===============================

function closeEditModal() {

    editModal.classList.remove("show");

    editingTaskId = null;

}


closeModal.addEventListener("click", closeEditModal);

cancelEdit.addEventListener("click", closeEditModal);


// Close modal by clicking outside

editModal.addEventListener("click", function(event) {

    if (event.target === editModal) {

        closeEditModal();

    }

});


// ===============================
// Filters
// ===============================

filters.forEach(filter => {

    filter.addEventListener("click", function() {


        filters.forEach(button => {

            button.classList.remove("active");

        });


        this.classList.add("active");


        currentFilter = this.dataset.filter;


        displayTasks();

    });

});


// ===============================
// Counters
// ===============================

function updateCounters() {

    const total = tasks.length;

    const pending = tasks.filter(
        task => !task.completed
    ).length;


    totalTasks.textContent = total;

    pendingCount.textContent =
        `${pending} pending`;

}


// ===============================
// Save Tasks
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// Format Time
// ===============================

function formatTime(time) {

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);


    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}


// ===============================
// Security Helper
// ===============================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ===============================
// Initial Display
// ===============================

displayTasks();