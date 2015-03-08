var taskContextMenu = new Ext.menu.Menu('taskContext');

taskContextMenu.add(

  new Ext.menu.Item({text: 'Properties ...', handler:  taskProperties}),
  new Ext.menu.Separator(),
  new Ext.menu.Item({text: 'Delete ...', handler:  taskDelete})
);
function taskProperties(node) {
  Ext.Msg.alert('Task', 'Task properties');
}
function taskDelete(node) {
  Ext.Msg.alert('Task', 'Delete task');
}
Ext.onReady(function() {

	// Note: For the purposes of following along with the tutorial, all 
	// new code should be placed inside this method.  Delete the following
	// line after you have verified that Ext is installed correctly.
	
	alert("Congratulations!  You have Ext configured correctly!");
	 Ext.get('mytext').on('contextmenu', function(e){
	 alert("hello");	
         taskContextMenu.showAt(e.getXY());
            e.preventDefault();
    });
	
});
Ext.get('mytext').on('click', function(e)
{
 

});