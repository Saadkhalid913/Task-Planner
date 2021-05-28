

const TOTAL_TASKS = {}

const GREEN = "#00A878"
const YELLOW = "#FFE066"
const RED = "#EF233C"
const URGENT_RED = "#970012"

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
  const filter = new URLSearchParams(window.location.search).get("filter")
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
  

  document.getElementById("popup-cancel").addEventListener("click", showPopup)
  document.getElementById("popup-add").addEventListener("click", TaskSubmitButton)
  document.getElementById("add-category-button").addEventListener("click", CategoryAddFromInput)
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
  popupSelect.innerHTML = ""


  if (!response) return
  const Categories = await response.json() 
  for (let category of Categories) {
    const target =  window.location.href.split('?')[0] + `?filter=${category.name}`
    const CategoryElement =  `<a href = ${target} class="sidebar-category"><li>${category.name}</li></a>`
    sidebarList.innerHTML +=CategoryElement
    popupSelect.innerHTML += `<option class = "task-add-category-option" value = ${category.name}>${category.name}<select/>`
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
    popup.style.height = "75vh";
    document.getElementById("task-desc-box").style.visibility="visible"
    popup.style.visibility = "visible";
    return
  }
  else {
    document.getElementById("task-desc-box").style.visibility="hidden"
    popup.style.visibility = "hidden";
    popup.style.height = "0vh";
    return
  }
}


function CreateListTask(Task){
  let { name, description, priority, category, subtasks, link,  _id: id} = Task
  TOTAL_TASKS[id] = Task
  const TimeUntilDeadline = CalculateDeadlineDelta(Task)
  
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
  subtaskListWrapperDiv.appendChild(CreateSubtaskList(Task.subtasks))
  expandedItemDiv.appendChild(subtaskListWrapperDiv)
  
  //adding description and subtask div into the expanded div
  taskElement.appendChild(expandedItemDiv)
  taskElement.appendChild(document.createElement("br"))


  const taskList = document.getElementById("main-task-list")
  taskList.appendChild(taskElement)
}

function CreateSubtaskList(Subtasks){
  const SubtaskList = document.createElement("ul")
  for (let subtask of Subtasks){
    const id = subtask._id
    const subtaskListItem = document.createElement("li")
    subtaskListItem.className= "subtask"
    subtaskListItem.id = id 
    subtaskListItem.innerHTML = 
    `<span class="subtask-name">${subtask.name}</span>
    <span class="subtask-priority">${subtask.priority}</span>
    <span class="subtask-deadline">${subtask.deadline || "Unset"}</span>`
    SubtaskList.appendChild(subtaskListItem)
  }
  return SubtaskList
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

  if (!nameInput.value || !descInput.value) return // input validation 

  const task = {
    name: nameInput.value,
    description: descInput.value,
    priority: priorityInput.value,
    link: linkInput.value,
    deadline:deadlineInput.value,
    // category: categoryInput.value
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

  const days = Math.floor(timeDelta / millisecondsInDay)
  const leftoverMillisecondsDay = timeDelta % millisecondsInDay

  const hours = Math.floor(leftoverMillisecondsDay / millisecondsInHour)
  const leftoverMillisecondsHour = leftoverMillisecondsDay % millisecondsInHour

  const minutes = Math.floor(leftoverMillisecondsHour / millisecondsInMinute)

  const formattedTimeDelta = `${days}d ${hours}h ${minutes}m`
  return formattedTimeDelta
}

main()