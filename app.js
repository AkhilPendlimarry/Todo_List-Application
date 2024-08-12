document.addEventListener("DOMContentLoaded", function () {
    const addTodoButton = document.getElementById("addTodoButton");
    const todoItemsContainer = document.getElementById("todoItemsContainer");
    const image = document.querySelector(".image");
    const headingField = document.querySelector(".toDoItemHeading");
    const descriptionField = document.querySelector(".toDoItemDescription");
    const dateField = document.getElementById("inputDate");

    // Load todo tasks from local storage & displays on page loading
    loadTodosFromLocalStorage();

    addTodoButton.addEventListener("click", function () {
        // getting values from the input fields
        const heading = headingField.textContent.trim();
        const description = descriptionField.textContent.trim();
        const date = dateField.value;
        console.log(date);

        if (heading && description && date) {
            const todoItem = {
                id: Date.now(), // UID based on the timestamp
                heading,
                description,
                date,
                completed: false // set to false initially
            };

            // Save todo task to local storage
            saveTodoToLocalStorage(todoItem);

            // Add the todo task to the document
            addTodoItemToDOM(todoItem);

            // Hide the image if there are tasks
            updateImageVisibility();

            // Clear input fields
            resetInputFields();
        }
    });

    function saveTodoToLocalStorage(todoItem) {
        let todos = getTodosFromLocalStorage();
        todos.push(todoItem); // adds new tasks into array
        localStorage.setItem("todos", JSON.stringify(todos)); // saves teh array to local storage
    }

    function getTodosFromLocalStorage() {
        return JSON.parse(localStorage.getItem("todos")) || []; // return any data from from local storage, ow return an empty array.
    }

    function loadTodosFromLocalStorage() {
        const todos = getTodosFromLocalStorage();
        todos.forEach(todo => addTodoItemToDOM(todo)); // add the tasks into document.
        updateImageVisibility(); // update image visibility based on tasks
    }

    function addTodoItemToDOM(todoItem) {
        const todoItemElement = document.createElement("li");
        todoItemElement.classList.add("todo-item");
        todoItemElement.setAttribute("data-id", todoItem.id);

        const todoItemCheckbox = document.createElement("input");
        todoItemCheckbox.type = "checkbox";
        todoItemCheckbox.classList.add("todo-item-checkbox");
        todoItemCheckbox.checked = todoItem.completed;

        const todoItemContent = document.createElement("div");
        todoItemContent.classList.add("todo-item-content");

        const todoItemHeading = document.createElement("h3");
        todoItemHeading.classList.add("todo-item-heading");
        todoItemHeading.textContent = todoItem.heading;

        const todoItemDescription = document.createElement("p");
        todoItemDescription.classList.add("todo-item-description");
        todoItemDescription.textContent = todoItem.description;

        const todoItemDate = document.createElement("p");
        todoItemDate.classList.add("todo-item-date");
        todoItemDate.textContent = todoItem.date;

        const deleteIcon = document.createElement("span");
        deleteIcon.textContent = "\u{1F5D1}" // unicode for trash icon
        deleteIcon.classList.add("delete-icon");

        // appending input elements to teh container
        todoItemContent.appendChild(todoItemHeading);
        todoItemContent.appendChild(todoItemDescription);
        todoItemContent.appendChild(todoItemDate);
       

        // appending checkbox, content to the main element
        todoItemElement.appendChild(todoItemCheckbox);
        todoItemElement.appendChild(todoItemContent);
        todoItemsContainer.appendChild(todoItemElement);
        todoItemElement.appendChild(deleteIcon);

        deleteIcon.addEventListener("click", function () {
            // Remove the todo item from local storage and DOM
            deleteTodoFromLocalStorage(todoItem.id);
            todoItemElement.remove();
            updateImageVisibility();
        });
        // Set the background color based on the date
        setTodoItemBackgroundColor(todoItemElement, todoItem.date, todoItem.completed);

        // Update local storage when checkbox is checked and delays the execution by 300 ms.
        todoItemCheckbox.addEventListener("change", function () {
             setTimeout(() => {
                todoItem.completed = todoItemCheckbox.checked;
                updateTodoInLocalStorage(todoItem.id, todoItem);
                setTodoItemBackgroundColor(todoItemElement, todoItem.date, todoItem.completed);
             }, 300); // time for delayed execution
        });
    }


function deleteTodoFromLocalStorage(id) {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter(todo => todo.id !== id); // Remove the todo with the specified id
    localStorage.setItem("todos", JSON.stringify(todos)); // Save the updated array to local storage
}

    function setTodoItemBackgroundColor(element, date, completed) {
        const currentDate = new Date();
        const todoDate = new Date(date);
        const checkbox = element.querySelector(".todo-item-checkbox");

        // inital removal of any bg color classes
        element.classList.remove("red-bg", "green-bg", "yellow-bg");

        // applying bg colors based on completion status
        if(completed){
            if (todoDate.getTime() > currentDate.getTime()) {
                element.classList.add("red-bg");
            } else if (todoDate.getTime() < currentDate.getTime()) {
                element.classList.add("green-bg");
            } else if (todoDate.getTime() === currentDate.getTime()) {
                element.classList.add("yellow-bg");
            }
        }

        const currentDateString = currentDate.toDateString();
        console.log(currentDateString);
        const todoDateString = todoDate.toDateString();
        console.log(todoDateString);

        // adding event listener for updating the bg color when checkbox is changed.

        checkbox.addEventListener("change", function() {
            if (checkbox.checked) {
             if (todoDate.getTime() > currentDate.getTime()) {
                    element.classList.add("red-bg");
                } else if (todoDate.getTime() < currentDate.getTime()) {
                    element.classList.add("green-bg");
                } else if (todoDateString === currentDateString) {
                    element.classList.add("yellow-bg");
                }
                
            } else {
                element.classList.remove('red-bg', 'green-bg', 'yellow-bg');
            }
    });
    }

    function updateTodoInLocalStorage(id, updatedTodo) {
        let todos = getTodosFromLocalStorage();
        todos = todos.map(todo => todo.id === id ? updatedTodo : todo); // updates only specific tasks
        localStorage.setItem("todos", JSON.stringify(todos)); // saves teh specific tasks to local storage
    }

    function resetInputFields() {
        headingField.textContent = "Task Heading"; // reset heading
        descriptionField.textContent = "Task Description"; // reset description field
        dateField.value = ""; // clears the date field
    }

    function updateImageVisibility() {
        const todos = getTodosFromLocalStorage();
        image.style.display = todos.length === 0 ? "block" : "none"; // will show/hide image based on the tasks
    }

    document.getElementById("saveTodoButton").addEventListener("click", function () {
        updateImageVisibility();
    });
});
