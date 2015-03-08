/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
var tree;
var beforeEditText;
var TreeContextMenu = new Ext.menu.Menu('treeContext');
/*Defines the context menu***/
TreeContextMenu.add(
  new Ext.menu.Item({text: 'Add File', handler:  addFileChild,iconCls:'add-file'}),
  new Ext.menu.Separator(),
  new Ext.menu.Item({text: 'Add Folder', handler:  addFolderChild,iconCls:'add-folder'}),
  new Ext.menu.Separator(),
  new Ext.menu.Item({text: 'Edit Node Label ', handler: EditNode,iconCls:'edit-file'}),
  new Ext.menu.Separator(),
  new Ext.menu.Item({text: 'Delete Node ', handler:  deleteChild,iconCls:'delete-file'})
);
/***Add a file to the structure.Disable the allowChildren property***/
function addFileChild(node) {
	 var textO="newnode"; 
  	 var child=tree.getSelectionModel().getSelectedNode();
     var isleaf=child.attributes.leaf; 
     if(isleaf)
  	 Ext.Msg.alert('File','Cannot Add File to a file');
  	 else
      {
		Ext.Msg.prompt('Name', 'Enter the name of new file:', function(btn, text){
    	if (btn == 'ok'){
    	var invalid=inspectString(text);
    	if(invalid.length==0)
    	{
    	textO=text;
  		var childnode=new Ext.tree.TreeNode({text:textO,node:textO,nodeid:'1988',leaf:true,iconCls:'task'});
  		childnode.allowChildren=false;
  		childnode.leaf=true;
  		child.appendChild(childnode);
  		addNewNode(childnode);
  		Ext.Msg.alert('File','New File added');
  		}
  		else
  		{
  		Ext.Msg.alert('Error','Contains invalid chars '+invalid);
  		}
      }
});
 //Ext.Msg.alert('File','child newNode added');//}
}
}
/***Edit the label of the node..***/
function EditNode()
{
	Ext.Msg.prompt('Name', 'Enter the new NodeLabel:', function(btn, text){
    if (btn == 'ok'){
    var invalid=inspectString(text);
    	if(invalid.length==0)
    	{
     var child=tree.getSelectionModel().getSelectedNode();
     alert("the id is"+child.id);
 	child.setText(text); 	
 	child.attributes.node=text;
 	 EditNodeName(child);
 	Ext.Msg.alert('Done',"Changes updated");
 	}
  		else
  		{
  		Ext.Msg.alert('Error','Contains invalid Chars'+invalid);
  		}
    }
});
//Ext.Msg.alert("Node name edited");
}
/***Add a folder to the tree****/
function addFolderChild(node) {
	 var textO;
  	 var child=tree.getSelectionModel().getSelectedNode();
     var isleaf=child.attributes.leaf;
		if(isleaf)
			 Ext.Msg.alert('File','Cannot Add Folder to a file');
		else
			{
			 Ext.Msg.prompt('Folder', 'Enter the name of new folder:', function(btn, text){
		    if (btn == 'ok'){
		    var invalid=inspectString(text);
    		if(invalid.length==0)
    		{
		    textO=text;
		    var childnode=new Ext.tree.TreeNode({text:textO,node:textO,nodeid:'1988',leaf:false,cls:'master-task',iconCls:'task-folder'});
		    child.appendChild(childnode);
		    addNewNode(childnode);
		    Ext.Msg.alert('File','New Folder added');
		    }
		   else
  		{
  		Ext.Msg.show({
 			  title:'Error',
  			  msg: 'Contains invalid chars'+invalid,
  			  buttons: Ext.Msg.OK,
   			  animEl: 'elId',
   			  icon: Ext.MessageBox.WARNING
			});
  		}
  		}
	});
	 
}
}
/****Delete the current node from the tree****/
	function deleteChild(node) {
	 Ext.Msg.confirm('Confirm',' Are u sure to delete?', function(btn, text){
	    if (btn == 'yes'){
	    var child=tree.getSelectionModel().getSelectedNode();
	    if(child.attributes.nodeid=='1')
	    Ext.Msg.alert('File','You cant delete root');
	    else
       { child.remove();
       deleteNodeSer(child);
         Ext.Msg.alert('File','Node deleted');
         }
       }
		});
	}
