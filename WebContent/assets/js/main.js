document.addEventListener("DOMContentLoaded", init, false); //Event wird geworfen, wenn DOM-Baum geladen, dann init methode ausgeführt

//Websocket
var socket;
var readyToSend = false;

//AJAX
var request;

//Game
var gameRunning = false;

//Player
playerId = -1;
var playerCount = 0;

//Playerliste
var curPlayerList;

//aktiver / ausgewählter Katalog
var activeCatalog = "";


//Question
var curQuestion = "";
var curAnswer1 = "";
var curAnswer2 = "";
var curAnswer3 = "";
var curAnswer4 = "";
var curTimeOut = 0;
var isQuestionActive = false;

//Antwortauswahl
var curSelection = -1;


/*
 * Funktion wird nachdem die Seite geladen wurde aufgerufen
 * Initiiert Websocketverbindung, Listener werden registriert
 */
function init(){
	
	animation();
	
	// open websocket
    var url = 'ws://localhost:8080/WebProg_v2/SocketHandler';
    //var url = 'ws://fbe-wwwdev.hs-weingarten.de:8080/webprog05/tomcat/SocketHandler';
	
    socket = new WebSocket(url);
    
    
    
    // event handler websocket
    socket.onopen = function(){
        readyToSend = true;
    };
    
    socket.onerror = function(event){
        alert("Websocket Error: " + event.data);
    };
    
    socket.onclose = function(event){
        console.log("Websocket geschlossen: " + event.data);
    };
    
    socket.onmessage = receiveWSMessage;
    
    // listener login + start button
    var buttonLogin = window.document.getElementById("buttonLogin");
    buttonLogin.addEventListener("click",clickedLogin,true);

    var buttonStart = window.document.getElementById("startButton");
    buttonStart.addEventListener("click",clickedStart,true);
    
    // request catalogs
	requestCatalogs();
 
}


/*
 * Funktion empfängt über Websocket Nachrichten im JSON-Format
 */
function receiveWSMessage(message){
	
	//parse JSON-Nachricht
	var parsedJSONMessage = JSON.parse(message.data);
	
	console.log("Received message type: " + parsedJSONMessage.messageType);
	
	switch(parsedJSONMessage.messageType){
		
		case 2: //LoginResponseOK
			console.log("Player ID: " + parsedJSONMessage.playerID);
			playerId = parsedJSONMessage.playerID;
			processSuccessfulLogin();
			break;
		case 5: //CatalogChange
			console.log("Catalog changed: " + parsedJSONMessage.catalogName);
			activeCatalog = parsedJSONMessage.catalogName;
			highlichtChoosenCatalog(activeCatalog);
			break;
		case 6: //PlayerList
			console.log("PlayerList");
			var playerlist = parsedJSONMessage;
			curPlayerList = playerlist;
			updatePlayerList(playerlist);
			break;
		case 7: //StartGame
			console.log("Startgame");
			gameRunning = true;
			//clear login stuff
			clearLoginDiv();
			showGameDiv();
			//request first question
			sendWSMessage(8);
			break;
		case 9: //Question
			console.log("Question:" + parsedJSONMessage.question);
			curQuestion = parsedJSONMessage.question;
			curAnswer1 = parsedJSONMessage.answer1;
			curAnswer2 = parsedJSONMessage.answer2;
			curAnswer3 = parsedJSONMessage.answer3;
			curAnswer4 = parsedJSONMessage.answer4;
			curTimeOut = parsedJSONMessage.timeOut;
			showQuestion();
			isQuestionActive = true;
			break;
		case 11: // Question Result
			console.log("Correct: " + parsedJSONMessage.correct);
			
			// markiere Spielerauswahl rot
			if(curSelection != -1){
				document.getElementById(curSelection).style.borderColor = "red";
				document.getElementById(curSelection).style.backgroundColor = "#FF0800";				
			}
			
			
			// markiere korrekte Antworten grüen
			document.getElementById(parsedJSONMessage.correct).style.borderColor = "green";
			document.getElementById(parsedJSONMessage.correct).style.backgroundColor = "#8DB600";

			// -> false -> es können keine Antworten mehr geklickt werden
			isQuestionActive = false;
			
			window.setTimeout(function() {
				// frage nach zwei Sekunden neue Frage an
				sendWSMessage(8);
			}, 2000)			
			break;
		case 12: //GameOver
			console.log("GameOver - Spiel ist zuende");
			GameOver(parsedJSONMessage);
			break;
		case 255: //
			console.log("Error: " + parsedJSONMessage.errorMessage);
			if(parsedJSONMessage.fatal == 1){ //Spiel beenden
				var confirmDialog = confirm("Es ist ein fataler Fehler aufgetreten" + parsedJSONMessage.errorMessage + " Das Spiel wird beendet!\n\nNeues Spiel starten?");
				if(confirmDialog){
					//reload page
					location.reload();
				}else{
					//clean up playground div
					document.getElementById("playground").innerHTML = "<h1>Das Spiel wurde beendet!</h1><p><br><br><br><h3>Laden Sie die Seite neu um ein neues Spiel zu starten";
				}
			}else{
				alert("Es ist ein Fehler aufgetreten: " + parsedJSONMessage.errorMessage);
				console.log("Warning: " + parsedJSONMessage.errorMessage);
			}
			break;
		default:
			console.log("Received unknown message type");
			break;	

	}	
}




