var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;

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

    // ADD ENTIRE LIST ITEM TO LIST
    tasksToDoEl.appendChild(listItemEl);

    // INCREASE TASK COUNTER FOR NEXT UNIQUE ID
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";
    



// CREATE EDIT BUTTON
var editButtonEl = document.createElement("button");
editButtonEl.textContent = "Edit";
editButtonEl.className = "btn edit-btn";
editButtonEl.setAttribute("data-task-id", taskId);

actionContainerEl.appendChild(editButtonEl);

// CREATE DELETE BUTTON
var deleteButtonEl = document.createElement("button");
deleteButtonEl.textContent = "Delete";
deleteButtonEl.className = "btn delete-btn";
deleteButtonEl.setAttribute("data-task-id", taskId);

actionContainerEl.appendChild(deleteButtonEl);
return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);
