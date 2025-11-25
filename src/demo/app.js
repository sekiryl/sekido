const DAY_START_HOUR = DEFAULT_CONFIG.daySchedule.dayStart;
const DAY_END_HOUR = DEFAULT_CONFIG.daySchedule.dayEnd === 0 ? 24 : DEFAULT_CONFIG.daySchedule.dayEnd;
const RESET_HOUR = DEFAULT_CONFIG.resetHour;
let justCompletedId = null;
let currentTheme = 'sekiratte';
let currentAccent = 'peach';

const todoList = document.getElementById('todoList');
const todoForm = document.getElementById('todoForm');
const newTodoInput = document.getElementById('newTodoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const saveTodoBtn = document.getElementById('saveTodoBtn');
const habitContainer = document.querySelector('#habitGrid');
const themeSelector = document.getElementById('themeSelector');
const accentSelector = document.getElementById('accentSelector');

document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme and accent
    const savedTheme = localStorage.getItem('sekido_theme') || 'sekiratte';
    const savedAccent = localStorage.getItem('sekido_accent') || 'peach';
    currentTheme = savedTheme;
    currentAccent = savedAccent;
    themeSelector.value = savedTheme;
    accentSelector.value = savedAccent;
    applyTheme(savedTheme, savedAccent);
    
    initializeApp();
    
    themeSelector.addEventListener('change', (e) => {
        const newTheme = e.target.value;
        currentTheme = newTheme;
        localStorage.setItem('sekido_theme', newTheme);
        applyTheme(newTheme, currentAccent);
        loadHabits();
        updateDayProgress(); // Force progress bar update
    });
    
    accentSelector.addEventListener('change', (e) => {
        const newAccent = e.target.value;
        currentAccent = newAccent;
        localStorage.setItem('sekido_accent', newAccent);
        applyTheme(currentTheme, newAccent);
        loadHabits();
        updateDayProgress(); // Force progress bar update
    });
    
    addTodoBtn.addEventListener('click', () => {
        todoForm.classList.remove('hidden');
        newTodoInput.focus();
    });
    
    saveTodoBtn.addEventListener('click', addTodo);
    
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});

function applyTheme(themeName, accentName) {
    const theme = THEMES[themeName];
    if (!theme) return;
    
    const accentColor = theme.colors[accentName] || theme.colors.peach;
    
    // Update Tailwind config
    tailwind.config.theme.extend.colors = {
        ...theme.colors,
        accent: accentColor
    };
    
    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty('--color-accent', accentColor);
    
    // Update body styles
    document.body.style.background = theme.colors.base;
    document.body.style.color = theme.colors.text;
    
    // Update accent-colored elements directly
    const accentElements = document.querySelectorAll('.bg-peach, .text-peach, .border-peach, .focus\\:ring-peach');
    accentElements.forEach(el => {
        el.style.backgroundColor = el.classList.contains('bg-peach') ? accentColor : '';
        el.style.color = el.classList.contains('text-peach') ? accentColor : '';
        el.style.borderColor = el.classList.contains('border-peach') ? accentColor : '';
    });
    
    // Update title color
    const title = document.querySelector('h1');
    if (title) title.style.color = accentColor;
}

document.addEventListener('click', (e) => {
    if (!todoForm.classList.contains('hidden')) {
        const isClickInsideForm = todoForm.contains(e.target);
        const isClickOnAddButton = addTodoBtn.contains(e.target);
        
        if (!isClickInsideForm && !isClickOnAddButton) {
            todoForm.classList.add('hidden');
        }
    }
});

const cancelTodoBtn = document.getElementById('cancelTodoBtn');
cancelTodoBtn.addEventListener('click', () => {
    todoForm.classList.add('hidden');
    newTodoInput.value = '';
});

function initializeApp() {
    loadTodos();
    loadHabits();
    initTodoDragAndDrop();
    initDayProgress();
}

function initTodoDragAndDrop() {
  new Sortable(todoList, {
    animation: 150,
    ghostClass: 'opacity-50',
    handle: '.drag-handle',
    onEnd: async (evt) => {
      const newOrder = Array.from(todoList.querySelectorAll('li')).map(
        li => parseInt(li.dataset.id)
      );
      
      storage.reorderTodos(newOrder);
    }
  });
}

function loadTodos() {
    const todos = storage.getTodos();
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = `
            <div class="text-center py-8 text-subtext0">
                <span class="material-symbols-rounded text-4xl mb-3 text-overlay2">inbox</span>
                <p>No tasks yet. Add your first task!</p>
            </div>
        `;
        return;
    }
    
    todos.forEach(todo => renderTodo(todo));
    if (justCompletedId !== null) {
      const li = todoList.querySelector(`li[data-id="${justCompletedId}"]`);
      if (li && li.classList.contains('completed')) {
        li.classList.add('just-completed');
        li.querySelector('.todo-text').addEventListener(
          'animationend',
          () => li.classList.remove('just-completed'),
          { once: true }
        );
      }
      justCompletedId = null;
    }
}

