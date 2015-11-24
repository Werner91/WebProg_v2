<!DOCTYPE html>
<html lang="en">
	<head >
		<meta charset="ISO-8859-1">
		<title>QUIZ</title>
		
		<!-- Bootstrap -->
    	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
    	
 		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
		
		<!-- CSS Datei -->
		<link href="assets/css/index.css" rel="stylesheet">
		
    	<!--JavaScript-->
    	<script type="text/javascript" src="assets/js/init.js"></script>
		<script type="text/javascript" src="assets/js/changeStyle.js"></script>
		<script type="text/javascript" src="assets/js/lauftext.js"></script>
		<script type="text/javascript" src="assets/js/login.js"></script>
		<script type="text/javascript" src="assets/js/catalog.js"></script>
		<script type="text/javascript" src="assets/js/question.js"></script>
		
		<!-- Javaklassen/Spielelogik import -->
		<%@ page import = "de.fhwgt.quiz.application.Quiz"%>
		<%@ page import = "de.fhwgt.quiz.application.Player"%>

		
		
	</head>
	<body>
	
	<% // erzeuge Spielelogik 
	Quiz quiz = Quiz.getInstance();%>
	
		<header class="page_header">
			<div>
				<h1>
					<span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span>
					<input class="laufschriftHeadline" type="text" size="50" name="webquiz_text" id="webquiz_headline">
				</h1>
			</div>
		</header>

		<div class="content">
			<div class="playground">
				<div id= "loginFormular" >			
				<!-- Loginformular -->
					<form action="Playerlist" method="get" >
						<label>
							Name:
							<input class="textbox" id="loginbox" type="text" name="name" size="30" maxlength="30"/>
						</label>
						<br>
						<input id=buttonLogin class="loginbutton" type="submit" name="name" value="Login"/>
						
						<!-- Loginname an Javascript senden
						<input id=buttonLogin class="loginbutton" type="submit" value="Login" onclick="addPlayerToTable()"/>
						 -->
						 
						<input id=startButton class="loginbutton" type="submit" value="Start" onclick="showQuestion()" />
					</form>
				
					
				 </div>
				 <div id="showQuestionBox">
				 </div>
			</div>
			
			<div class="catalogs" style="float:right">
				<h4>
				<span class="glyphicon glyphicon-book" aria-hidden="true"></span>
                <span>Catalogs</span>
                </h4>
                <hr/>
                <table id="catalogtable">
                	<tbody>		
                		
						<% String[] catalogList = Quiz.getInstance().getCatalogList().keySet().toArray(new String[0]);
							// display available catalogs 
							for(int i = 0; i < catalogList.length; i++){%>
						
					       	<div id="catalogName">
						   		<%= catalogList[i] %>
							</div>
				        <% } %>
                   
                              
                	<!-- HTML
	                	<tr><td class="catalogName" id="catalogOne">One</td></tr>
	                	<tr><td class="catalogName" id="catalogSimple">Simple</td></tr>
	                	<tr><td class="catalogName" id="catalogSysProg">SysProg</td></tr>
	                	-->
	                
	                	
                	</tbody>
                </table>
			</div>
			<br>
			<div class="highscore" style="float:right">
				<h4>
				<span class="glyphicon glyphicon-star" aria-hidden="true"></span>
                <span>Highscore</span>
                </h4>
                <hr/>
                <table id="highscoreTable" class="table table-hover">
          		<thead>
               		<tr>
               			<td>#</td>
                  		<td>Player</td>
        				<td>Score</td>
         			</tr>
				</thead>
				<tbody id="tablePlayerlistBody">
				<% Player[] playerList = Quiz.getInstance().getPlayerList().toArray(new Player[0]); 
					// build playerlist table
					if(playerList.length == 0){ 
				%>
						<tr>
						<td>Keine Spieler</td>
						<td></td>
						<td></td>
						</tr>
				<%
					} // there are players
					else {
						for(int i = 0; i < playerList.length ; i++){
				%>
				<tr>
					<td><%= i+1 %></td>
					<td><%= playerList[i].getName() %></td>
					<td><%= playerList[i].getScore() %></td>
				</tr>
				<%
						}
					}
				%>
               </tbody>
               </table>
			</div>
		</div>
		
		<footer>
		 	<hr/>
				<input class="loginbutton" type="button" onclick="changeStyleStandard()" value="Standard">
				<input class="loginbutton" type="button" onclick="changeStyleHalloween()" value="Halloween">
				<input class="loginbutton" type="button" onclick="changeStyleChristmas()" value="Christmas">
				<br/>
			 Gruppe: Stroh, Strohm, Steinbinder
		</footer>
	</body>
</html>