/*
 * Funktion sendet über Websocket Nachrichten im JSON-Format
 */

function sendWSMessage(type){
	// überprüfen ob websocket bereit ist zum senden
	if(readyToSend){
		
		var messageType = type.toString();
		var jsonData;
		var selection = curSelection;
		
		switch(type){
			case 1: // LoginRequest
				// get value of input field
				var inputName = window.document.getElementById("loginbox");
				var playerName = inputName.value;
				// LoginRequest with type + playername
				console.log("send MessageType 1");
				jsonData = JSON.stringify({
					messageType : messageType,
					loginName : playerName
				});
				break;
			case 5: //CatalogChange
				var catalogName = activeCatalog;
				// CatalogChange with type + catalogname
				console.log("send MessageType 5");
				jsonData = JSON.stringify({
					messageType : messageType,
					catalogName : catalogName
				});
				break;
			case 7: //StartGame
				var catalogName = activeCatalog;
				//StartGame with type + catalogname
				console.log("send MessageType 7");
				jsonData = JSON.stringify({
					messageType : messageType,
					catalogName : catalogName
				});
				console.log(catalogName);
				break;
			case 8: // QuestionRequest
				// QuestionRequest with type
				console.log("send MessageType 8");
				jsonData = JSON.stringify({
					messageType : messageType
				});				
				break;
			case 10: // QuestionAnswered
				// QuestionAnswered with type + selected answer		
				console.log("send MessageType 10");				
				jsonData = JSON.stringify({
					messageType : messageType,
					selection : selection
				});				
				break;
			default: // unknown type
				console.log("Can't send - unknown message type");
				break;
		}
		// send message
		socket.send(jsonData);
	}else{ //socket ist nicht bereit zum senden
		alert("Verbindung zum Server wurde noch nicht aufgebaut");
	}
}



/*
 * Funktion aktualisiert nach erfolgreichem Login den main-div
 * (Login-Feld + Button wird entfernt, abhängig von Spieler-ID wird der 
 * Start-Button angepasst, Kataloge werden angefordert
 */
function processSuccessfulLogin(){
	
	// remove login button + name input field
	//var mainDiv = document.getElementById("playground");
	//console.log(mainDiv);
	document.getElementById("loginFormular").remove();

	// change text of start button
    var buttonStart = window.document.getElementById("startButton");
	if(playerId == 0){
		// Spielleiter
		buttonStart.textContent = "Warte auf weitere Spieler ...";
	} else {
		// kein Spielleiter
		buttonStart.textContent = "Warte auf Spielstart ...";
		buttonStart.disabled = true;
	}
}


/*
 * Funnktion reagiert auf den Klick auf den
 * Login Button. Eingabe des Spielers wird
 * ausgwertet und an den Server gesendet
 */

function clickedLogin(event){

	var inputName = window.document.getElementById("loginbox");
	var playerName = inputName.value;
    // verify user name
	if (playerName === ""){
		alert("Es wurde kein Spielername eingegeben!");
	} else {
		// send LoginRequest
		sendWSMessage(1);
	}	
	event.stopPropagation();
}

/*
 * Funktion entfernt den Inhalt aus dem playground-div
 * (z.B. Login-Feld, Login-Button)
 */
function clearLoginDiv(){
    // clean up main div
    document.getElementById("playground").innerHTML = "";
}



/*
 * Listener für den Klick auf den Start-Button
 * Main-div wird aktualisert und eine Spiel-Starten-
 * Nachricht wird an den Server gesendet
 */