/***The tree in invoked onDomready .***/
/***Define the Tree as a column tree.***/
	Ext.onReady(function(){
  
  		 tree = new Ext.tree.ColumnTree({
	     el:'tree-ct',
	     width:300,
         height:300,
     	//  autoHeight:true,
        rootVisible:false,
        autoScroll:true,
        title: 'File Directory Structure',
        animate:true,
        enableDD:true,
        containerScroll: true, 
        columns:[{
            header:'File Folder   ',
            width:300,
            dataIndex:'node'
        }],

        loader: new Ext.tree.TreeLoader({
            dataUrl:'nodedata.json',
            uiProviders:{
               'col': Ext.tree.ColumnNodeUI
           }
        }),
  

        root: new Ext.tree.AsyncTreeNode({
            text:'Folders',
            allowDrop : false
           
        })       
     
    });
 this.editor = new Ext.tree.TreeEditor(tree, {
maxLength: 40,
completeOnEnter :false,
cancelOnEsc:true,
completeOnEnter:true,
ignoreNoChange:true,
selectOnFocus:this.selectOnEdit
});
 editor.on('beforecomplete', function(e,value,startValue){
	var text=e.getValue();
	if(text.length==0)
	return false;
	var invalid=inspectString(text);
	   	if(invalid.length==0)
    	{
 			var child=tree.getSelectionModel().getSelectedNode();
   			child.setText(text); 	
 			child.attributes.node=text;
 			EditNodeName(child);
 			//Ext.Msg.alert('Done',"Changes updated");
 			return true;
 		}
 		else
 		{
 			Ext.Msg.show({
 			  title:'Error',
  			  msg: 'Contains invalid chars'+invalid+ '  '+beforeEditText,
  			  buttons: Ext.Msg.OK,
   			  animEl: 'elId',
   			  icon: Ext.MessageBox.ERROR
			});
			e.cancelEdit(false);
			return false;
		}
		//return false;
});  
editor.on('beforeshow',function(e){
	//	alert('this is before the edit');
		var child=tree.getSelectionModel().getSelectedNode();
		beforeEditText=child.attributes.node;
		});

// configuration for the tree editor

    new Ext.ToolTip({
        target: 'tip1',
        html: 'Proceed to Save the tree'
    });
     new Ext.ToolTip({
        target: 'tip2',
        html: 'Update Tree in DB'
    });
     new Ext.ToolTip({
        target: 'tip3',
        html: 'Refresh the Tree'
    });
    tree.render();
    //tree.on('contextmenu', this.menuShow, this);
	tree.on('contextmenu', function(node){
			node.select();
		    TreeContextMenu.show(node.ui.getAnchor());
            e.preventDefault();
    });
   tree.on('nodedrop', function(e){
    dragChildsSer(e.dropNode);
});   
            //menuShow : function(node){
         //   alert("menu clicked");
       //     taskContextMenu.show(node.ui.getEl());
      //  }
});
 	
		
		var xmlText="";
		function writeAsXml()
		{
		
		xmlText="";
	 	var mytree=tree;
		var myroot=tree.getRootNode();
	var childone=myroot.firstChild;
		xmlText+="<node title='Parent' id='0'>";
		getChilds(childone,1);
		xmlText+="</node>";
		//document.getElementById("xml").value=xmlText;
		sendXMLtoServer(xmlText);
		}
		function getChilds(node1,pos)
		{
		if(node1.leaf)
		xmlText+="<node title='"+node1.attributes.node+"' id='"+node1.attributes.nodeid+"' parentid='"+node1.parentNode.attributes.nodeid+"' leaf='yes' position='"+pos+"'>";
		else
		{
		if(node1.attributes.node=='Root')
		node1.parentNode.attributes.nodeid='0';
		xmlText+="<node title='"+node1.attributes.node+"' id='"+node1.attributes.nodeid+"' parentid='"+node1.parentNode.attributes.nodeid+"' leaf='no' position='"+pos+"'>";
		if(!node1.expanded)
		node1.expand();
		}
		var childs=node1.childNodes;
		var l=childs.length;
		var i=0;
		while(l--)
			{
			getChilds(childs[i],i+1);
			i++;
			}
		xmlText+="</node>";
		}
	
		
	var xmlHttp;
		function getAjaxRequest()
			{
			try
			  {
			  xmlHttp=new XMLHttpRequest();
			  }
			catch(e)
			  {
				  try
				    {
				    xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
				    }
				  catch(e)
			    {
				    alert ("Your browser does not support XMLHTTP!");
				    return; 	 
 				}
			  }
		  return xmlHttp;
			}
			
		function sendXMLtoServer(text)
			{
			var xmlHttp=getAjaxRequest();
			var url="Controller?SUBMIT=xml&text="+text;
			xmlHttp.open("POST",url,false);
			xmlHttp.send(null);
			var z=xmlHttp.responseText;
			Ext.Msg.alert('From Server',z);
			}
		function loadComplete()
		{ 
			var xmlHttpNew=getAjaxRequest();
  			var url="Controller?SUBMIT=load";
	        xmlHttpNew.open("POST",url,false);
            Ext.MessageBox.show({
	        msg: 'Saving your data, please wait...',
           progressText: 'Saving...',
           width:300,
           wait:true,
           waitConfig: {interval:200},
           icon:'ext-mb-download', //custom class in msg-box.html
           animEl: 'mb7'
       });
        setTimeout(function(){
      xmlHttpNew.send(null);
         var z=xmlHttpNew.responseText;
           Ext.MessageBox.hide();
            Ext.Msg.alert('Done',' Your data was saved!');
        },4000);
             }
