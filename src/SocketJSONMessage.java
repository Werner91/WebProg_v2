import de.fhwgt.quiz.application.Player;
import de.fhwgt.quiz.application.Quiz;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;



public class SocketJSONMessage{
	
	private String JSONString; // enthaelt String, der aus JSON-Objekten mit der Methode toString() erzeugt wird
	
	private int messageType; //Typ der Nachrich, 1 = LoginRequest etc.
	private Object[] messageData = new Object[6]; //String, z.B. Spielername, Fragen, Antworten, ...
	
	
	/**
	 * Konstruktor baut JSON-Objekt aus Empfangsdaten (JSONString)
	 * @param JSONString String enth�lt Loginname, Katalogname
	 * @throws JSONException
	 */
	public SocketJSONMessage(String JSONString) throws JSONException{
		
		this.JSONString = JSONString;
		
		//lege neues JSON Objekt an
		JSONObject jObject = new JSONObject(this.JSONString);
		
		//lese messageType aus
		switch(jObject.getInt("messageType")){
		
			case 1: //LoginRequest
				System.out.println("LoginRequest");
				this.messageType = jObject.getInt("messageType");
				this.messageData[0] = jObject.getString("loginName");
				break;
			case 5: //CatalogChange
				System.out.println("CatalogChange 1:" + jObject.getString("catalogName"));
				this.messageType = jObject.getInt("messageType");
				this.messageData[0] = jObject.get("catalogName");
				break;
			case 7: //StartGame
				System.out.println("StartGame: " + jObject.getString("catalogName"));
				this.messageType = jObject.getInt("messageType");
				this.messageData[0] = jObject.getString("catalogName");
				break;
			case 8: //QuestionRequest
				System.out.println("QuestionRequest");
				this.messageType = jObject.getInt("messageType");
				break;
			case 10: //QuestionAnswer
				System.out.println("QuestionAnswer");
				this.messageType = jObject.getInt("messageType");
				this.messageData[0] = jObject.getLong("selection");
				break;
			default:
				break;
		}
	}
	
	
	
	/**
	 * Konstruktor baut JSON-Objekt um dieses an den Client zu senden
	 * @param messageType RFC-MessageType
	 * @param message String mit PlayerID, KatalogName, Fragen, Antworten, etc.
	 * @throws JSONException
	 */
	
	public SocketJSONMessage(int messageType, Object[] message) throws JSONException{
		
		this.messageType = messageType;
		this.messageData = message;
		
		//erstelle JSONObject und setze MessageType
		JSONObject jObject = new JSONObject();
		jObject.put("messageType", this.messageType);
		
		//setze MessageData (playerID, Katalogname, etc.)
		switch(this.messageType){
		
			case 2: //LoginResponseOK
				System.out.println("LoginResponseOK");
				jObject.put("playerID", this.messageData[0]);
				break;
			case 5: //CatalogChange
				System.out.println("CatalogChange 2: " + this.messageData[0]);
				jObject.put("catalogName", this.messageData[0]);
				break;
			case 9://Question
				System.out.println("Question");
				jObject.put("question", this.messageData[0]);
				jObject.put("answer1", this.messageData[1]);
				jObject.put("answer2", this.messageData[2]);
				jObject.put("answer3", this.messageData[3]);
				jObject.put("answer4", this.messageData[4]);
				jObject.put("timeOut", this.messageData[5]);
				break;
			case 11://QuestionResult
				System.out.println("QuestionResult");
				jObject.put("timeOut", this.messageData[0]);
				jObject.put("correct", this.messageData[1]);
				break;
			case 12: //GameOver
				System.out.println("GameOver");
				jObject.put("rank", this.messageData[0]);
				break;
			case 255: //Error
				System.out.println("Error");
				jObject.put("fatal", this.messageData[0]);
				jObject.put("errorMessage", this.messageData[1]);
				break;
			default:
				break;
		}
		
		//konvertiere JSON-Object zu String
		this.JSONString = jObject.toString();
		
	}
	
	
	/**
	 * Konstruktor baut JSON-Objekt aus MessageTyp
	 * @param messageType Typ der Nachricht
	 * @throws JSONException
	 */
	
	public SocketJSONMessage(int messageType) throws JSONException {
		
		this.messageType = messageType;
		
		//erstelle JSONObject und setze MessageType
		JSONObject jObject = new JSONObject();
		jObject.put("messageType", messageType);
		
		switch(this.messageType){
			
			case 6: //Playerlist
				Quiz quiz = Quiz.getInstance();
				
				String[] player_Name = new String[6];
				long[] player_Score = new long[6];
				
				//hole Spielerinformationen (Name + Punktzahl)
				int playercount=0;
				for(Player pTemp : quiz.getPlayerList()){
					player_Name[playercount] = pTemp.getName();
					player_Score[playercount] = pTemp.getScore();
					playercount++;
				}
				
				//sortiere Arrays nach Punktezahl
				for(int i = playercount; i>0; i--){
					for(int j=0; j<(playercount-1); j++){
						//vergleiche Spielstaende - ist Spielstand des nachfolgenden groesser - tausche Plaetze
						if(player_Score[j] < player_Score[j+1]){
							long temp_Score = player_Score[j];
							String temp_playerName = player_Name[j];
							
							player_Score[j] = player_Score[j+1];
							player_Name[j] = player_Name[j+1];
							
							player_Score[j+1] = temp_Score;
							player_Name[j+1] = temp_playerName;
						}
					}
				}
				
				//baue JSON Array
				JSONArray jArray = new JSONArray();
				for(int k = 0; k<playercount; k++){
					//Object for Player
					JSONObject jObjectPlayer = new JSONObject();
					//fil name + score in Object
					jObjectPlayer.put("playername", player_Name[k]);
					String score = Long.toString(player_Score[k]);
					jObjectPlayer.put("score", score);
					jArray.put(jObjectPlayer);
				}
				
				// f�ge Array dem Objekt hinzu -> Objekt enth�lt dann MessageType und ein Array, das wiederum Objekte enth�lt (mit Informationen zu Spieler + Punktestand
		    	// JSON String sieht dann wie folgt aus: message data Playerlist: {"messageType":6,"players":[{"score":"0","player":"dsgffd"},{"score":"0","player":"qwe"}]}
		    	jObject.put("players", jArray);
		    	break;
		    
			case 7://StartGame
				//nothing to do, no message content (beside message type)
				break;
			default:
				break;	
		}
		
		//konvertieren JSON-Objekt zu String
		this.JSONString = jObject.toString();
	}
	
	public String getJsonString(){
		return JSONString;
	}
	
	public int getMessageType(){
		return messageType;
	}
	
	public Object[] getMessage(){
		return messageData;
	}
		
}