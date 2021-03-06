const TOTAL_TASKS = {}
let CurrentTaskId = ""

const GREEN = "#00A878"
const YELLOW = "#FFE066"
const RED = "#EF233C"
const URGENT_RED = "#970012"
const MAIN_BACKGROUND_C = "rgb(240, 247, 244)"
const PRIORITY_HASH = {
  "low": GREEN,
  "medium": YELLOW,
  "high": RED,
  "urgent": URGENT_RED,
  "undecided": "#000000"
}


function TaskSubmitButton() {
  // function for submitting task 
  // submits task to database and adds to screen 
  PopupToJSON()
  for (let item of document.getElementById("add-task-popup").children) {
    item.value = ""
  }
  showPopup()
}

function main() {
  // adding all tasks
  let filter = new URLSearchParams(window.location.search).get("filter")
  if (filter) filter = filter.replaceAll("-", " ")

  try {
    GetTasks(filter)
    AddCategories()
  }
  catch(e) {
    Notification("Network error")
  }


  // event listeners 
  const SidebarToggleButton = document.getElementById("sidebar-toggle")
  SidebarToggleButton.addEventListener("click", ToggleSidebar)

  const AddTaskPopupToggleButton = document.getElementById("popup-toggle")
  AddTaskPopupToggleButton.addEventListener("click", showPopup)
  
  document.getElementById("add-subtask-button-popup").addEventListener("click", SubmitSubtaskFromPopup)
  document.getElementById("popup-cancel").addEventListener("click", showPopup)
  document.getElementById("popup-add").addEventListener("click", TaskSubmitButton)
  document.getElementById("add-category-button").addEventListener("click", CategoryAddFromInput)
  document.getElementById("cancel-subtask-popup").addEventListener("click", ToggleSubtaskPopup)
}

async function Notification(message){
  // sends notification to user for 4 seconds 
  const notification = document.getElementById("notification")
  notification.style.visibility = "visible"
  notification.style.height = "8rem"
  notification.childNodes[3].innerHTML = message 
  
  await setTimeout(() => {
    notification.style.height = "0px"
    notification.style.visibility = "hidden"
    notification.childNodes[3].innerHTML  = "" 
  }, 4000);
}

async function AddCategories() {
  const response = await fetch("http://localhost:3000/api/categories").catch(err => Notification("Could not connect to server"))
  const sidebarList =document.getElementById("sidebar-list")
  const popupSelect =  document.getElementById("add-task-category-input")  
  
  sidebarList.innerHTML = ` <a href="./homepage.html?filter=all" class="sidebar-category"><li>All Tasks</li></a>`
  popupSelect.innerHTML = `<option value="none">None</option>`


  if (!response) return
  const Categories = await response.json() 
  for (let category of Categories) {
    const URLtarget = category.name.replaceAll(" ", "-")
    const target =  window.location.href.split('?')[0] + `?filter=${URLtarget}`
    const CategoryElement =  `<a href = ${target} class="sidebar-category"><li>${category.name}</li></a>`
    sidebarList.innerHTML +=CategoryElement
    popupSelect.innerHTML += `<option class = "task-add-category-option" value = "${category.name}">${category.name}<select/>`
  }
  }

function CategoryAddFromInput(){
  const textbox = document.getElementById("category-add-input")
  if (!textbox.value) return 
  AddCategory(textbox.value)
  textbox.value = ""
}

async function AddCategory(category) {
  const response = await fetch("http://localhost:3000/api/categories", {
    method: "POST",
    mode:"cors",
    headers: {
      "Content-type": "application/json"
    },
    body: JSON.stringify({name:category})
  })
  const responseJSON = await response.json()
  AddCategories()
} 


async function GetTasks(filter) {
  const response = await fetch("http://localhost:3000/api/tasks").catch(err => Notification("Could not fetch tasks"))
  if (!response) return
  const tasks = await response.json()
  for (let task of tasks){
  if (filter == "all" || (!filter))
    CreateListTask(task);
  else if (task.category.toLowerCase() == filter.toLowerCase())
    CreateListTask(task);
  else
    continue
  }
}

function ToggleSidebar(){
  const sidebar = document.getElementById("sidebar")
  if (sidebar.style.left != "0%") sidebar.style.left = "0%"
  else sidebar.style.left = "-15%"
}


function AddNewCatigoryToSidebar(Category) {
  const name = Category.name
  const NewCategory = document.createElement("a");
  NewCategory.className = "sidebar-category"
  NewCategory.innerHTML = `<li>${name}</li>`
  const SidebarList = document.getElementById("sidebar-list");
  SidebarList.prepend(NewCategory);
}


