class LocalStorage {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem('sekido_todos')) {
      localStorage.setItem('sekido_todos', JSON.stringify([]));
    }
    if (!localStorage.getItem('sekido_habits')) {
      const habits = DEFAULT_CONFIG.habits.map(habit => ({
        ...habit,
        completed: false,
        streak: 0,
        lastCompleted: null
      }));
      localStorage.setItem('sekido_habits', JSON.stringify(habits));
    }
  }

  // Todos
  getTodos() {
    return JSON.parse(localStorage.getItem('sekido_todos') || '[]');
  }

  addTodo(text) {
    const todos = this.getTodos();
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      order: todos.length
    };
    todos.push(newTodo);
    localStorage.setItem('sekido_todos', JSON.stringify(todos));
    return newTodo;
  }

  toggleTodo(id) {
    const todos = this.getTodos();
    const todo = todos.find(t => t.id === parseInt(id));
    if (todo) {
      todo.completed = !todo.completed;
      localStorage.setItem('sekido_todos', JSON.stringify(todos));
    }
    return todo;
  }

  deleteTodo(id) {
    const todos = this.getTodos();
    const filtered = todos.filter(t => t.id !== parseInt(id));
    localStorage.setItem('sekido_todos', JSON.stringify(filtered));
  }

  reorderTodos(todoIds) {
    const todos = this.getTodos();
    const reordered = todoIds.map((id, index) => {
      const todo = todos.find(t => t.id === parseInt(id));
      return { ...todo, order: index };
    });
    localStorage.setItem('sekido_todos', JSON.stringify(reordered));
  }

  // Habits
  getHabits() {
    const habits = JSON.parse(localStorage.getItem('sekido_habits') || '[]');
    const today = new Date().toDateString();
    
    return habits.map(habit => {
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toDateString() : null;
      const isToday = lastCompleted === today;
      
      return {
        ...habit,
        completed: isToday
      };
    });
  }

  toggleHabit(id) {
    const habits = JSON.parse(localStorage.getItem('sekido_habits') || '[]');
    const habit = habits.find(h => h.id === parseInt(id));
    
    if (habit) {
      const today = new Date();
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
      const isToday = lastCompleted && lastCompleted.toDateString() === today.toDateString();
      
      if (isToday) {
        // Uncomplete today
        habit.completed = false;
        habit.streak = Math.max(0, habit.streak - 1);
        habit.lastCompleted = null;
      } else {
        // Complete today
        habit.completed = true;
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastCompleted && lastCompleted.toDateString() === yesterday.toDateString()) {
          habit.streak += 1;
        } else {
          habit.streak = 1;
        }
        habit.lastCompleted = today.toISOString();
      }
      
      localStorage.setItem('sekido_habits', JSON.stringify(habits));
    }
    
    return habit;
  }
}

const storage = new LocalStorage();
