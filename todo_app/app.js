/**
 * Todo App - JavaScript (app.js)
 * Implements concepts covered in CSE343 Lab 4:
 * - ES6 Classes & Constructors (Slide 15)
 * - Getters & Methods (Slide 16)
 * - Array Methods: .map(), .filter(), .push() (Slides 7-11)
 * - ES6 Destructuring & Spread operator (Slides 12-13)
 * - Arrow functions & Template Literals (Slide 3)
 */

// 1. TodoItem Class representing each individual todo
class TodoItem {
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// 2. Main TodoApp Class managing state and user interactions
class TodoApp {
  constructor() {
    // Current filter state: 'all' | 'active' | 'completed'
    this.currentFilter = 'all';

    // ID of item currently in edit mode (null if none)
    this.editingId = null;

    // Load initial todos or default lab demo items
    this.todos = this.loadTodos();

    // Cache DOM Elements
    this.todoInput = document.getElementById('todoInput');
    this.addBtn = document.getElementById('addBtn');
    this.todoList = document.getElementById('todoList');
    this.itemsLeft = document.getElementById('itemsLeft');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
    this.clearAllBtn = document.getElementById('clearAllBtn');

    // Initialize Event Listeners & First Render
    this.initEventListeners();
    this.render();
  }

  // Getter (Slide 16): Computes number of active (uncompleted) items
  get activeCount() {
    // Array .filter() method (Slide 11)
    return this.todos.filter(todo => !todo.completed).length;
  }

  // Getter (Slide 16): Returns filtered todos based on active filter button
  get visibleTodos() {
    // Non-mutating .filter() method (Slide 11)
    if (this.currentFilter === 'active') {
      return this.todos.filter(todo => !todo.completed);
    }
    if (this.currentFilter === 'completed') {
      return this.todos.filter(todo => todo.completed);
    }
    return this.todos; // 'all'
  }

  // Bind UI events
  initEventListeners() {
    // Add todo on button click (Arrow function - Slide 3)
    this.addBtn.addEventListener('click', () => this.handleAddTodo());

    // Add todo on pressing "Enter"
    this.todoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleAddTodo();
      }
    });

    // Filter tabs switching
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all, add to clicked button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = btn.dataset.filter;
        this.render();
      });
    });

    // Clear completed todos using .filter()
    this.clearCompletedBtn.addEventListener('click', () => {
      this.todos = this.todos.filter(todo => !todo.completed);
      this.saveAndRender();
    });

    // Clear all todos
    this.clearAllBtn.addEventListener('click', () => {
      this.todos = [];
      this.saveAndRender();
    });
  }

  // Add new item to todos array
  handleAddTodo() {
    const text = this.todoInput.value.trim();
    if (!text) return;

    // Create new TodoItem instance
    const newTodo = new TodoItem(Date.now(), text, false);

    // Spread operator (Slide 13) to append new item
    this.todos = [...this.todos, newTodo];

    // Reset input field
    this.todoInput.value = '';
    this.saveAndRender();
  }

  // Toggle todo completion
  toggleTodo(id) {
    // Array .map() method (Slide 10) to update matching item
    this.todos = this.todos.map(todo => {
      if (todo.id === id) {
        // Object spread to copy and invert completed flag
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    this.saveAndRender();
  }

  // Delete a single todo by ID
  deleteTodo(id) {
    // Array .filter() method (Slide 11)
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveAndRender();
  }

  // Enable inline editing mode
  startEditing(id) {
    this.editingId = id;
    this.render();
  }

  // Save edited text
  saveEditing(id, newText) {
    const trimmed = newText.trim();
    if (trimmed) {
      this.todos = this.todos.map(todo => 
        todo.id === id ? { ...todo, text: trimmed } : todo
      );
    } else {
      // If user erased text completely, delete the item
      this.deleteTodo(id);
      return;
    }
    this.editingId = null;
    this.saveAndRender();
  }

  // Cancel editing mode without changes
  cancelEditing() {
    this.editingId = null;
    this.render();
  }

  // Render the list items and counters
  render() {
    this.todoList.innerHTML = '';

    const listToDisplay = this.visibleTodos;

    // Iterate over visible items
    listToDisplay.forEach(todo => {
      // Destructuring assignment (Slide 12)
      const { id, text, completed } = todo;

      const li = document.createElement('li');
      li.className = `todo-item ${completed ? 'completed' : ''}`;

      if (this.editingId === id) {
        // In edit mode: display an input field
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = text;

        // Auto focus input
        setTimeout(() => editInput.focus(), 0);

        // Save on Enter, cancel on Escape
        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            this.saveEditing(id, editInput.value);
          } else if (e.key === 'Escape') {
            this.cancelEditing();
          }
        });

        // Save on blur
        editInput.addEventListener('blur', () => {
          this.saveEditing(id, editInput.value);
        });

        li.appendChild(editInput);
      } else {
        // Normal mode: checkbox + label + delete button
        const contentDiv = document.createElement('div');
        contentDiv.className = 'todo-content';

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => this.toggleTodo(id));

        // Todo Text Label
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = text;
        // Double-click to edit (Slide 35 demo requirement)
        span.addEventListener('dblclick', () => this.startEditing(id));

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        // Delete button with SVG trash icon
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.title = 'Delete todo';
        deleteBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        `;
        deleteBtn.addEventListener('click', () => this.deleteTodo(id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
      }

      this.todoList.appendChild(li);
    });

    // Update items left counter using Template Literal (Slide 3)
    const count = this.activeCount;
    this.itemsLeft.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`;
  }

  // Helper: Persist to localStorage and re-render
  saveAndRender() {
    try {
      localStorage.setItem('lab4_todos', JSON.stringify(this.todos));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    this.render();
  }

  // Helper: Load from localStorage or provide default items matching Lab 4 slide 35
  loadTodos() {
    try {
      const saved = localStorage.getItem('lab4_todos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }

    // Default items shown in Lab 4 Page 35 screenshot
    return [
      new TodoItem(1, 'See Lecture', false),
      new TodoItem(2, 'Solve assignment', false)
    ];
  }
}

// Instantiate the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
