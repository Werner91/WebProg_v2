
	var headline = "WebQuiz";
	var begin = 0;
	var end = headline.length;
	

function lauftext(){

	document.getElementById("webquiz_headline").value = headline.substring(begin,end) + " " + headline.substring(0,begin);
	begin ++;
	if(begin >= end)
	{ 
	 begin = 0; 
	}
	/* Laufgeschwindigkeit: Höhere Zahl = langsamer */
	//setInterval("lauftext()", 250); 
}

 function animation(){
	 setInterval("lauftext()", 250); 
 }
	