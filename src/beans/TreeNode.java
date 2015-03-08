package beans;

public class TreeNode {
		int nodeId=0;
		int parentId=0;
		int depth=0;
		String lineage=" ";
		String nodename=" ";
		int position=0;
		boolean leaf=false;
		public int getNodeId() {
			return nodeId;
		}
		public void setNodeId(int nodeId) {
			this.nodeId = nodeId;
		}
		public int getParentId() {
			return parentId;
		}
		public void setParentId(int parentId) {
			this.parentId = parentId;
		}
		public int getDepth() {
			return depth;
		}
		public void setDepth(int depth) {
			this.depth = depth;
		}
		public String getLineage() {
			return lineage;
		}
		public void setLineage(String lineage) {
			this.lineage = lineage;
		}
		public String getNodename() {
			return nodename;
		}
		public void setNodename(String nodename) {
			this.nodename = nodename;
		}
		public int getPosition() {
			return position;
		}
		public void setPosition(int position) {
			this.position = position;
		}
		public boolean isLeaf() {
			return leaf;
		}
		public void setLeaf(boolean leaf) {
			this.leaf = leaf;
		}
}