// re-write function 
function showPopup() {
  const popup = document.getElementById("add-task-popup");
  if (popup.style.visibility == "hidden" || !popup.style.visibility) {
    popup.style.height = "85vh";
    popup.style.visibility = "visible";
    for (let item of popup.children)
      item.style.display = "flex"
    return
  }
  else {
    for (let item of popup.children) 
      item.style.display = "none"
    popup.style.height = "0vh";
    popup.style.visibility = "hidden";
    return
  }
}


function CreateListTask(Task){
  let { name, description, priority, category, subtasks, link,  _id: id} = Task
  TOTAL_TASKS[id] = Task
  let TimeUntilDeadline = CalculateDeadlineDelta(Task)
  if (!TimeUntilDeadline) TimeUntilDeadline = "Overdue"
  
  // task element init 
  const taskElement = document.createElement("li");
  taskElement.id = id 
  taskElement.className =  "list-task"

  // Unexpanded overview div init 
  const overviewDiv = document.createElement("div")
  overviewDiv.className = "overview-wrapper"
  overviewDiv.addEventListener("click", () => ExpandListTask(taskElement.id))
  const priorityColor = PRIORITY_HASH[priority] 
  overviewDiv.innerHTML = 
  `<span class="list-task-name">${name}</span>
   <span class="list-task-priority" style="background-color: ${priorityColor}">${priority}</span>
   <span class="list-task-category">${category}</span>
   <span class="list-task-deadline">${TimeUntilDeadline}</span>`

  taskElement.appendChild(overviewDiv) // adding div to task element 


  // expanded div HTML 
  const expandedItemDiv = document.createElement("div"); 
  expandedItemDiv.className = "list-task-expand"; 


  // description 
  const taskDescription = document.createElement("div") 
  taskDescription.className = "list-task-description"
  taskDescription.innerHTML = Task.description;
  expandedItemDiv.appendChild(taskDescription)

  // subtasks array 
  const subtaskListWrapperDiv = document.createElement("div")
  subtaskListWrapperDiv.className = "subtask-list-wrapper"

  const SubtaskList = document.createElement("ul")
  SubtaskList.id = "subtask-list-" + id
  SubtaskList.className = "task-subtask-list"
  subtaskListWrapperDiv.appendChild(SubtaskList)

  
  expandedItemDiv.appendChild(subtaskListWrapperDiv)
  
  // subtask button 
  const AddSubtaskButton = document.createElement("button")
  AddSubtaskButton.innerHTML = "Add Subtask"
  AddSubtaskButton.className = "task-add-subtask-button"
  AddSubtaskButton.addEventListener("click", () => {
    CurrentTaskId = id
    ToggleSubtaskPopup()
  })  
  expandedItemDiv.appendChild(AddSubtaskButton)

  const TaskDeleteButton = document.createElement("button")
  TaskDeleteButton.className = "task-delete-button"
  TaskDeleteButton.innerHTML= "Delete"
  TaskDeleteButton.addEventListener("click", async () => {
    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {method: "DELETE"})
    if (response.status == 200) return document.getElementById(id).remove()
  })

  expandedItemDiv.appendChild(TaskDeleteButton)
  
  //adding description and subtask div into the expanded div
  taskElement.appendChild(expandedItemDiv)
  taskElement.appendChild(document.createElement("br"))
  
  

  const taskList = document.getElementById("main-task-list")
  taskList.appendChild(taskElement)
  AddAllSubtasks(Task)
}

function AddAllSubtasks(Task){
  const id = Task._id
  const subtasks = Task.subtasks
  if (!subtasks) return 

  const SubtaskList = document.getElementById("subtask-list-" + id)
  for (let subtask of subtasks){
    SubtaskList.appendChild(CreateSubtaskItem(id, subtask))
  }
  return SubtaskList
}

function CreateSubtaskItem(parentId, subtask) {
  const id = subtask._id
  const priorityColor = PRIORITY_HASH[subtask.priority]
  const subtaskListItem = document.createElement("li")
  subtaskListItem.className= "subtask"
  subtaskListItem.id = id 
  subtaskListItem.innerHTML = 
  `<span class="subtask-name">${subtask.name}</span>
  <span class="subtask-priority" style="background-color: ${priorityColor}">${subtask.priority}</span>
  <span class="subtask-deadline">${CalculateDeadlineDelta(subtask)}</span>`
  if (subtask.completed) subtaskListItem.style.backgroundColor = GREEN
  subtaskListItem.addEventListener("click", async () => {
    const response = await fetch(`http://localhost:3000/api/tasks/subtasks/complete/${parentId}/${id}`, {method: "PUT"})
                                .catch(err => Notification("Please connect to the network"))
    const responseSubtask = await response.json();
    const item = document.getElementById(responseSubtask._id)
    if (!responseSubtask.completed) item.style.backgroundColor = MAIN_BACKGROUND_C
    else item.style.backgroundColor = GREEN  
  })

  return subtaskListItem
}

