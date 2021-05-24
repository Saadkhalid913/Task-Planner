function main() {
  const SidebarToggleButton = document.getElementById("sidebar-toggle")
  SidebarToggleButton.addEventListener("click", ToggleSidebar)
}


function ToggleSidebar(){
  const sidebar = document.getElementById("sidebar")
  if (sidebar.style.left == "0%") sidebar.style.left = "-15%"
  else  sidebar.style.left = "0%"
}

main()