function refreshDoc()
{
 // window.location.reload();
// window.location.reload();
//  window.location.reload();
 tree.root.reload();
}
/***Send Request to server***/
function addNewNode(cnode)
{
var name=cnode.attributes.node;
var par=cnode.parentNode.attributes.nodeid;
var leaf=cnode.leaf; 
var count=1;
var temp=cnode;
while(temp.previousSibling!=null)
{
count=count+1;
temp=temp.previousSibling;
}
var xmlHttp=getAjaxRequest();
var url="Controller?SUBMIT=add&par="+par+"&name="+name+"&leaf="+leaf+"&pos="+count;
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;
cnode.attributes.nodeid=z;

}
function EditNodeName(enode)
{
var nodeid=enode.attributes.nodeid;
var name=enode.attributes.node;
var xmlHttp=getAjaxRequest();
var url="Controller?SUBMIT=edit&nodeid="+nodeid+"&name="+name+"";
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;

}
function deleteNodeSer(dnode)
{
var xmlHttp=getAjaxRequest();
var nodeid=dnode.attributes.nodeid;
var url="Controller?SUBMIT=delete&nodeid="+nodeid+"";
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;

}
function dragChildsSer(pnode)
{
var nodeid=pnode.attributes.nodeid;
var xmlHttp=getAjaxRequest();
var par=pnode.parentNode.attributes.nodeid;
//find the position of this node 
var count=1;
var temp=pnode;
while(temp.previousSibling!=null)
{
count=count+1;
temp=temp.previousSibling;
}
var url="Controller?SUBMIT=drag&nodeid="+nodeid+"&par="+par+"&pos="+count+"";
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;
var cnodes=pnode.childNodes;
var l=0;
l=cnodes.length;
var i=0;
if(l>0)
{
while(l--)
{
dragChildsSer(cnodes[i]);
i++;
}
}
return;
}
function validate()
{
Ext.MessageBox.show({
	title:'Rename',
	msg: 'New name for ',
	buttons: Ext.MessageBox.OKCANCEL,
	prompt:true,
	vTimer: 600,
	value: "yyiyu",
	fn: function(btn, text) {
	if(btn=="ok")
	{
		var invalid=inspectString(text);
		alert('Invalid chars'+invalid);
	}
	}
  });
}
 function inspectString(s){
	
	var ref='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_- ';
	var invalidChars = '';
	var num = s.length;
	for (var i=0; i<num; i++) {
		if (ref.indexOf(s.substring(i,i+1)) == -1) 
			invalidChars += s.substring(i,i+1);
	}
	
	return invalidChars;
}
function aler()
{
alert("window is closed");
}