const form = document.querySelector('#usernameForm')


form.addEventListener('submit', function (e) {
	const userName = document.querySelector('#username').value;
	var footballCheckbox = document.querySelector('#footballTheme');
    var spaceCheckbox = document.querySelector('#spaceTheme');
	var easyCheckbox = document.querySelector('#easyDifficulty');
	var hardCheckbox = document.querySelector('#hardDifficulty');

	e.preventDefault();

	localStorage.setItem('username', userName)

	if(footballCheckbox.checked){
		localStorage.setItem("theme", "football")
	}else if (spaceCheckbox.checked){
		localStorage.setItem("theme", "space")
	}

	if(easyCheckbox.checked){
		localStorage.setItem("difficulty", "easy")
	}else if (hardCheckbox.checked){
		localStorage.setItem("difficulty", "hard")
	}
	window.location.href="game.html";

}, false);
