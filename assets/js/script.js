var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// CREATE AN ARRAY SO THAT TASKS CAN BE SAVED
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

  // CHECK IF INPUT VALUES ARE EMPTY STRINGS
  if (!taskNameInput || !taskTypeInput) {
    alert("You need to fill out the task form!");
    return false;
  }

  // RESET FIELDS FOR NEXT TASK
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  //  CHECK FOR task-id 
  var isEdit = formEl.hasAttribute("data-task-id");
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    };

    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  // ADD TASK ID AS A CUSTOM ATTRIBUTE
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  // CREATE DIV TO HOLD TASK INFO AND ADD TO LIST ITEM
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML ="<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);
  saveTasks();
  taskIdCounter++;
};

var createTaskActions = function (taskId) {
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

  // STATUS OPTION
  var statusChoices = ["To Do", "In Progress", "Completed"];
  for (var i = 0; i < statusChoices.length; i++) {
    // CREATE OPTION ELEMENT
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];
    // APPEND TO SELECT
    statusSelectEl.appendChild(statusOptionEl); 
  }

  return actionContainerEl;
};


  var completeEditTask = function (taskName, taskType, taskId) {
    // FIND MATCHING TASK
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"
    );

    // SET NEW VALUES
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //LOOP THROUGH TASKS ARRAY AND TASK OBJECT WITH NEW CONTENT
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].id === parseInt(taskId)) {
        tasks[i].name = taskName;
        tasks[i].type = taskType;
      }
    };

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
    saveTasks();
};

var taskButtonHandler = function (event) {
  // GET TARGET ELEMENT FROM EVENT
  var targetEl = event.target;
  // EDIT BUTTON CLICKED
  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  // DELETE BUTTON CLICKED
  else if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event) {
  console.log(event.target.value);
  var taskId = event.target.getAttribute("data-task-id");
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"
  );
  // CONVERT VALUE TO LOWERCASE
  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }
  // UPDATE TASKS IN TASK ARRAY
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  // SAVE TO LOCAL STORAGE
  saveTasks();
};

var editTask = function (taskId) {
  console.log(taskId);
  // GET TASK LIST ITEM ELEMENT
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  // GET CONTENT FROM TASK NAME, TYPE
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  console.log(taskName);
  var taskType = taskSelected.querySelector("span.task-type").textContent;
  console.log(taskType);
  // WRITE VALUES OF NAME AND TYPE FOR EDITING
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  // SET DATA ATTRIBUTE TO THE FORM WITH A VALUE OF THE TASKS ID SO IT KNOW WHICH ONE IS BEING EDITED
  formEl.querySelector("#save-task").textContent = "Save Task";
  // UPDATE FORMS BUTTON TO REFLECT EDITING A TASK RATHER THAN CREATING A NEW ONE
  formEl.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
  console.log(taskId);
  // FIND TASK LIST ELEMENT WITH taskId VALUE AND REMOVE IT
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();
  // CREATE NEW ARRAY TO HOLD UPDATED LIST OF TASKS
  var updatedTaskArr = [];
  // LOOP CURRENT TASKS
  for (var i = 0; i < tasks.length; i++) {
    // IF tasks[i].id DOESN'T MATCH THE VALUE OF taskId, KEEP THAT TASK AND PUSH IT INTO THE NEW ARRAY
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // REASSIGN TASKS ARRAY TO MATCH updatedTaskArr
  tasks = updatedTaskArr;
 saveTasks();
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
  var savedTasks = localStorage.getItem("tasks");
  // IF NO TASKS, SET TASKS TO AN EMPTY ARRAY, THEN RETURN OUT OF FUNCTION
  if (!savedTasks) {
    tasks = []
    return false;
  }
  // PARSE INTO ARRAY OF OBJECTS
  savedTasks = JSON.parse(savedTasks); 
  // LOOP THROUGH savedTasks ARRAY
  for (var i = 0; i < savedTasks.length; i++) {
    // PASS EACH TASK OBJ INTO THE createTaskEl() FUNCTION
    createTaskEl(savedTasks[i]);
  }
 
};

// EVENT LISTENERS
formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks()