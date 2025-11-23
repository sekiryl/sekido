import { DEFAULT_CONFIG } from '../config';
import { THEMES } from './themes';

export function generateHTML(): string {
  const config = DEFAULT_CONFIG;
  const theme = THEMES[config.theme] || THEMES.sekiratte;
  const accentColor = theme.colors[config.accent as keyof typeof theme.colors] || theme.colors.peach;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    ${config.font === "default" ? 
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap">' :
        `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.font)}:wght@300;400;500;600;700&display=swap">`
    }
    <link rel="apple-touch-icon" sizes="180x180" href="${config.logo === "default" ? "./assets/favicon/apple-touch-icon.png" : config.logo === "custom" ? "./icon.png" : "./assets/favicon/apple-touch-icon.png"}">
    <link rel="icon" type="image/png" sizes="32x32" href="${config.logo === "default" ? "./assets/favicon/favicon-32x32.png" : config.logo === "custom" ? "./icon.png" : "./assets/favicon/favicon-32x32.png"}">
    <link rel="icon" type="image/png" sizes="16x16" href="${config.logo === "default" ? "./assets/favicon/favicon-16x16.png" : config.logo === "custom" ? "./icon.png" : "./assets/favicon/favicon-16x16.png"}">
    <link rel="manifest" href="./manifest.json">
    <link rel="shortcut icon" href="${config.logo === "default" ? "./assets/favicon/favicon.ico" : config.logo === "custom" ? "./icon.png" : "./assets/favicon/favicon.ico"}">
    <meta name="msapplication-TileColor" content="${accentColor}">
    <meta name="msapplication-config" content="./assets/favicon/browserconfig.xml">
    <meta name="theme-color" content="${theme.colors.base}">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['${config.font === "default" ? "Rubik" : config.font}', 'sans-serif'],
                    },
                    colors: ${JSON.stringify(theme.colors, null, 24)}
                }
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer base {
            body {
                background: theme('colors.base');
                color: theme('colors.text');
                min-height: 100vh;
                font-family: '${config.font === "default" ? "Rubik" : config.font}', sans-serif;
            }
            
            .card {
                background: theme('colors.surface0');
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }
            
            .btn {
                transition: all 0.3s ease;
            }
            
            .btn:hover {
                transform: scale(1.01);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            }
            
            .btn:active {
                transform: scale(0.99);
            }
            
            .habit-item:hover {
                transform: scale(1.01);
            }
            
            .completed {
                opacity: 0.7;
            }

            .todo-text {
              text-decoration: line-through;
              text-decoration-color: transparent;
              text-decoration-thickness: 1px;
              text-decoration-skip-ink: none;
              transition: none;
            }

            li.completed .todo-text {
              text-decoration-color: currentColor;
            }

            li.just-completed .todo-text {
              animation: strike-decoration 0.5s ease forwards;
            }

            @keyframes strike-decoration {
              from { text-decoration-color: transparent; }
              to   { text-decoration-color: currentColor; }
            }
            
            .pulse {
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(212, 135, 93, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(212, 135, 93, 0); }
                100% { box-shadow: 0 0 0 0 rgba(212, 135, 93, 0); }
            }

            .drag-handle {
              cursor: move;
              transition: opacity 0.2s ease;
              display: flex;
              justify-content: center;
            }

            .drag-handle:hover {
              opacity: 1 !important;
              color: theme('colors.${config.accent}');
            }

            .sortable-chosen {
              background-color: theme('colors.surface2');
            }

            .sortable-ghost {
              opacity: 0.5;
            }
            
            .material-symbols-rounded {
                font-variation-settings:
                'FILL' 0,
                'wght' 400,
                'GRAD' 200,
                'opsz' 24
            }
            .custom-checkbox {
                position: relative;
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                min-width: 1.25rem;
                min-height: 1.25rem;
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid theme('colors.overlay0');
                border-radius: 50%;
                background: theme('colors.surface1');
                cursor: pointer;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }
            
            .custom-checkbox:checked {
                background: theme('colors.${config.accent}');
                border-color: theme('colors.${config.accent}');
            }
            
            .custom-checkbox:checked::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(45deg);
                width: 4px;
                height: 8px;
                border: solid theme('colors.surface1');
                border-width: 0 2px 2px 0;
            }
            
            .custom-checkbox:hover {
                border-color: theme('colors.${config.accent}');
                transform: scale(1.05);
            }
            
            .custom-checkbox:focus {
                outline: none;
                box-shadow: 0 0 0 3px theme('colors.${config.accent} / 30%');
            }
            .todo-item-text {
                word-break: break-word;
                min-width: 0;
            }
            #progressFill {
                width: 100%;
            }
            #progressGradient {
                transition: transform 0.5s ease;
            }
            @media (hover: none) {
                .habit-item:hover {
                    transform: none !important;
                }
                
                .btn:hover {
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        }
    </style>
</head>
<body class="font-sans bg-base text-text min-h-screen">
    <div id="loginContainer" class="fixed top-0 left-0 right-0 bg-crust py-3 px-4 flex justify-end">
        <form id="loginForm" class="flex gap-2">
            <input 
                type="password" 
                id="passwordInput" 
                placeholder="Enter password"
                class="bg-surface1 border border-overlay0 rounded-xl px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-${config.accent}"
            >
            <button 
                type="submit"
                class="btn bg-${config.accent} hover:bg-[#e2946a] text-base font-bold px-4 py-2 rounded-xl"
            >
                Login
            </button>
        </form>
    </div>

    <div id="appContent" class="container mx-auto px-4 py-8 max-w-4xl hidden">
        <header class="text-center mb-12">
            <div class="flex items-center justify-center mb-4">
                ${config.logo === "default" ? '<img src="./assets/logo.png" alt="Logo" class="h-32 w-32 mr-4 rounded-full">' : 
                  config.logo === "custom" ? '<img src="./icon.png" alt="Logo" class="h-32 w-32 mr-4 rounded-full">' : ''}
                <h1 class="text-4xl md:text-5xl font-bold text-${config.accent}">${config.title}</h1>
            </div>
            ${config.quote === "default" ? '<p class="text-subtext0 max-w-lg mx-auto">"迷えば、敗れる…" </br>       -Isshin Ashina</p>' :
              config.quote !== "" ? `<p class="text-subtext0 max-w-lg mx-auto">${config.quote}</p>` : ''}
        </header>
        <div class="grid md:grid-cols-1 gap-8">
            ${config.modules.map(module => {
                if (module === "dayProgress") {
                    return `<section class="card p-6">
                        <h2 class="text-2xl font-bold text-rosewater flex items-center mb-6" id="progressHeader">
                            <span id="progressIcon" class="material-symbols-rounded mr-3"></span>
                            <span id="progressTitle">Day Progress</span>
                        </h2>
                        <div class="relative">
                            <div id="progressBar" class="h-5 rounded-full bg-surface2 overflow-hidden relative">
                                <div id="progressFill" class="h-full w-full absolute top-0 left-0 overflow-hidden">
                                    <div id="progressGradient" class="h-full w-full absolute top-0 left-0 rounded-full"></div>
                                </div>
                            </div>
                            <div id="progressText" class="text-center mt-2 text-subtext0"></div>
                        </div>
                    </section>`;
                } else if (module === "todos") {
                    return `<section class="card p-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-bold text-rosewater flex items-center">
                                <span class="material-symbols-rounded mr-3">checklist</span> My Tasks
                            </h2>
                            <button id="addTodoBtn" class="btn bg-${config.accent} hover:bg-[#e2946a] text-base font-bold px-4 py-2 rounded-full flex items-center pulse">
                                <span class="material-symbols-rounded mr-2">add</span> Add Task
                            </button>
                        </div>
                        
                        <div id="todoForm" class="hidden mb-6">
                            <div class="flex flex-col sm:flex-row gap-2">
                                <input 
                                    type="text" 
                                    id="newTodoInput" 
                                    placeholder="What do you need to do?"
                                    class="flex-1 bg-surface1 border border-overlay0 rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-${config.accent} w-full"
                                >
                                <div class="flex gap-2">
                                    <button 
                                        id="saveTodoBtn"
                                        class="btn bg-green hover:bg-[#6d9355] text-base font-medium px-4 py-3 rounded-xl flex items-center flex-1 justify-center"
                                    >
                                        <span class="material-symbols-rounded mr-2">save</span> Save
                                    </button>
                                    <button 
                                        id="cancelTodoBtn"
                                        class="btn bg-red hover:bg-[#b33d3d] text-base font-medium px-4 py-3 rounded-xl flex items-center"
                                    >
                                        <span class="material-symbols-rounded">close</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <ul id="todoList" class="space-y-3">
                        </ul>
                    </section>`;
                } else if (module === "habits") {
                    return `<section class="card p-6">
                        <h2 class="text-2xl font-bold text-rosewater mb-6 flex items-center">
                            <span class="material-symbols-rounded mr-3">timeline</span> Habit Tracker
                        </h2>
                        
                        <div id="habitGrid" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        </div>
                    </section>`;
                }
                return '';
            }).join('')}
        </div>
        
        <footer class="mt-12 text-center text-subtext0 text-sm">
            <p>Sekido - Licensed under <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" class="text-${config.accent} hover:underline">GNU GPLv3</a></p>
            <p class="mt-1">Made with ❤️ by <a href="https://github.com/sekiryl" target="_blank" class="text-${config.accent} hover:underline">sekiryl</a></p>
        </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
    <script>

    const DAY_START_HOUR = ${config.daySchedule.dayStart};
    const DAY_END_HOUR = ${config.daySchedule.dayEnd === 0 ? 24 : config.daySchedule.dayEnd};
    const SLEEP_DURATION = DAY_END_HOUR < DAY_START_HOUR ? DAY_START_HOUR - DAY_END_HOUR : (24 - DAY_START_HOUR) + DAY_END_HOUR;
    const RESET_HOUR = ${config.resetHour};
    let justCompletedId = null;
    
    const todoList = document.getElementById('todoList');
    const todoForm = document.getElementById('todoForm');
    const newTodoInput = document.getElementById('newTodoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const saveTodoBtn = document.getElementById('saveTodoBtn');
    const habitContainer = document.querySelector('#habitGrid');
    const loginContainer = document.getElementById('loginContainer');
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const appContent = document.getElementById('appContent');
    
    document.addEventListener('DOMContentLoaded', () => {
        checkAuth();
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            login();
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
    
    async function checkAuth() {
        try {
            const response = await fetch('/api/check-auth');
            const { authenticated } = await response.json();
            
            if (authenticated) {
                loginContainer.classList.add('hidden');
                appContent.classList.remove('hidden');
                initializeApp();
            } else {
                loginContainer.classList.remove('hidden');
                appContent.classList.add('hidden');
            }
        } catch (error) {
            console.error('Authentication check failed:', error);
        }
    }
    
    async function login() {
        const password = passwordInput.value.trim();
        if (!password) return;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            if (response.ok) {
                await checkAuth();
            } else {
                alert('Invalid password!');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please try again.');
        }
    }
    
    function initializeApp() {
        ${config.modules.includes("todos") ? 'loadTodos();' : ''}
        ${config.modules.includes("habits") ? 'loadHabits();' : ''}
        ${config.modules.includes("todos") ? 'initTodoDragAndDrop();' : ''}
        ${config.modules.includes("dayProgress") ? 'initDayProgress();' : ''}
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
          
          try {
            await fetch('/api/todos/reorder', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ todos: newOrder })
            });
          } catch (error) {
            console.error('Error updating order:', error);
            loadTodos();
          }
        }
      });
    }
    
    function loadTodos() {
        fetch('/api/todos')
            .then(res => res.json())
            .then(todos => {
                todoList.innerHTML = '';
                
                if (todos.length === 0) {
                    todoList.innerHTML = \`
                        <div class="text-center py-8 text-subtext0">
                            <span class="material-symbols-rounded text-4xl mb-3 text-overlay2">inbox</span>
                            <p>No tasks yet. Add your first task!</p>
                        </div>
                    \`;
                    return;
                }
                
                todos.forEach(todo => renderTodo(todo));
                if (justCompletedId !== null) {
                  const li = todoList.querySelector(\`li[data-id="\${justCompletedId}"]\`);
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
            });
    }
    
    function renderTodo(todo) {
        const todoElement = document.createElement('li');
        todoElement.className = 'group flex items-center justify-between bg-surface1 rounded-xl px-4 py-3 border border-overlay0';
        todoElement.dataset.id = todo.id;
        
        if (todo.completed) {
            todoElement.classList.add('completed');
        }
        
        todoElement.innerHTML = \`
        <div class="flex items-center flex-grow">
            <div class="drag-handle mr-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity text-overlay2">
                <span class="material-symbols-rounded">drag_handle</span>
            </div>
            <input 
                type="checkbox" 
                class="custom-checkbox rounded-full mr-3 cursor-pointer"
                \${todo.completed ? 'checked' : ''}
            >
            <span class="todo-item-text text-lg flex-grow">
                <span class="todo-text">\${todo.text}</span>
            </span>
        </div>
        <button class="delete-btn text-red hover:text-[#b33d3d] flex-shrink-0 ml-3">
            <span class="material-symbols-rounded">delete</span>
        </button>
    \`;
        
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
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        
        const currentHours = istNow.getUTCHours() + (istNow.getUTCMinutes() / 60);
        
        const progressGradient = document.getElementById('progressGradient');
        const progressText = document.getElementById('progressText');
        const progressIcon = document.getElementById('progressIcon');
        const progressTitle = document.getElementById('progressTitle');
        
        if (!progressGradient || !progressText || !progressIcon || !progressTitle) return;
        
        let percentage = 0;
        let passedHours = 0;
        let passedMinutes = 0;
        let remainingHours = 0;
        let remainingMinutes = 0;
        let gradientStops = [];
        
        if (DAY_END_HOUR > DAY_START_HOUR) {
            // Simple same-day schedule (e.g., 7 to 23)
            const totalDayDuration = DAY_END_HOUR - DAY_START_HOUR;
            const totalNightDuration = 24 - totalDayDuration;
            
            if (currentHours >= DAY_START_HOUR && currentHours < DAY_END_HOUR) {
                // Day period
                const activeElapsed = currentHours - DAY_START_HOUR;
                percentage = (activeElapsed / totalDayDuration) * 100;
                
                passedHours = Math.floor(activeElapsed);
                passedMinutes = Math.floor((activeElapsed - passedHours) * 60);
                
                const activeRemaining = totalDayDuration - activeElapsed;
                remainingHours = Math.floor(activeRemaining);
                remainingMinutes = Math.floor((activeRemaining - remainingHours) * 60);
                
                gradientStops = [
                    {color: '${theme.colors.yellow}', position: 0},
                    {color: '${theme.colors.flamingo}', position: 50},
                    {color: '${theme.colors.red}', position: 100}
                ];
                
                progressIcon.textContent = "sunny";
                progressTitle.textContent = "Day Progress";
            } else {
                // Night period
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
                    {color: '${theme.colors.blue}', position: 0},
                    {color: '${theme.colors.sky}', position: 50},
                    {color: '${theme.colors.mauve}', position: 100}
                ];
                
                progressIcon.textContent = "bedtime";
                progressTitle.textContent = "Night Progress";
            }
        } else {
            // Cross-midnight schedule (e.g., 9 to 1)
            const totalDayDuration = (24 - DAY_START_HOUR) + DAY_END_HOUR;
            const totalNightDuration = DAY_START_HOUR - DAY_END_HOUR;
            
            if ((currentHours >= DAY_START_HOUR) || (currentHours < DAY_END_HOUR)) {
                // Day period
                let activeElapsed;
                if (currentHours >= DAY_START_HOUR) {
                    activeElapsed = currentHours - DAY_START_HOUR;
                } else {
                    activeElapsed = (24 - DAY_START_HOUR) + currentHours;
                }
                
                percentage = (activeElapsed / totalDayDuration) * 100;
                
                passedHours = Math.floor(activeElapsed);
                passedMinutes = Math.floor((activeElapsed - passedHours) * 60);
                
                const activeRemaining = totalDayDuration - activeElapsed;
                remainingHours = Math.floor(activeRemaining);
                remainingMinutes = Math.floor((activeRemaining - remainingHours) * 60);
                
                gradientStops = [
                    {color: '${theme.colors.yellow}', position: 0},
                    {color: '${theme.colors.flamingo}', position: 50},
                    {color: '${theme.colors.red}', position: 100}
                ];
                
                progressIcon.textContent = "sunny";
                progressTitle.textContent = "Day Progress";
            } else {
                // Night period
                const sleepElapsed = currentHours - DAY_END_HOUR;
                percentage = (sleepElapsed / totalNightDuration) * 100;
                
                passedHours = Math.floor(sleepElapsed);
                passedMinutes = Math.floor((sleepElapsed - passedHours) * 60);
                
                const sleepRemaining = totalNightDuration - sleepElapsed;
                remainingHours = Math.floor(sleepRemaining);
                remainingMinutes = Math.floor((sleepRemaining - remainingHours) * 60);
                
                gradientStops = [
                    {color: '${theme.colors.blue}', position: 0},
                    {color: '${theme.colors.sky}', position: 50},
                    {color: '${theme.colors.mauve}', position: 100}
                ];
                
                progressIcon.textContent = "bedtime";
                progressTitle.textContent = "Night Progress";
            }
        }
        
        let gradientStr = 'linear-gradient(to right';
        for (const stop of gradientStops) {
            gradientStr += \`, \${stop.color} \${stop.position}%\`;
        }
        gradientStr += ')';
        
        progressGradient.style.background = gradientStr;
        progressGradient.style.transform = \`translateX(\${-(100 - percentage)}%)\`;
        
        progressText.textContent = 
            \`\${passedHours}h \${passedMinutes}m passed • \${remainingHours}h \${remainingMinutes}m remaining\`;
    }
    
    function addTodo() {
        const text = newTodoInput.value.trim();
        if (!text) return;
        
        fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(response => {
            if (response.ok) {
                newTodoInput.value = '';
                todoForm.classList.add('hidden');
                loadTodos();
            }
        });
    }
    
    function toggleTodoComplete(id) {
        fetch(\`/api/todos/\${id}/toggle\`, { method: 'PUT' })
        .then(() => {
          justCompletedId = id;
          loadTodos()
        });
    }
    
    function deleteTodo(id) {
        fetch(\`/api/todos/\${id}\`, { method: 'DELETE' })
            .then(() => loadTodos());
    }
    
    function getTodayResetDate() {
        const now = new Date();
        now.setHours(now.getHours() < RESET_HOUR ? RESET_HOUR - 24 : RESET_HOUR, 0, 0, 0);
        return now.toDateString();
    }
    
    function loadHabits() {
      fetch('/api/habits')
        .then(res => res.json())
        .then(data => renderHabits(data.habits, data.resetDate));
    }
    
    function renderHabits(habits, resetDate) {
        habitContainer.innerHTML = habits.map(habit => {
            const isTodayCompleted = habit.lastCompleted === resetDate;
            
            return \`
                <div class="habit-item bg-surface1 rounded-xl p-4 border border-overlay0 transition-all duration-300">
                    <div class="flex justify-between items-center mb-3">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-\${habit.color} bg-opacity-20 flex items-center justify-center mr-3">
                                <span class="material-symbols-rounded text-\${habit.color}" style="font-variation-settings: 'FILL' 1;">\${habit.icon}</span>
                            </div>
                            <h3 class="font-medium text-lg">\${habit.name}</h3>
                        </div>
                        <span class="bg-surface2 px-3 py-1 rounded-full text-sm font-medium text-\${habit.color}">
                            \${habit.streak} day\${habit.streak === 1 ? '' : 's'}
                        </span>
                    </div>
                    <button 
                        class="w-full btn \${isTodayCompleted ? 'bg-green hover:bg-[#6d9355] text-base' : 'bg-surface2 hover:bg-surface0 text-text'} py-2 rounded-lg flex items-center justify-center transition-colors"
                        data-id="\${habit.id}"
                    >
                        <span class="material-symbols-rounded mr-2">\${isTodayCompleted ? 'check' : 'add'}</span>
                        \${isTodayCompleted ? 'Completed Today' : 'Mark as Complete'}
                    </button>
                </div>
            \`;
        }).join('');
        
        document.querySelectorAll('.habit-item button').forEach(button => {
            button.addEventListener('click', (e) => {
                const habitId = parseInt(e.currentTarget.dataset.id);
                toggleHabitCompletion(habitId);
            });
        });
    }
    
    function toggleHabitCompletion(id) {
        fetch(\`/api/habits/\${id}/toggle\`, { method: 'PUT' })
            .then(() => loadHabits());
    }
</script>
</body>
</html>`;
}
