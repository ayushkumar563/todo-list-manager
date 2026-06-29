const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const errorMessage = document.getElementById('error-message');
const filterBtns = document.querySelectorAll('.filter-btn');
const todoStats = document.getElementById('todo-stats');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Save to LocalStorage
const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos));
};

// Show Error
const showError = (msg) => {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 3000);
};

// Add Task
const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) {
        showError('Task cannot be empty.');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false
    };

    todos.push(newTask);
    saveTodos();
    taskInput.value = '';
    renderTodos();
};

// Toggle Task Completion
const toggleTask = (id) => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
};

// Delete Task
const deleteTask = (id) => {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
};

// Clear Completed
clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
});

// Event Listeners for Adding
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Event Listeners for Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTodos();
    });
});

// Render UI
const renderTodos = () => {
    taskList.innerHTML = '';
    
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    if (todos.length === 0) {
        todoStats.classList.add('hidden');
        taskList.innerHTML = '<li class="empty-state">No tasks here yet. Enjoy your day!</li>';
        return;
    }

    todoStats.classList.remove('hidden');

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `task-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTask('${todo.id}')">
                <span class="checkmark"></span>
            </label>
            <span class="task-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTask('${todo.id}')" aria-label="Delete task">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;
        taskList.appendChild(li);
    });

    // Update Stats
    const activeCount = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
};

// Initial render
// Attach functions to window so inline onclick works
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
renderTodos();
