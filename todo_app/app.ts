/**
 * Todo App - TypeScript Source (app.ts)
 * Transpiled into app.js using the command: npx tsc
 * (Refer to CSE343 Lab 4 Slides 23-33 on TypeScript Setup & Types)
 */

// 1. Interface defining the structure of a Todo item (Slide 23)
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// 2. Class template implementing the interface (Slides 15 & 30)
class TodoItem implements Todo {
  id: number;
  text: string;
  completed: boolean;

  constructor(id: number, text: string, completed: boolean = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }
}

// 3. Main Application Class with TypeScript type annotations
class TodoApp {
  // Explicit Type Annotations (Slide 30)
  private todos: Todo[];
  private currentFilter: 'all' | 'active' | 'completed';
  private editingId: number | null;

  // DOM Elements
  private todoInput: HTMLInputElement;
  private addBtn: HTMLButtonElement;
  private todoList: HTMLUListElement;
  private itemsLeft: HTMLSpanElement;
  private filterBtns: NodeListOf<HTMLButtonElement>;
  private clearCompletedBtn: HTMLButtonElement;
  private clearAllBtn: HTMLButtonElement;

  constructor() {
    this.currentFilter = 'all';
    this.editingId = null;
    this.todos = this.loadTodos();

    // Type casting DOM elements
    this.todoInput = document.getElementById('todoInput') as HTMLInputElement;
    this.addBtn = document.getElementById('addBtn') as HTMLButtonElement;
    this.todoList = document.getElementById('todoList') as HTMLUListElement;
    this.itemsLeft = document.getElementById('itemsLeft') as HTMLSpanElement;
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn') as HTMLButtonElement;
    this.clearAllBtn = document.getElementById('clearAllBtn') as HTMLButtonElement;

    this.initEventListeners();
    this.render();
  }

  // Getter with return type number (Slide 16 & 30)
  get activeCount(): number {
    return this.todos.filter((todo: Todo) => !todo.completed).length;
  }

  get visibleTodos(): Todo[] {
    if (this.currentFilter === 'active') {
      return this.todos.filter((todo: Todo) => !todo.completed);
    }
    if (this.currentFilter === 'completed') {
      return this.todos.filter((todo: Todo) => todo.completed);
    }
    return this.todos;
  }

  private initEventListeners(): void {
    this.addBtn.addEventListener('click', () => this.handleAddTodo());

    this.todoInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        this.handleAddTodo();
      }
    });

    this.filterBtns.forEach((btn: HTMLButtonElement) => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentFilter = (btn.dataset.filter as 'all' | 'active' | 'completed') || 'all';
        this.render();
      });
    });

    this.clearCompletedBtn.addEventListener('click', () => {
      this.todos = this.todos.filter((todo: Todo) => !todo.completed);
      this.saveAndRender();
    });

    this.clearAllBtn.addEventListener('click', () => {
      this.todos = [];
      this.saveAndRender();
    });
  }

  private handleAddTodo(): void {
    const text: string = this.todoInput.value.trim();
    if (!text) return;

    const newTodo: Todo = new TodoItem(Date.now(), text, false);
    this.todos = [...this.todos, newTodo];

    this.todoInput.value = '';
    this.saveAndRender();
  }

  private toggleTodo(id: number): void {
    this.todos = this.todos.map((todo: Todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.saveAndRender();
  }

  private deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo: Todo) => todo.id !== id);
    this.saveAndRender();
  }

  private startEditing(id: number): void {
    this.editingId = id;
    this.render();
  }

  private saveEditing(id: number, newText: string): void {
    const trimmed: string = newText.trim();
    if (trimmed) {
      this.todos = this.todos.map((todo: Todo) => 
        todo.id === id ? { ...todo, text: trimmed } : todo
      );
    } else {
      this.deleteTodo(id);
      return;
    }
    this.editingId = null;
    this.saveAndRender();
  }

  private cancelEditing(): void {
    this.editingId = null;
    this.render();
  }

  private render(): void {
    this.todoList.innerHTML = '';

    const listToDisplay: Todo[] = this.visibleTodos;

    listToDisplay.forEach((todo: Todo) => {
      const { id, text, completed } = todo;

      const li: HTMLLIElement = document.createElement('li');
      li.className = `todo-item ${completed ? 'completed' : ''}`;

      if (this.editingId === id) {
        const editInput: HTMLInputElement = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = text;

        setTimeout(() => editInput.focus(), 0);

        editInput.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            this.saveEditing(id, editInput.value);
          } else if (e.key === 'Escape') {
            this.cancelEditing();
          }
        });

        editInput.addEventListener('blur', () => {
          this.saveEditing(id, editInput.value);
        });

        li.appendChild(editInput);
      } else {
        const contentDiv: HTMLDivElement = document.createElement('div');
        contentDiv.className = 'todo-content';

        const checkbox: HTMLInputElement = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = completed;
        checkbox.addEventListener('change', () => this.toggleTodo(id));

        const span: HTMLSpanElement = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = text;
        span.addEventListener('dblclick', () => this.startEditing(id));

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);

        const deleteBtn: HTMLButtonElement = document.createElement('button');
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

    const count: number = this.activeCount;
    this.itemsLeft.textContent = `${count} ${count === 1 ? 'item' : 'items'} left`;
  }

  private saveAndRender(): void {
    try {
      localStorage.setItem('lab4_todos', JSON.stringify(this.todos));
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
    this.render();
  }

  private loadTodos(): Todo[] {
    try {
      const saved = localStorage.getItem('lab4_todos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return [
      new TodoItem(1, 'See Lecture', false),
      new TodoItem(2, 'Solve assignment', false)
    ];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
