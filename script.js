// Select DOM Elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// Try to load saved todos from local storage
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

/**
 * Saves the current todos array to local storage
 */
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Creates a DOM node for a todo object
 */
function createTodoNode(todo, index) {
    const li = document.createElement('li');
    li.style.listStyle = "none";
    li.style.marginBottom = "5px";

    // 1. Checkbox to toggle completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        // Visual feedback
        textSpan.style.textDecoration = todo.completed ? 'line-through' : "none";
        textSpan.style.color = todo.completed ? 'gray' : "black";
        saveTodos();
    });

    // 2. Text of the todo
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.style.margin = "0 10px";
    textSpan.style.cursor = "pointer"; // Indicates it's interactive
    
    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
        textSpan.style.color = 'gray';
    }

    // FIX: Attach double-click listener ONLY to the textSpan
    textSpan.addEventListener("dblclick", () => {
        const newText = prompt("Edit todo", todo.text);
        // Only update if user didn't cancel and didn't leave it blank
        if (newText !== null && newText.trim() !== "") {
            todo.text = newText.trim();
            textSpan.textContent = todo.text;
            saveTodos();
        }
    });

    // 3. Delete todo button
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render(); // Re-render to update indices
        saveTodos();
    });

    // Assemble components
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    
    return li;
}

/**
 * Renders the whole todo list from the todos array
 */
function render() {
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node);
    });
}

/**
 * Adds a new todo to the array and UI
 */
function addTodo() {
    const text = input.value.trim();
    if (!text) {
        return;
    }

    // Push a new todo object
    todos.push({
        text: text,
        completed: false
    });

    input.value = '';
    render();
    saveTodos();
}

// Event Listeners
addBtn.addEventListener("click", addTodo);

// Allow pressing "Enter" to add a todo
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTodo();
    }
});

// Initial Render
render();