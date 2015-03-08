import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import beans.TreeNode;

public class DBConnection {
	public Connection getConnection() {
		/*
		 * Establishes Connection with the MySql databse and returns an Object
		 * of type Connection
		 */

		String driver = "com.mysql.jdbc.Driver";
		try {
			Class.forName(driver);
			String url = "jdbc:mysql://localhost/treetry1";
			Connection connection = java.sql.DriverManager.getConnection(url,
					"root", "root");
			return connection;
		} catch (SQLException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {

			e.printStackTrace();
		}
		return null;
	}

	public TreeNode getFromDB(int id) {
		/*
		 * Retrieves TreeNode from database
		 */
		TreeNode ret = new TreeNode();
		Connection con = this.getConnection();
		try {
			Statement st = con.createStatement();
			ResultSet rs = st
					.executeQuery("select * from treetable where nodeid=" + id);
			while (rs.next()) {
				ret.setNodeId(id);
				ret.setParentId(rs.getInt("parentid"));
				ret.setNodename(rs.getString("name"));
				ret.setLineage(rs.getString("lineage"));
				ret.setDepth(rs.getInt("depth"));
				ret.setPosition(rs.getInt("position"));
				return ret;
			}
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return ret;
	}

	public boolean changeNodeName(int id, String name) {
		/*
		 * Edit the Name of the Node
		 */
		Connection con = this.getConnection();
		try {
			Statement st = con.createStatement();
			int r = st.executeUpdate("update treetable set name='" + name
					+ "' where nodeid=" + id);
			if (r == 1)
				return true;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return false;
	}

	public boolean changeNodeParent(int id, int p_id) {
		/*
		 * This action is triggered when the node is dragged . The parent of the
		 * node is changed.
		 */
		Connection con = this.getConnection();
		try {
			Statement st = con.createStatement();
			ResultSet rs = st
					.executeQuery("select * from treetable where nodeid="
							+ p_id);
			String lineage = "";
			int depth = 6;
			while (rs.next()) {
				lineage = rs.getString("lineage");
				depth = rs.getInt("depth");
			}
			lineage += id + "/";
			depth += 1;
			System.out.println("new lineage is" + lineage + " and new depth is"
					+ depth + " and parent is" + p_id);
			int r = st.executeUpdate("update treetable set parentid=" + p_id
					+ " , lineage='" + lineage + "',depth=" + depth
					+ " where nodeid=" + id + "");
			System.out.println("update treetable set parentid=" + p_id
					+ " ,lineage='" + lineage + "' ,depth=" + depth
					+ " where nodeid=" + id + "");
			if (r == 1)
				return true;

		} catch (SQLException e) {

			e.printStackTrace();
		}

		return false;
	}

	public boolean updateNode(TreeNode node) {

		Connection con = this.getConnection();
		try {
			Statement st = con.createStatement();
			int r = st.executeUpdate("update treetable set parentid="
					+ node.getParentId() + "" + " ,name='" + node.getNodename()
					+ "',depth=" + node.getDepth() + ",lineage='"
					+ node.getLineage() + "'");
			if (r == 1)
				return true;
			else
				return false;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return false;
	}

	public int insertNewNode(String name, int par_id, int dir, int position) {
		Connection con = new DBConnection().getConnection();
		/*
		 * Insert a new node into the Database
		 */
		int depth = 0, id = 0;
		try {
			Statement st = con.createStatement();
			int t = st
					.executeUpdate("insert into treetable (parentid,name,isdirectory,position) values("
							+ par_id
							+ ",'"
							+ name
							+ "',"
							+ dir
							+ ","
							+ position + ")");
			ResultSet rs = st
					.executeQuery("select * from treetable where nodeid="
							+ par_id);
			String lineage = "";
			depth = 0;
			while (rs.next()) {
				lineage = rs.getString("lineage");
				depth = rs.getInt("depth");
			}
			rs = st.executeQuery("select * from treetable where parentid="
					+ par_id + " and name='" + name + "'");
			while (rs.next()) {
				id = rs.getInt("nodeid");
			}
			lineage += id + "/";
			depth += 1;
			int r = st
					.executeUpdate("update treetable set  lineage='" + lineage
							+ "',depth=" + depth + " where nodeid=" + id + "");
			if (r == 1)
				return id;
		} catch (SQLException e) {

			e.printStackTrace();
		}

		return -1;
	}

	public boolean updatePosition(int nodeid, int pos) {
		Connection con = new DBConnection().getConnection();
		try {
			/*
			 * Update the position of the Treenode.
			 * 
			 */
			Statement st = con.createStatement();
			// chck if position has been changed
			int r = 0;
			ResultSet rs1, rs2, rs3;
			ResultSet rs = st
					.executeQuery("select position from treetable where nodeid="
							+ nodeid);
			/*
			 * Compare with Old postion.
			 */
			int oldPosition = 0;
			while (rs.next())
				oldPosition = rs.getInt(1);
			int parentId = 0;
			rs = st.executeQuery("select parentid from treetable where nodeid="
					+ nodeid);
			while (rs.next())
				parentId = rs.getInt(1);

			if (oldPosition < pos) {
				/*
				 * The New Node is dragged down.
				 */
				rs = st
						.executeQuery("select nodeid,position from treetable where parentid="
								+ parentId
								+ " and position between "
								+ oldPosition
								+ " and "
								+ pos
								+ " and position <>" + oldPosition);
				while (rs.next()) {
					int pos2 = rs.getInt(2) - 1;
					int id = rs.getInt(1);
					Statement st1 = con.createStatement();
					r = st1.executeUpdate("update treetable set position="
							+ pos2 + " where nodeid=" + id);
				}
			}
			if (oldPosition > pos) {
				/*
				 * The Node is dragged above.The node's siblings which are above
				 * are to be pushed down
				 */
				rs = st
						.executeQuery("select nodeid,position from treetable where parentid="
								+ parentId
								+ " and position between "
								+ pos
								+ " and "
								+ oldPosition
								+ " and position <>"
								+ oldPosition);
				while (rs.next()) {
					int pos2 = rs.getInt(2) + 1;
					int id = rs.getInt(1);
					Statement st1 = con.createStatement();
					r = st1.executeUpdate("update treetable set position="
							+ pos2 + " where nodeid=" + id);
				}
			}
			if (oldPosition != pos)
				r = st.executeUpdate("update treetable set position=" + pos
						+ " where nodeid=" + nodeid);
			else
				r = 1;
			if (r == 1)
				return true;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return false;

	}

	public ArrayList getAllNodesFromDB() {
		/*
		 * Returns an ArrayList of all the node Id's
		 */
		try {
			ArrayList ret = new ArrayList();
			Connection con = this.getConnection();
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select * from treetable");
			int i = 0;
			while (rs.next()) {
				ret.add(rs.getInt(1));
			}
			return ret;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return null;
	}

	public boolean deleteNode(int id) {
		Connection con = new DBConnection().getConnection();
		try {
			/*
			 * Delete a node given the Id
			 */
			Statement st = con.createStatement();
			int t = st
					.executeUpdate("delete from treetable where nodeid=" + id);
			if (t == 1)
				return true;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return false;
	}

	public boolean deleteDescendants(int id) {
		Connection con = this.getConnection();
		try {
			/*
			 * Deletes a node and its descendants. Updates the position of the
			 * sibling nodes.
			 */
			Statement st = con.createStatement();
			ResultSet rs = st
					.executeQuery("select lineage from treetable where nodeid="
							+ id);
			String lineage = "";
			while (rs.next())
				lineage = rs.getString(1);
			// Update positions of other node when u delete this node
			ResultSet rs1 = st
					.executeQuery("select * from treetable where lineage like '"
							+ lineage + "%'");
			while (rs1.next()) {
				int parentid = rs1.getInt("parentid");
				int pos = rs1.getInt("position");
				Statement st1 = con.createStatement();
				int t = st1
						.executeUpdate("update treetable set position=position-1 where parentid="
								+ parentid + " and position >" + pos);
				System.out.println("nodes deleted " + t);
			}
			int r = st
					.executeUpdate("delete from treetable where lineage like '"
							+ lineage + "%'");
			if (r > 1)
				return true;
			else
				return false;
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return false;
	}

	public TreeNode[] allNodesFromDB()
	// public ArrayList allNodesFromDB()
	{
		Connection con = this.getConnection();

		try {
			/*
			 * Returns an array of TreeNodes. All nodes present in the database
			 */
			Statement st = con.createStatement();
			ResultSet rs = st.executeQuery("select * from treetable");
			int count = 0;

			while (rs.next()) {
				count++;
			}
			ArrayList nodesArray = new ArrayList(count);
			TreeNode[] nodes = new TreeNode[count];
			for (int i = 0; i < count; i++)
				nodes[i] = new TreeNode();
			rs.beforeFirst();
			int i = 0;
			while (rs.next()) {
				nodes[i].setNodeId(rs.getInt("nodeid"));
				nodes[i].setNodename(rs.getString("name"));
				nodes[i].setParentId(rs.getInt("parentid"));
				nodes[i].setDepth(rs.getInt("depth"));
				nodes[i].setPosition(rs.getInt("position"));
				nodes[i].setLineage(rs.getString("lineage"));
				nodesArray.add(nodes[i]);
				i++;
			}
			// return nodesArray;
			return nodes;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public int getParentFromDB(int nodeid) {
		Connection con = this.getConnection();
		try {
			/*
			 * Retreives the paent id from the Database givn the node id.
			 */
			Statement st = con.createStatement();
			ResultSet rs = st
					.executeQuery("select parentid from treetable where nodeid="
							+ nodeid);
			while (rs.next())
				return rs.getInt(1);
		} catch (SQLException e) {

			e.printStackTrace();
		}
		return -1;
	}

	public boolean updatePositionFolder(int nodeid, int position) {
		// The node is shifted across folders.
		// Update the position of all the subsequent nodes
		Connection con = this.getConnection();
		try {
			Statement st = con.createStatement();
			int parentid = 0;
			ResultSet rs = st
					.executeQuery("select parentid from treetable where nodeid="
							+ nodeid);
			while (rs.next())
				parentid = rs.getInt(1);
			int ret = st
					.executeUpdate("update treetable set position=position+1 where parentid="
							+ parentid + " and position>=" + position);
			ret = st.executeUpdate("update treetable set position=" + position
					+ "  where nodeid=" + nodeid);
			if (ret == 1)
				return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;

	}
}
