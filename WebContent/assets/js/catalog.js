//var catalogOne = document.getElementById("catalogOne");
//var catalogSimple = document.getElementById("catalogSimple");
//var catalogSysProg = document.getElementById("catalogSysProg");


function catalogs(){	
	var catalogOne = document.getElementById("catalogOne");
	var catalogSimple = document.getElementById("catalogSimple");
	var catalogSysProg = document.getElementById("catalogSysProg");
	
	
	catalogOne.addEventListener("click", changeBackgroundColorOnClick, false);
	catalogOne.parameter = "one"; //catalogOne einen Parameter hinzufügen
	catalogSimple.addEventListener("click", changeBackgroundColorOnClick, false);
	catalogSimple.parameter = "simple";
	catalogSysProg.addEventListener("click", changeBackgroundColorOnClick, false);
	catalogSysProg.parameter = "sysprog";
}








function changeBackgroundColorOnClick(event){

	
	var catalogOne = document.getElementById("catalogOne");
	var currentColorOne = document.getElementById("catalogOne").style.backgroundColor; 
	
	var catalogSimple = document.getElementById("catalogSimple");
	var currentColorSimple = document.getElementById("catalogSimple").style.backgroundColor; 
	
	var catalogSysProg = document.getElementById("catalogSysProg");
	var currentColorSysProg = document.getElementById("catalogSysProg").style.backgroundColor;
	
	
	switch(event.target.parameter){ 
		
	case "one":	
			if(currentColorOne == ""){
				catalogOne.style.backgroundColor = "orangered";
			}
			else{
				catalogOne.style.backgroundColor = "";
			}
				
			if(currentColorSimple == "orangered"){
				catalogSimple.style.backgroundColor = "";
			}
				
			if(currentColorSysProg == "orangered"){
				catalogSysProg.style.backgroundColor = "";
			}
				
			break;
			
	case "simple":	
			if(currentColorSimple == ""){
				catalogSimple.style.backgroundColor = "orangered";
			}
			else{
				catalogSimple.style.backgroundColor = "";
			}
				
			if(currentColorOne == "orangered"){
				catalogOne.style.backgroundColor = "";
			}
				
			if(currentColorSysProg == "orangered"){
				catalogSysProg.style.backgroundColor = "";
			}
				
			break;
				
	case "sysprog":
			if(currentColorSysProg == ""){
				catalogSysProg.style.backgroundColor = "orangered";
			}
			else{
				catalogSysProg.style.backgroundColor = "";
			}
				
			if(currentColorOne == "orangered"){
				catalogOne.style.backgroundColor = "";
			}
				
			if(currentColorSimple == "orangered"){
				catalogSimple.style.backgroundColor = "";
			}
				
			break;
				
	default: alert("Parameter ungültig: " + event.target.parameter);
		
	}
}