function showQuestion(){
	var playground = document.getElementById("loginFormular").innerHTML = "";
	var frage = document.createTextNode("Welcher Mechanismus kann unter Unix zur Kommunikation über das Netzwerk verwendet werde?");
	
	var antwort_1 = document.createTextNode("Sockets");
	var antwort_2 = document.createTextNode("Message Queues");
	var antwort_3 = document.createTextNode("Pipes");
	var antwort_4 = document.createTextNode("Semaphore");
	
	var showQuestionBox = document.getElementById("showQuestionBox");
	
	var ul = document.createElement("ul");
	var liFrage = document.createElement("li");
	var li_1 = document.createElement("li");
	var li_2 = document.createElement("li");
	var li_3 = document.createElement("li");
	var li_4 = document.createElement("li");
	
	liFrage.appendChild(frage);
	li_1.appendChild(antwort_1);
	li_2.appendChild(antwort_2);
	li_3.appendChild(antwort_3);
	li_4.appendChild(antwort_4);
	
	ul.appendChild(liFrage); 
	ul.appendChild(li_1); 
	ul.appendChild(li_2); 
	ul.appendChild(li_3); 
	ul.appendChild(li_4); 
	showQuestionBox.appendChild(ul);

	
}