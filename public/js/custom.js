
function openNav() {
	alert('hello');
	document.getElementById("myNav").style.height = "100%";
	document.getElementById("show-navgation").style.zIndex = "-1";
}

function closeNav() {
	document.getElementById("myNav").style.height = "0%";
	document.getElementById("show-navgation").style.zIndex = "1";
}
