var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

var taskFormHandler = function(event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    console.dir(taskNameInput);

    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    console.log(taskTypeInput);

    // CHECK IF INPUT VALUES ARE EMPTY STRINGS
    if (!taskNameInput || !taskTypeInput) { 
        alert("You need to fill out the task form!");
        return false;
        }

    formEl.reset();

    // PACKAGE UP DATA AS AN OBJECT
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
        };

    // SEND IT AS AN ARGUMENT TO createTaskEl
    createTaskEl(taskDataObj);    
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // ADD TASK ID AS A CUSTOM ATTRIBUTE
    listItemEl.setAttribute("data-task-id", taskIdCounter);


    // CREATE DIV TO HOLD TASK INFO AND ADD TO LIST ITEM
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);


    // ADD ENTIRE LIST ITEM TO LIST
    tasksToDoEl.appendChild(listItemEl);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    
    // EDIT BUTTON
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    // DELETE BUTTON
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // DROP DOWN
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        // CREATE OPTION ELEMENT
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusSelectEl.appendChild(statusOptionEl);
      }
    
      actionContainerEl.appendChild(statusSelectEl);


    return actionContainerEl;
};

// EVENT LISTENERS
formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } 
    // delete button was clicked
    else if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }

    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        console.log(taskId);
    }
    if (event.target.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};


pageContentEl.addEventListener("click", taskButtonHandler);