package beans;

public class TreeJson {
	String node="";
	int nodeid=0;
	String uiProvider="";
	boolean leaf=false;
	String cls="";
	String iconCls="";
	public String getNode() {
		return node;
	}
	public void setNode(String node) {
		this.node = node;
	}
	
	public boolean isLeaf() {
		return leaf;
	}
	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}
	public String getCls() {
		return cls;
	}
	public void setCls(String cls) {
		this.cls = cls;
	}
	public String getIconCls() {
		return iconCls;
	}
	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}
	public void setNodeid(int nodeid) {
		this.nodeid = nodeid;
	}
	public int getNodeid() {
		return nodeid;
	}
	public String getUiProvider() {
		return uiProvider;
	}
	public void setUiProvider(String uiProvider) {
		this.uiProvider = uiProvider;
	}

}