// test function 
function ExpandListTask(id) {
  CalculateDeadlineDelta(TOTAL_TASKS[id])
  const item = document.getElementById(id)
  const maximumHeight = item.scrollHeight
  item.style.transitionDuration = "250ms"
  item.style.animationDuration = "250ms"
  if (item.style.height == `${maximumHeight}px`) return item.style.height= "4rem"
  for (let task of document.getElementById("main-task-list").children)
    task.style.height = "4rem"
  item.style.height = `${maximumHeight}px`
}

async function PopupToJSON() {
  const nameInput = document.getElementById("task-name-input")
  const descInput = document.getElementById("task-desc-box")
  const priorityInput = document.getElementById("add-task-priority")
  const deadlineInput = document.getElementById("new-task-deadline")
  const linkInput = document.getElementById("add-task-link")
  const categoryInput = document.getElementById("add-task-category-input")

  if (!nameInput.value || !descInput.value) return Notification("Please enter a name and description") // input validation 

  const task = {
    name: nameInput.value,
    description: descInput.value,
    priority: priorityInput.value,
    link: linkInput.value,
    deadline:deadlineInput.value,
    category: categoryInput.value
  }
  const response = await fetch("http://localhost:3000/api/tasks", {
    method:"POST",
    mode:"cors",
    headers:{"Content-Type": "application/json"},
    body: JSON.stringify(task)
  })
  if (!(response.status == 200)) {
    Notification("Could not upload task")
    return
  }
  const responseTask = await response.json()
  CreateListTask(responseTask)
}

function CalculateDeadlineDelta(task) {
  // returns String 

  if (!task.deadline) return "Unset"

  // time calculation constants 
  const millisecondsInMinute = 60000
  const millisecondsInHour = millisecondsInMinute * 60
  const millisecondsInDay = millisecondsInHour * 24

  const deadlineDate = Date.parse(task.deadline);
  const currentTime = new Date()
  const timeDelta = deadlineDate - currentTime 
  
  if (timeDelta < 1) return "Overdue"
  
  const days = Math.floor(timeDelta / millisecondsInDay)
  const leftoverMillisecondsDay = timeDelta % millisecondsInDay
  
  const hours = Math.floor(leftoverMillisecondsDay / millisecondsInHour)
  const leftoverMillisecondsHour = leftoverMillisecondsDay % millisecondsInHour
  
  const minutes = Math.floor(leftoverMillisecondsHour / millisecondsInMinute)
  
  const formattedTimeDelta = `${days}d ${hours}h ${minutes}m`
  return formattedTimeDelta
}

function SubmitSubtaskFromPopup() {
  const nameBox = document.getElementById("subtask-name-input-box")
  const deadlineBox = document.getElementById("subtask-deadline-input-box") 
  const priorityBox = document.getElementById("add-subtask-priority-popup")

  if (!nameBox.value) return Notification("Please add a name")
  const Subtask = {
    name: nameBox.value,
    deadline: deadlineBox.value,
    priority: priorityBox.value,
  }
  
  AddSubtask(CurrentTaskId, Subtask)
  ToggleSubtaskPopup()
  nameBox.value = ""
  deadlineBox.value = ""
  priorityBox.value = ""
}

async function AddSubtask(id, subtask) {
  // uploads a subtask to server, and also adds task to the document
  const response = await fetch("http://localhost:3000/api/tasks/subtasks/" + id, {
    method:"POST",
    mode: "cors",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(subtask)
  })

  const subtaskResponse = await response.json()

  document.getElementById("subtask-list-"+ CurrentTaskId).appendChild(
    CreateSubtaskItem(CurrentTaskId, subtaskResponse.subtasks.find(task => task.name == subtask.name))
  )

}

function ToggleSubtaskPopup() {
  const popup = document.getElementById("subtask-popup");

  if (popup.style.visibility == "hidden" || !popup.style.visibility) {
    for (let item of popup.children)
    item.style.display = "flex"
    popup.style.visibility = "visible" 
    popup.style.height = "35%"
    return
  }
  popup.style.height = "0vh"
  for (let item of popup.children)
      item.style.display = "none"

  popup.style.visibility = "hidden"
}


main()