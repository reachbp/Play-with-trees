import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.swing.tree.DefaultMutableTreeNode;

import org.jdom.DataConversionException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.xml.sax.ContentHandler;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;

import beans.TreeNode;

import com.sun.org.apache.xerces.internal.parsers.SAXParser;

public class XmlParserNew {
	int count = 0;
	ArrayList nodes = new ArrayList();
	TreeNode[] nodesDB=null;
	public void main(String args[]) {
		/*
		 * This Class takes the nodedata XMl and creates a Jtree.
		 * 
		 */
		ParserNew();
	}

	public void ParserNew() {
		XMLReader parser = new SAXParser();
		try {
			// ContentHandler contentHandler = new MyContentHandler();
			// parser.setContentHandler(contentHandler);
			// parser.parse("nodedata.xml");
			SAXBuilder b = new SAXBuilder();
			String path = "C:/Documents and Settings/Administrator/workspace/FolderTreeExtJS";
			//Get all nodes from the database
			nodesDB=new DBConnection().allNodesFromDB();
			Document doc = b.build(new FileInputStream(path + "/TreeData.xml"));
			Element rootT = doc.getRootElement();
			// System.out.println("before show childs "+webapp.getText());
			showChilds(rootT);
			// System.out.println("The number of children is "+count);
			/*
			 * Check for deleted nodes.. Count holds the Number of nodes present
			 * in the tree. Compare with the total number of nodes in the
			 * database
			 */
			updateDeletedNode(rootT);
			displayNodes();
			// System.out.println(webapp.getName());

		} catch (IOException e) {

			e.printStackTrace();
		} catch (JDOMException e) {

			e.printStackTrace();
		}

	}

	public void showChilds(Element elem) {
		count++;
		List allchilds = elem.getChildren();
		int nodeid = 0;
		try {
			nodeid = elem.getAttribute("id").getIntValue();
		} catch (DataConversionException e) {
			e.printStackTrace();
		}
		if (nodeid != 1988)
			nodes.add(nodeid);
		if (allchilds.size() != 0) {
			/** **Compare node with the one with Database*** */
			if (nodeid != 0)
				checkNodeChanged(elem);
			// System.out.println("the Element Title is "
			// + elem.getAttributeValue("title") + "and id is"
			// + elem.getAttributeValue("id"));
			for (int i = 0; i < allchilds.size(); i++)
				showChilds((Element) allchilds.get(i));
		} else {
			if (nodeid != 0)
				checkNodeChanged(elem);
			// System.out.println("the Element Title is "
			// + elem.getAttributeValue("title") + "and id is"
			// + elem.getAttributeValue("id"));
		}
	}

