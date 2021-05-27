const GREEN = "#00A878"
const YELLOW = "#FFE066"
const RED = "#EF233C"

const PRIORITY_HASH = {
  "low": GREEN,
  "medium": YELLOW,
  "high": RED,
  "urgent": RED,
  "undecided": "#000000"
}

function main() {
  const SidebarToggleButton = document.getElementById("sidebar-toggle")
  SidebarToggleButton.addEventListener("click", ToggleSidebar)

  const AddTaskPopupToggleButton = document.getElementById("popup-toggle")
  AddTaskPopupToggleButton.addEventListener("click", showPopup)
  AddCategories()

  const filter = new URLSearchParams(window.location.search).get("filter")
  console.log(filter)
  GetTasks(filter)
}

async function AddCategories() {
  const response = await fetch("http://localhost:3000/api/categories")
  const Categories = await response.json() 
  for (let category of Categories) {
    const target =  window.location.href.split('?')[0] + `?filter=${category.name}`
    const CategoryElement =  `<a href = ${target} class="sidebar-category"><li>${category.name}</li></a>`
    document.getElementById("sidebar-list").innerHTML+=CategoryElement
  }
  }

async function GetTasks(filter) {
  const response = await fetch("http://localhost:3000/api/tasks")
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
  console.log(popup.style.visibility)
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
  let { name, description, priority, deadline, category, subtasks, link,  _id: id} = Task
  if (!deadline) deadline = "Unset"
  const taskElement = document.createElement("li");
  taskElement.id = id 
  taskElement.className =  "list-task"

  const overviewDiv = document.createElement("div")
  overviewDiv.className = "overview-wrapper"
  overviewDiv.addEventListener("click", () => ExpandListTask(taskElement.id))
  const priorityColor = PRIORITY_HASH[priority]
  overviewDiv.innerHTML = 
  `<span class="list-task-name">${name}</span>
   <span class="list-task-priority" style="background-color: ${priorityColor}">${priority}</span>
   <span class="list-task-category">${category}</span>
   <span class="list-task-deadline">${deadline}</span>`
  taskElement.appendChild(overviewDiv)

  const expandedItemDiv = document.createElement("div");
  expandedItemDiv.className = "list-task-expand";

  const taskDescription = document.createElement("div")           
  taskDescription.className = "list-task-description"
  taskDescription.innerHTML = Task.description;
  expandedItemDiv.appendChild(taskDescription)

  const subtaskListWrapperDiv = document.createElement("div")
  subtaskListWrapperDiv.className = "subtask-list-wrapper"
  subtaskListWrapperDiv.appendChild(CreateSubtaskList(Task.subtasks))
  expandedItemDiv.appendChild(subtaskListWrapperDiv)
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
  const item = document.getElementById(id)
  const maximumHeight = item.scrollHeight
  item.style.transitionDuration = "250ms"
  item.style.animationDuration = "250ms"
  console.log(item.style.maxHeight)
  if (item.style.height == `${maximumHeight}px`) return item.style.height= "4rem"
  for (let task of document.getElementById("main-task-list").children)
    // console.log(task)
    task.style.height = "4rem"
  item.style.height = `${maximumHeight}px`
  console.log(item.style.height)
}

main()