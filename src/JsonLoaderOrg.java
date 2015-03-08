import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import beans.TreeJson;
import beans.TreeNode;




public class JsonLoaderOrg {

public static void main(String args[]) 
{
	getJsonString();

}
public static void getJsonString()
{
	Connection con=new DBConnection().getConnection();
	JSONObject obj=new JSONObject();
	try {
		Statement st = con.createStatement();
		ResultSet rs = st
				.executeQuery("select * from treetable where parentid=0");

		TreeNode root = new TreeNode();
		while (rs.next()) {
			root.setNodeId(rs.getInt(1));
			root.setParentId(rs.getInt(2));
			root.setNodename(rs.getString(3));
			root.setDepth(rs.getInt(4));
			root.setLineage(rs.getString(5));
		}
		TreeJson treeJson=new TreeJson();
		treeJson.setNode(root.getNodename());
		treeJson.setNodeid(root.getNodeId());
		treeJson.setLeaf(false);
		treeJson.setCls("master-task");
		treeJson.setIconCls("task-folder");
		treeJson.setUiProvider("col");
		obj=new JSONObject(treeJson);
		obj.put("children", getJsonChild(treeJson.getNodeid()));

		JSONArray jsonArray=new JSONArray();
		jsonArray.put(obj);
		FileWriterXJ fwxj=new FileWriterXJ();
		fwxj.writeJSON(jsonArray.toString());
		
	} catch (SQLException e) {
		
		e.printStackTrace();
	} catch (JSONException e) {
		
		e.printStackTrace();
	}
}
public static JSONArray getJsonChild(int nodeid)
{
JSONArray temp=new JSONArray();
JSONObject myobj=null;
try {
	Connection con=new DBConnection().getConnection();
	Statement st=con.createStatement();
	ResultSet rs=st.executeQuery("select * from treetable where parentid="+nodeid+" order by position asc");
	int count=0;
	while(rs.next())
		count++;
	TreeNode[]  nodes=new TreeNode[count];rs.beforeFirst();
	int i=0;
	while(rs.next())
	{
		nodes[i]=new TreeNode();
		nodes[i].setNodeId(rs.getInt("nodeid"));
		nodes[i].setNodename(rs.getString("name"));
		if(rs.getInt("isdirectory")==1)
			nodes[i].setLeaf(false);
		else
			nodes[i].setLeaf(true);
		i++;
	}
	for(int j=0;j<count;j++)
	{
		TreeJson treeJson=new TreeJson();
		treeJson.setNode(nodes[j].getNodename());
		treeJson.setNodeid(nodes[j].getNodeId());
		if(nodes[j].isLeaf())
		{
			treeJson.setLeaf(true);
			treeJson.setIconCls("task");
		}
		else
		{
		treeJson.setLeaf(false);
		treeJson.setCls("master-task");
		treeJson.setIconCls("task-folder");
		}
		treeJson.setUiProvider("col");
		myobj= new JSONObject(treeJson);
		myobj.put("children",getJsonChild(treeJson.getNodeid()));
		temp.put(myobj);
	}
	
	return temp;
} catch (SQLException e) {
	
	e.printStackTrace();
} catch (JSONException e) {
	
	e.printStackTrace();
}

return temp;
}
}
