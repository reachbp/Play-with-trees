

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class for Servlet: Controller2
 *
 */
 public class Controller extends javax.servlet.http.HttpServlet implements javax.servlet.Servlet {
   static final long serialVersionUID = 1L;
   
   
	public Controller() {
		super();
	}   	
	
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}  	
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	String caller=request.getParameter("SUBMIT");
	PrintWriter out=response.getWriter();
	if(caller.equalsIgnoreCase("add"))
	{/*
		Code to add a new File
	*/
		String name=request.getParameter("name");
		int par=Integer.parseInt(request.getParameter("par"));
		String leaf=request.getParameter("leaf");
		int position=Integer.parseInt(request.getParameter("pos"));
		int isD=0;
		System.out.println(name+ "  "+par+ "  "+leaf);
		if(leaf.equals("true"))
			isD=0;
		else
			isD=1;
		int ret = new DBConnection().insertNewNode(name, par,isD,position);
		System.out.println("the new id is"+ret);
		out.print(ret);
	}
	if(caller.equalsIgnoreCase("edit"))
	{
		/*
		 * Edit the name of the Node
		 */
		String newname=request.getParameter("name");
		int nodeid=Integer.parseInt(request.getParameter("nodeid"));
		boolean ret = new DBConnection().changeNodeName(nodeid,newname);
		out.print("node name changed");
	}
	if(caller.equalsIgnoreCase("delete"))
	{
		/*
		 * Delete a particular node
		 */
		int nodeid=Integer.parseInt(request.getParameter("nodeid"));
		boolean result=new DBConnection().deleteDescendants(nodeid);
		out.print(result);
	}
	if(caller.equalsIgnoreCase("drag"))
	{
		/*
		 * Drag and Drop a Node.And Update its position
		 */
		int nodeid=Integer.parseInt(request.getParameter("nodeid"));
		int parentid=Integer.parseInt(request.getParameter("par"));
		int parentFromDb=new DBConnection().getParentFromDB(nodeid);
		boolean res=false;
		if(parentid!=parentFromDb)
			res = new DBConnection().changeNodeParent(nodeid,parentid);
		int position =Integer.parseInt(request.getParameter("pos"));
		if(!res)
		{
			boolean ret = new DBConnection().updatePosition(nodeid,position);
		}
		else
		{
			boolean ret = new DBConnection().updatePositionFolder(nodeid,position);
		}
		out.println(res);
	}
	if (request.getParameter("SUBMIT").equalsIgnoreCase("load")) {
		/*
		 * Reload the Source Json
		 */
		System.out.println("this reached");
		FinalLoad lc = new FinalLoad();
		lc.Load();
	
		out.flush();
	}
	
	
	out.flush();
	}   	  	    
}