/*
 * Ext JS Library 2.1
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */
var tree;
var taskContextMenu = new Ext.menu.Menu('taskContext');

taskContextMenu.add(
  new Ext.menu.Item({text: 'Add Child', handler:  addChild}),
  new Ext.menu.Separator(),
  new Ext.menu.Item({text: 'Delete Node ', handler:  deleteChild})
);
function addChild(node) {

 var textO;
 textO=window.prompt("Enter the new Child Name");
  var child=tree.getSelectionModel().getSelectedNode();
  var childnode=new Ext.tree.TreeNode({text:textO,node:textO,nodeid:'1988'});
  child.appendChild(childnode);
  Ext.Msg.alert('File','child newNode added');
}
function deleteChild(node) {
  Ext.Msg.alert('Task', 'Are you sure to delete');
 var child=tree.getSelectionModel().getSelectedNode();
 child.remove();
  Ext.Msg.alert('File','Node deleted');
}
 var menuC = new Ext.menu.Menu('mainContext');
    menuC.add(
        new Ext.menu.CheckItem({text: 'Aujourd\'hui'}),
        new Ext.menu.CheckItem({text: 'Toutes dates'})
    );
Ext.onReady(function(){
  
   tree = new Ext.tree.ColumnTree({
        el:'tree-ct',
        width:400,
        autoHeight:true,
        rootVisible:false,
        autoScroll:false,
        title: 'File Directory Structure',
        animate:true,
        enableDD:true,
        containerScroll: true, 
        columns:[{
            header:'File',
            width:400,
            dataIndex:'node'
        }],

        loader: new Ext.tree.TreeLoader({
            dataUrl:'nodedata.json',
            uiProviders:{
                'col': Ext.tree.ColumnNodeUI
            }
        }),

        root: new Ext.tree.AsyncTreeNode({
            text:'Folders'
        })
       
         
     
    });
   
    tree.render();
    //tree.on('contextmenu', this.menuShow, this);
	tree.on('contextmenu', function(node){
		    taskContextMenu.show(node.ui.getEl());
            e.preventDefault();
    });
     
            menuShow : function(node){
            alert("menu clicked");
            taskContextMenu.show(node.ui.getEl());
        }
});
 
function aler()
{
var childs=tree.root.childNodes;
alert("number of children is"+childs.length);
for(var i=0;i<childs.length;i++)
{
alert("children length are"+childs[i].childNodes.length);
}
alert("call from external javascript "+tree.root.id);
}
function context()
{
Ext.get('myElement').on('contextmenu', function(e)
{
   myMenu.showAt(e.getXY());
}
);

}
function addChildNode()
{
var childnode=new Ext.tree.TreeNode({text:"ChildA"});
childnode.allowChildren=true;
childnode.uiProvider='col';
childnode.iconCls='task-folder';
tree.root.appendChild(childnode);
alert("child appended");
alert("Add child node called");
}
var xmlText="";
function writeAsXml()
{
var mytree=tree;
var myroot=tree.getRootNode();
var childone=myroot.firstChild;
alert("the first child is"+childone.id);
xmlText+="<node title='Parent' id='0'>"
getChilds(childone);
xmlText+="</node>";
document.getElementById("xml").value=xmlText;
sendXMLtoServer(xmlText);
alert('XML write called');
}
function getChilds(node1)
{
if(node1.leaf)
xmlText+="<node title='"+node1.attributes.node+"' id='"+node1.attributes.nodeid+"' parentid='"+node1.parentNode.attributes.nodeid+"' leaf='yes'>";
else
xmlText+="<node title='"+node1.attributes.node+"' id='"+node1.attributes.nodeid+"' parentid='"+node1.parentNode.attributes.nodeid+"' leaf='no'>";

var childs=node1.childNodes;
var l=childs.length;
var i=0;
while(l--)
{
getChilds(childs[i]);
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
alert("request to be dispatched");
var url="Controller?SUBMIT=xml&text="+text;
alert("the url is "+url);
xmlHttp.open("POST",url,false);
xmlHttp.send(null);
var z=xmlHttp.responseText;
alert("response is "+z);
return z
}