	public void checkNodeChanged(Element elem) {
		TreeNode current_node = new TreeNode();
		TreeNode from_DB = new TreeNode();
		TreeNode from_DBParent = new TreeNode();
		boolean nodeParentChanged = false;
		boolean nodeNameChanged = false;
		boolean nodePathChanged = false;
		boolean isNodeNew = false;
		boolean nodePositionChanged = false;
		int dep1 = 0, dep2 = 0;
		int id = 0;
		try {
			id = elem.getAttribute("id").getIntValue();
		} catch (DataConversionException e1) {
			e1.printStackTrace();
		}

		if (id != 1988) {
			try {
				/*
				 * Map the current Text node in the XML to a bean Object
				 */
				current_node.setNodeId(elem.getAttribute("id").getIntValue());
				current_node.setParentId(elem.getParentElement().getAttribute(
						"id").getIntValue());
				current_node.setNodename(elem.getAttributeValue("title")
						.toString());
				/*
				 * Get the corresponding TextNode properties from the databsse
				 */
				from_DB =getTreeNode(id); //new DBConnection().getFromDB(elem.getAttribute("id")
					//	.getIntValue());
				/*
				 * Get the Node Parent from the DB
				 */
				from_DBParent = getTreeNode(current_node.getParentId());//new DBConnection().getFromDB(current_node
						//.getParentId());
				/*
				 * Check If Node Name changed. If No..Go on to Check if the Node
				 * Parent is changed
				 */
				if (current_node.getNodename().equals(from_DB.getNodename())) {
					if (current_node.getParentId() == from_DB.getParentId())
						nodeParentChanged = false;
					else
						nodeParentChanged = true;
				} /*
					 * If the Node Name if changed.And If its parent is changed
					 */
				else {
					nodeNameChanged = true;
					if (current_node.getParentId() == from_DB.getParentId())
						nodeParentChanged = false;
					else
						nodeParentChanged = true;

				}
				// Get Lineage
				/*
				 * Check if the Path of the node from the root is changed
				 */
				String temp = from_DB.getLineage();
				String temp1 = "";
				if (current_node.getParentId() != 0)
					temp1 = from_DBParent.getLineage() + (from_DB.getNodeId())
							+ '/';
				else
					temp1 = "/" + from_DB.getNodeId() + "/";
				// System.out.println("temp " + temp + " and temp2 " + temp1);
				if (temp.equals(temp1)) {
					nodePathChanged = false;
				} else { // Update path
					current_node.setLineage(from_DBParent.getLineage()
							+ from_DB.getNodeId() + '/');
					current_node.setDepth(from_DBParent.getDepth() + 1);
				}
				/*
				 * Check if the Relative position within a parent has changed
				 * had changed
				 */
				current_node.setPosition(Integer.parseInt(elem
						.getAttributeValue("position")));
				dep1 = from_DB.getPosition();
				dep2 = current_node.getPosition();
				System.out.println("depths are " + dep1 + "   " + dep2);
				if (dep1 != dep2)
					nodePositionChanged = true;
				else
					nodePositionChanged = false;
			} catch (DataConversionException e) {

				e.printStackTrace();
			}
		} else
			isNodeNew = true;
		if (nodeNameChanged) {
			System.out.println("node Name  is changed .Update DB");
			boolean ret = new DBConnection().changeNodeName(current_node
					.getNodeId(), current_node.getNodename());
		}
		if (nodeParentChanged) {
			System.out.println("node parrent changed");
			boolean res = new DBConnection().changeNodeParent(current_node
					.getNodeId(), current_node.getParentId());
			}
		if (isNodeNew) {
			// Insert a new Node
			System.out.println("Node is new ");
			int isDirectory = 0;
			String name = elem.getAttributeValue("title");
			String isleaf = elem.getAttributeValue("leaf");
			int position=Integer.parseInt(elem.getAttributeValue("position"));
			if (!isleaf.equalsIgnoreCase("yes"))
				isDirectory = 1;
			int nodeid = id;
			try {
				int par_id = elem.getParentElement().getAttribute("id")
						.getIntValue();
				int ret = new DBConnection().insertNewNode(name, par_id,isDirectory,position);
				elem.setAttribute("id", "" + ret + "");
				String ids = elem.getAttributeValue("id");
				nodes.add(ret);
				System.out.println("the new attribute value is " + ids);
			} catch (DataConversionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if (nodePositionChanged) {
			// update DB for position
			System.out.println("position has been changed");
			boolean ret = new DBConnection().updatePosition(current_node
					.getNodeId(), dep2);
		}
	}
	public void updateDeletedNode(Element elem) {
		ArrayList ret = new DBConnection().getAllNodesFromDB();
		/*
		 * Check for deleted Nodes
		 */
		for (int i = 0; i < ret.size(); i++) {
			if (!nodes.contains(ret.get(i)))
			// Delete that node from database
			{
				System.out.println("Nod to be deleted is " + ret.get(i));
				new DBConnection().deleteNode(Integer.parseInt(ret.get(i)
						.toString()));
			}
		}
	}

	public void displayNodes() {
		for (int i = 0; i < nodes.size(); i++)
			System.out.println("The next node id is" + nodes.get(i));
	}
	public TreeNode getTreeNode(int nodeid)
	{
		TreeNode temp=new TreeNode();
		for(int i=0;i<nodesDB.length;i++)
			if(nodesDB[i].getNodeId()==nodeid)
				return nodesDB[i];
		return null;
	}
}

/** *Content handler** */
