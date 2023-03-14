const addTask = document.querySelector(".addTask input");
const taskContainer = document.querySelector(".tasks");
const filters = document.querySelectorAll(".filters span");
const clearBtn = document.querySelector(".clearBtn");
const checkBtn = document.querySelector(".checkBtn");

let toDoList = JSON.stringify("todo-list");
let tasksList = JSON.parse(localStorage.getItem(toDoList)) || [];


//select the filter
let selectedFilter = "all";
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.on").classList.remove("on");
        btn.classList.add("on");
        selectedFilter = btn.id;
        printList(btn.id);
    });
});


//update the list of tasks
let li = "";
function printList(filter) {
    li = "";
    if(tasksList){
        tasksList.forEach((task, id) => {
            let isCompleted = task.status == "completed" ? "checked" : "";
            if(filter == task.status || filter == "all") {
                li += ` <li class="task">
                            <label for="${id}">
                                <input onclick="updateTask(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class="${isCompleted}">${task.name}</p>
                            </label>
                            <div class="settings">
                                <img src="delete.png" alt="text" onclick="deleteTask(${id})" width="20" height = "20">
                            </div>
                        </li>`;
            }
        });
        updateNoLeft();
    }
    taskContainer.innerHTML = li;
}
printList();


//update the number of tasks left active
function updateNoLeft() {
    let noLeft = 0;
    tasksList.forEach((task, id) => {
        if(task.status == "active") {
            noLeft = noLeft + 1;
        }
    });
    document.getElementById("noLeft").innerHTML= noLeft + " items left";
}


//delete a task
function deleteTask(deleteId) {
    tasksList.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(tasksList));
    printList(selectedFilter);
}


//update tasks when checking/unchecking them
function updateTask(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if(selectedTask.checked){
        taskName.classList.add("checked");
        tasksList[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        tasksList[selectedTask.id].status = "active";
    }
    localStorage.setItem("todo-list", JSON.stringify(tasksList));
    updateNoLeft();
}


//for clear completed button
clearBtn.addEventListener("click", () => {
    if(tasksList){
        let l = tasksList.length;
        let i = 0;
        for(i = 0; i < l; i = i + 1) {
            while(i < l && tasksList[i].status == "completed") {
                tasksList.splice(i, 1);  
                l = l - 1;
             }
        }
        localStorage.setItem("todo-list", JSON.stringify(tasksList));        
    }
    printList(selectedFilter);
});

let check = 0;
checkBtn.addEventListener("click", () => {
    //for check all tasks button
    if(check == 0) {
        if(tasksList){
            tasksList.forEach((task, id) => {
                document.getElementById(id).checked=true;
                updateTask(document.getElementById(id));
            });
            check = 1;
        }
    }
    //for uncheck all tasks button 
    else {
        if(tasksList){
            tasksList.forEach((task, id) => {
                document.getElementById(id).checked=false;
                updateTask(document.getElementById(id));
            });
            check = 0;
        }

    }
});


//add tasks to local storage
addTask.addEventListener("keyup", e => {
    let task = addTask.value;
    if(!task){
        alert("You have to write a task!");
    }
    if(e.key == "Enter" && task) {
        addTask.value = ""; //to delete the input value after it is read
        let taskInfo = {name: task, status: "active"};
        tasksList.push(taskInfo);
        localStorage.setItem("todo-list", JSON.stringify(tasksList));
        printList(selectedFilter);
    }
});

