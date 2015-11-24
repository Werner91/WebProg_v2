import de.fhwgt.quiz.application.Quiz;
import de.fhwgt.quiz.application.Player;
import de.fhwgt.quiz.error.QuizError;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.*; 
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



/**
 * Servlet implementation class Playerlist
 */
@WebServlet("/Playerlist")
public class Playerlist extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public Playerlist() {
        
    	// TODO Auto-generated constructor stub
    }

    
    // Einsprung ins Servlet durch den servlet-Container um Initialisierungen vorzunehmen
    public void init(ServletConfig config) throws ServletException {
    	super.init(config);
    	System.out.println("Aufruf von init");
    } 
    
    
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String name = request.getParameter("name");

		if(name == null){
				response.getWriter().println("Fehler: Es wurde kein Name eingegeben");
			} else if("".equals(name)){
				// empty string
				response.getWriter().println("Fehler: Es wurde kein Name eingegeben");
			} else {
				// name OK - create new Player
				QuizError playerError = new QuizError();
				if(Quiz.getInstance().createPlayer(name, playerError) == null){
					// error - could not create player
					response.getWriter().println("Fehler beim Erstellen des Spielers: " + playerError.getType());
				} else {
					// successfully created player
					RequestDispatcher dispatcher = request.getRequestDispatcher("index.jsp");
					dispatcher.forward(request, response);    			
			}
		}
		
		//PrintWriter out = response.getWriter();
		//out.println("<html><Body>Hallo" + name + "</body></html>");
		//out.flush();
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
