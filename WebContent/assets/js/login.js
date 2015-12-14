/*
var playercount = 0;

function startbutton_disable(){
	var startButton = document.getElementById("startButton");
	startButton.disabled = true; //Start Button deaktivieren
}



function startbutton_enable(){
	var startButton = document.getElementById("startButton");
	startButton.disabled = false; //Start Button aktivieren
}


function changePlayerPosition(event){
	var tr = this.parentNode;
	var playerlist = document.getElementById("tablePlayerlistBody");
	playerlist.insertBefore(tr,playerlist.firstChild);
}



function addPlayerToTable(){
	var playername = document.getElementById("loginbox").value;//spielername aus dem Textfeld auslesen
	var playerlist = document.getElementById("tablePlayerlistBody");
	var maxPlayer = 6;
	
	
	if(playercount <= maxPlayer){
		if(playername == ""){
			alert("Es wurde kein Name angegeben. Bitte geben Sie einen Spielernamen ein.");
		}else{
			var tr = document.createElement("tr");
			
			var td1 = document.createElement("td");
			var td2 = document.createElement("td");
			
			var playernameText = document.createTextNode(playername);
			
			td1.appendChild(playernameText);
			
			tr.appendChild(td1);
			tr.appendChild(td2);
			
			playerlist.appendChild(tr);
			
			playercount++;
		}
		if(playercount >= 2){
			startbutton_enable();
		}
	}else{
		alert("Maximale Spieleranzahl erreicht.");
	}
	
	td1.addEventListener("click", changePlayerPosition, false);
	td1.parameter = playername;
	
}
*/