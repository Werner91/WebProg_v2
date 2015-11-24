import java.util.ArrayList;
import java.util.Scanner;
import java.io.File;
import java.io.IOException;


import org.jdom2.*;
import org.jdom2.input.SAXBuilder;

/*
import org.jdom.*;
import org.jdom.input.SAXBuilder;
*/

/**
 * Webprogrammierung Praktikum - Aufgabe 2
 * 
 * Klasse zeigt für ein gegebenes Verzeichnis alle darin enthaltenen Fragekataloge an und
 * für einen ausgewählten Katalog, die darin enthaltenen Fragen
 * 
 */

public class catalogReader{
	
	// Liste verwaltet die XML-Dateien (Fragenkataloge)
		private ArrayList<Document> xmlDocuments;
		
		
	/**
	 * Methode gibt die verfuegbaren Kataloge aus
	 */
	public void printCatalogs(){
		//Kataloge auslesen
		this.getXMLDocuments();
		//gebe verfuegbare Kataloge aus
		System.out.println("Verfuegbare Kataloge:");
		int i = 1;
		for(Document doc : this.xmlDocuments){
			Element fragenkatalog = doc.getRootElement();
			System.out.println("-" + fragenkatalog.getAttributeValue("name"));
		}
	}
	
	
	/**
	 * Methode fuegt Kataloge (XML-Dateien) zur Katalogverwaltung hinzu
	 */
	private void getXMLDocuments(){
		//Pfad zum Verzeichnis der die Fragekataloge beinhaltet
		String path = "../WebProg/catalogs";
		//String path ="../catalogs";
		File catalogFolder = new File(path);
		
		//Dateien in Verzeichnis auslesen und in array speichern
		String[] files = listFilesInfolder(catalogFolder);
		
		//fuege XML-Dateien (Frragekataloge) zur Katalogverwaltung hinzu.
		this.xmlDocuments = new ArrayList<Document>();
		for(String filename : files){
			try{
				if(isXMLFile(filename)){
					this.xmlDocuments.add(new SAXBuilder().build(filename));
				}
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
	
	}
	
	/**
	 * Methode ueberprueft anhand der Dateiendung ob es sich um eine XML-Datei handelt
	 * @param xmlFile zu pruefende Datei
	 * @return true falls XML-Datei
	 */
	private boolean isXMLFile(String xmlFile){
		String extension = "";
		
		//suche letzten '.' im Dateinamen
		int i = xmlFile.lastIndexOf('.');
		//sofern Punkt vorhanden, String zurecht schneiden
		if (i>0){
			extension = xmlFile.substring(i+1);
		}
		//pruefe Dateiendungen
		if(extension.equals("xml")){
			return true;
		}else{
			return false;
		}
	}
	
	
	
	/**
	 * Methode liest vorhandene Dateien in einem Verzeichnis aus 
	 * @param folder Verzeichnis in dem die Fragenkataloge liegen
	 * @return Stringarray mit den im uebergeben Verzeichnis enthaltenen Dateiname (Dateien)
	 */
	private String[] listFilesInfolder(File folder){
		ArrayList<String> fileList = new ArrayList<String>();
		//fuege der Liste alle Dateien aus dem Verzeichnis hinzu
		for(File fileEntry : folder.listFiles()){
			fileList.add(fileEntry.getAbsolutePath());
		}
		return fileList.toArray(new String[fileList.size()]);
	}
	
	
	/**
	 * Methode gibt Fragen + Antworten aus
	 * @param katalogwahl
	 */
	public void printQuestions(String katalogwahl){
		boolean catalogExists = false;
		
		//gehe Liste aller Kataloge durch
		for(Document xmlDocuments : this.xmlDocuments){
			Element katalog = xmlDocuments.getRootElement();
			//pruefe ob katalogname uebereinstimmt
			if(katalog.getAttributeValue("name").equals(katalogwahl)){
				catalogExists = true;
				//Gebe Katalog + Fragenanzahl aus
				System.out.println("\nGewaehlter Katalog: " + katalogwahl);
				System.out.println("\nAnzahl Fragen: " + katalog.getAttributeValue("fragenanzahl") + "\n");
				//gehe Fragen durch
				int i = 1;
				for (Element question : katalog.getChildren()){
					//gebe Fragen aus
					System.out.print("\n\t[Frage " + i++ + "] " + question.getChildText("frage"));
					//gebe Timeout aus
					if(question.getAttributeValue("timeout") == null){
						System.out.println(" (Timeout: -)");
					}else{
						System.out.println("(Timeout: " + question.getAttributeValue("timeout") + ")");
					}
					//gebe Antworten aus
					for(Element antwort : question.getChildren("antwort")){
						System.out.print("\t - " + antwort.getText());
						if(antwort.getAttributeValue("korrekt").equals("true")){
							System.out.println(" (richtig)\n");
						}else{
							System.out.println("\n");
						}
					}
				}
			}
		}
		//Katalog existiert nicht
		if(catalogExists == false){
			System.out.println("\nGewaehlter Katalog ist nicht vorhanden.");
		}
	}
	
	
	
	
	
	
	
	public static void main(String[] args){
		System.out.println("catalogReader aufgerufen!");
		/*
		try {
		*/
			catalogReader reader = new catalogReader();
			// gebe verfuegbare Kataloge aus
			reader.printCatalogs();
			
			
			//zu welchem Katalog sollen Fragen ausgegebe werden?
			System.out.println("\n Zu welchem Katalog sollen die Fragen ausgegeben werden: ");
			Scanner scan = new Scanner(System.in);
			String katalogwahl = scan.nextLine();
			
			// gebe Fragen zu gewaehltem Katalog aus
			reader.printQuestions(katalogwahl);
			
			/*
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		*/
	}
}