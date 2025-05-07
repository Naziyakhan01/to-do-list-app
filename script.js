document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    document.getElementById("taskInput").addEventListener("keyup", e => {
      if (e.key === "Enter") addTask();
    });
  });
  
  function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
  
    if (taskText === '') {
      alert('Please enter a task!');
      return;
    }
  
    createTaskElement(taskText, false, dueDate);
    saveTask({ text: taskText, completed: false, dueDate });
    taskInput.value = '';
    dueDateInput.value = '';
    updateCounter();
  }
  
  function createTaskElement(taskText, isCompleted = false, dueDate = '') {
    const taskList = document.getElementById('taskList');
  
    const li = document.createElement('li');
    if (isCompleted) li.classList.add('completed');
  
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = taskText;
    span.onclick = () => {
      const newText = prompt("Edit task:", span.textContent);
      if (newText) {
        span.textContent = newText;
        updateStorage();
      }
    };
  
    const due = document.createElement('span');
    due.className = 'due-date';
    if (dueDate) due.textContent = `Due: ${dueDate}`;
  
    li.appendChild(span);
    if (dueDate) li.appendChild(due);
  
    li.addEventListener('click', e => {
      if (e.target.tagName !== 'BUTTON' && e.target !== span) {
        li.classList.toggle('completed');
        updateStorage();
      }
    });
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      li.remove();
      updateStorage();
      updateCounter();
    };
  
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }
  
  function clearTasks() {
    document.getElementById('taskList').innerHTML = '';
    localStorage.removeItem('tasks');
    updateCounter();
  }
  
  function saveTask(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed, task.dueDate));
    updateCounter();
  }
  
  function updateStorage() {
    const items = document.querySelectorAll('#taskList li');
    const tasks = Array.from(items).map(li => {
      return {
        text: li.querySelector('.task-text').textContent.trim(),
        completed: li.classList.contains('completed'),
        dueDate: li.querySelector('.due-date')?.textContent.replace('Due: ', '') || ''
      };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  function updateCounter() {
    const count = document.querySelectorAll('#taskList li').length;
    document.getElementById('counter').textContent = `${count} task${count !== 1 ? 's' : ''}`;
  }
  
  function filterTasks(type) {
    const items = document.querySelectorAll('#taskList li');
    items.forEach(item => {
      const isCompleted = item.classList.contains('completed');
      if (
        type === 'all' ||
        (type === 'completed' && isCompleted) ||
        (type === 'incomplete' && !isCompleted)
      ) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
  