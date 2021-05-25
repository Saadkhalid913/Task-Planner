function main() {
  const SidebarToggleButton = document.getElementById("sidebar-toggle")
  SidebarToggleButton.addEventListener("click", ToggleSidebar)
}


function ToggleSidebar(){
  const sidebar = document.getElementById("sidebar")
  if (sidebar.style.left == "0%") sidebar.style.left = "-15%"
  else  sidebar.style.left = "0%"
}

// test function 
function change(id) {
  const item = document.getElementById("change")
  item.style.transitionDuration = "350ms"
  if (item.style.height == "100%") item.style.height = "4rem"
  else item.style.height = "100%"
}

main()