function renderTodo(todo) {
    const todoElement = document.createElement('li');
    todoElement.className = 'group flex items-center justify-between bg-surface1 rounded-xl px-4 py-3 border border-overlay0';
    todoElement.dataset.id = todo.id;
    
    if (todo.completed) {
        todoElement.classList.add('completed');
    }
    
    todoElement.innerHTML = `
    <div class="flex items-center flex-grow">
        <div class="drag-handle mr-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity text-overlay2">
            <span class="material-symbols-rounded">drag_handle</span>
        </div>
        <input 
            type="checkbox" 
            class="custom-checkbox rounded-full mr-3 cursor-pointer"
            ${todo.completed ? 'checked' : ''}
        >
        <span class="todo-item-text text-lg flex-grow">
            <span class="todo-text">${todo.text}</span>
        </span>
    </div>
    <button class="delete-btn text-red hover:text-[#b33d3d] flex-shrink-0 ml-3">
        <span class="material-symbols-rounded">delete</span>
    </button>
`;
    
    const checkbox = todoElement.querySelector('input[type="checkbox"]');
    const deleteBtn = todoElement.querySelector('.delete-btn');
    
    checkbox.addEventListener('change', () => toggleTodoComplete(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
    
    todoList.appendChild(todoElement);
}

function initDayProgress() {
    updateDayProgress();
    setInterval(updateDayProgress, 60000);
}

function updateDayProgress() {
    const now = new Date();
    const currentHours = now.getHours() + (now.getMinutes() / 60);
    
    const progressGradient = document.getElementById('progressGradient');
    const progressText = document.getElementById('progressText');
    const progressIcon = document.getElementById('progressIcon');
    const progressTitle = document.getElementById('progressTitle');
    
    if (!progressGradient || !progressText || !progressIcon || !progressTitle) return;
    
    const theme = THEMES[currentTheme];
    let percentage = 0;
    let passedHours = 0;
    let passedMinutes = 0;
    let remainingHours = 0;
    let remainingMinutes = 0;
    let gradientStops = [];
    
    if (DAY_END_HOUR > DAY_START_HOUR) {
        const totalDayDuration = DAY_END_HOUR - DAY_START_HOUR;
        const totalNightDuration = 24 - totalDayDuration;
        
        if (currentHours >= DAY_START_HOUR && currentHours < DAY_END_HOUR) {
            const activeElapsed = currentHours - DAY_START_HOUR;
            percentage = (activeElapsed / totalDayDuration) * 100;
            
            passedHours = Math.floor(activeElapsed);
            passedMinutes = Math.floor((activeElapsed - passedHours) * 60);
            
            const activeRemaining = totalDayDuration - activeElapsed;
            remainingHours = Math.floor(activeRemaining);
            remainingMinutes = Math.floor((activeRemaining - remainingHours) * 60);
            
            gradientStops = [
                {color: theme.colors.yellow, position: 0},
                {color: theme.colors.flamingo, position: 50},
                {color: theme.colors.red, position: 100}
            ];
            
            progressIcon.textContent = "sunny";
            progressTitle.textContent = "Day Progress";
        } else {
            let sleepElapsed;
            if (currentHours >= DAY_END_HOUR) {
                sleepElapsed = currentHours - DAY_END_HOUR;
            } else {
                sleepElapsed = (24 - DAY_END_HOUR) + currentHours;
            }
            
            percentage = (sleepElapsed / totalNightDuration) * 100;
            
            passedHours = Math.floor(sleepElapsed);
            passedMinutes = Math.floor((sleepElapsed - passedHours) * 60);
            
            const sleepRemaining = totalNightDuration - sleepElapsed;
            remainingHours = Math.floor(sleepRemaining);
            remainingMinutes = Math.floor((sleepRemaining - remainingHours) * 60);
            
            gradientStops = [
                {color: theme.colors.blue, position: 0},
                {color: theme.colors.sky, position: 50},
                {color: theme.colors.mauve, position: 100}
            ];
            
            progressIcon.textContent = "bedtime";
            progressTitle.textContent = "Night Progress";
        }
    }
    
    let gradientStr = 'linear-gradient(to right';
    for (const stop of gradientStops) {
        gradientStr += `, ${stop.color} ${stop.position}%`;
    }
    gradientStr += ')';
    
    progressGradient.style.background = gradientStr;
    progressGradient.style.transform = `translateX(${-(100 - percentage)}%)`;
    
    progressText.textContent = 
        `${passedHours}h ${passedMinutes}m passed • ${remainingHours}h ${remainingMinutes}m remaining`;
}

function addTodo() {
    const text = newTodoInput.value.trim();
    if (!text) return;
    
    storage.addTodo(text);
    newTodoInput.value = '';
    todoForm.classList.add('hidden');
    loadTodos();
}

function toggleTodoComplete(id) {
    justCompletedId = id;
    storage.toggleTodo(id);
    loadTodos();
}

function deleteTodo(id) {
    storage.deleteTodo(id);
    loadTodos();
}

function loadHabits() {
    const habits = storage.getHabits();
    renderHabits(habits);
}

function renderHabits(habits) {
    habitContainer.innerHTML = habits.map(habit => {
        return `
            <div class="habit-item bg-surface1 rounded-xl p-4 border border-overlay0 transition-all duration-300">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-${habit.color} bg-opacity-20 flex items-center justify-center mr-3">
                            <span class="material-symbols-rounded text-${habit.color}" style="font-variation-settings: 'FILL' 1;">${habit.icon}</span>
                        </div>
                        <h3 class="font-medium text-lg">${habit.name}</h3>
                    </div>
                    <span class="bg-surface2 px-3 py-1 rounded-full text-sm font-medium text-${habit.color}">
                        ${habit.streak} day${habit.streak === 1 ? '' : 's'}
                    </span>
                </div>
                <button 
                    onclick="toggleHabit(${habit.id})"
                    class="w-full btn ${habit.completed ? 'bg-green hover:bg-[#6d9355] text-base' : 'bg-surface2 hover:bg-surface0 text-text'} py-2 rounded-lg flex items-center justify-center transition-colors"
                >
                    <span class="material-symbols-rounded mr-2">${habit.completed ? 'check' : 'add'}</span>
                    ${habit.completed ? 'Completed Today' : 'Mark as Complete'}
                </button>
            </div>
        `;
    }).join('');
}

function toggleHabit(id) {
    storage.toggleHabit(id);
    loadHabits();
}
