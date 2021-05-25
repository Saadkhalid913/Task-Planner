function main() {
  const SidebarToggleButton = document.getElementById("sidebar-toggle")
  SidebarToggleButton.addEventListener("click", ToggleSidebar)
}


function ToggleSidebar(){
  const sidebar = document.getElementById("sidebar")
  if (sidebar.style.left == "0%") sidebar.style.left = "-15%"
  else  sidebar.style.left = "0%"
}


function AddNewCatigoryToSidebar(Category) {
  const name = Category.name
  const NewCategory = document.createElement("a");
  NewCategory.className = "sidebar-category"
  NewCategory.innerHTML = `<li>${name}</li>`
  const SidebarList = document.getElementById("sidebar-list");
  SidebarList.prepend(NewCategory);
}

function showPopup() {
  const popup = document.getElementById("add-task-popup");
  popup.style.transitionDuration = "250ms"
  if (popup.style.visibility == "hidden") {
    popup.style.height = "75vh";
    popup.style.visibility = "visible";
    return
  }
  else {
    popup.style.visibility = "hidden";
    popup.style.height = "0vh";
    return
  }
}

// test function 
function change(id) {
  const item = document.getElementById("change")
  item.style.transitionDuration = "350ms"
  if (item.style.height == "100%") item.style.height = "4rem"
  else item.style.height = "100%"
}

main()