

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import de.fhwgt.quiz.loader.LoaderException;
import de.fhwgt.quiz.application.Quiz;


@WebServlet("/AjaxCatalogServerlet")
public class AjaxCatalogServerlet extends HttpServlet {
	
	
    /**
     * Default constructor
     */
    public AjaxCatalogServerlet() {
        // TODO Auto-generated constructor stub
    }
    
    
	/**
	 * Methode nimmt den AJAX-Get-Request entgegen, sendet Katalogliste an Client zur�ck
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	
    	String[] catalogList = null; // String-Array f�r Katalognamen
    	
    	// get catalogs
    	try {
    		
    		System.out.println("vorher");
			catalogList = Quiz.getInstance().getCatalogList().keySet().toArray(new String[0]);
			System.out.println(catalogList.length);
			System.out.println("nachher");
    	} catch (LoaderException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	// baue XML-Antwort String
    	String XMLresponse = "<main>";
    	
    	for(int i =0; i < catalogList.length; i++){
    		// System.out.println("katalog: " + catalogList[i]);
    		XMLresponse += "<catalogName>" + catalogList[i] + "</catalogName>";
    	}
    	
    	XMLresponse += "</main>";
    	
    	// setzte XML als ContentType
    	response.setContentType("text/xml");
    	
    	// sende Nachricht mit XML-String an Client
    	PrintWriter writer = response.getWriter();    	
    	writer.print(XMLresponse);    	
    }    
    
    
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}  
    
}