function clickedStart(event){

    // clean up main div
	clearLoginDiv();

    // send GameStart
    sendWSMessage(7);
    
    event.stopPropagation();
}

/*
 * Funktion zeigt aktuelle Frage, Antworten und Timeout an
 */
function showQuestion(){
	console.log("frage anzeigen");	
	
	document.getElementById("QuestionText").textContent = curQuestion;

	var answerText = [ curAnswer1, curAnswer2, curAnswer3, curAnswer4 ];

	var answers = document.getElementsByClassName("answerDiv");
	for (var i = 0; i < 4; i++) {
		answers[i].style.borderColor = "black";
		answers[i].style.backgroundColor = "white";
		answers[i].textContent = answerText[i];
	}
	document.getElementById("timeOut").textContent = "Time Out: " + curTimeOut	+ " Sekunden";
}


/*
 * Funktion aktualisiert den playground-div und legt darin Inhalte für 
 * Fragen, Antworten und Timeout an
 */

function showGameDiv(){
	
	var mainDiv = document.getElementById("playground");
	
	// div (container) für Überschrift (Fragenkatalog), Frage, Antworten, Timer
	var questDiv = document.createElement("div");
	questDiv.id = "questDiv";
	
	/*
	// Überschrift Fragenkatalog
	var title = document.createElement("h4");
	title.id = "GameDivTitle";
	title.textContent = "Fragekatalog: " + activeCatalog;
	*/
	
	// div für Frage
	var question = document.createElement("div");
	question.id = "QuestionText";
	question.style.fontSize = "1.7em";
	
	//questDiv.appendChild(title);
	questDiv.appendChild(question);

	var answers = [];

	for (var i = 0; i < 4; i++) {
		answers[i] = document.createElement("div");
		answers[i].className = "answerDiv";
		answers[i].id = i;

		answers[i].addEventListener("click", function(event) {
			if (isQuestionActive) {
				// lese Antwort auswahl aus
				curSelection = event.target.id;
				console.log("clicked answer: " + event.target.id);
				// sende QuestionAnwswered
				sendWSMessage(10);
			}
		}, false);
		// füge Frage dem div hinzu ("zeige Frage an")
		questDiv.appendChild(answers[i]);
	}
	
	// timout
	var timeOut = document.createElement("p");
	timeOut.id = "timeOut";
	
	// füge Time out dem div hinz
	questDiv.appendChild(timeOut);
	
	// füge für Überschrift (Fragenkatalog), Frage, Antworten, Timer dem main div hinzu
	mainDiv.appendChild(questDiv);
}


/*
 * Funktion zeigt Spielende und die Position
 * des Spielers an
 */
function GameOver(parsedJSONMessage) {
	var questDiv = document.getElementById("questDiv");
	while (questDiv.firstChild) {
		questDiv.removeChild(questDiv.firstChild);
	}
	var title = document.createElement("h3");
	title.textContent = "Game Over!";
	questDiv.appendChild(title);
	
	rank = parsedJSONMessage.rank;
	
	var confirmDialog = false;
	
	if(rank == 1){
		// Spiel gewonnen
		//alert("Glückwünsch. Sie haben das Spiel gewonnen!");
		confirmDialog = confirm("Glückwünsch. Sie haben das Spiel gewonnen!\n\nNeues Spiel starten?");
	} else {
		// Spiel nicht gewonnen
		// alert("Glückwünsch. Sie wurden " + rank + ".!");
		confirmDialog = confirm("Glückwünsch. Sie wurden " + rank + "!\n\nNeues Spiel starten?");
	}
	
	console.log("Game over. Reload page: " + confirmDialog);
	
	// hat der Spieler mit Ja oder Nein auf den Dialog geantwortet?
	if(confirmDialog){ // ja
		// reload page
		location.reload();
	} else { // nein
		// clean up main div
		if(rank == 1){
			document.getElementById("playground").innerHTML = "<h1>Glückwünsch. Sie haben das Spiel gewonnen!</h1><p><br><br><br><h3>Laden Sie die Seite neu um ein neues Spiel zu starten";			
		} else {
			document.getElementById("playground").innerHTML = "<h1>Glückwünsch. Sie wurden " + rank + "!</h1><p><br><br><br><h3>Laden Sie die Seite neu um ein neues Spiel zu starten";			
		}					
	}
}
















