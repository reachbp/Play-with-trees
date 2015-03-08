var TreeTest = function(){

    var root, tree;
    var menuC = new Ext.menu.Menu('mainContext');
    menuC.add(
        new Ext.menu.CheckItem({text: 'Aujourd\'hui'}),
        new Ext.menu.CheckItem({text: 'Toutes dates'})
    );

    return {
        init : function(){
            // yui-ext tree
            tree = new Ext.tree.TreePanel('nav', {
                animate:true,
                loader: new Ext.tree.TreeLoader({dataUrl:'nodedata1.json'}),
                enableDD:true,
                containerScroll: true,
                dropConfig: {appendOnly:true}
            });

            // add a tree sorter in folder mode
            new Ext.tree.TreeSorter(tree, {folderSort:true});

            // set the root node
            root = new Ext.tree.AsyncTreeNode({
                text: 'PtahReg',
                draggable:false, // disable root node dragging
                id:'PtahReg'
            });
            tree.setRootNode(root);

            // render the tree
            tree.render();

            tree.on('contextmenu', this.menuShow, this);

            root.expand(false, /*no anim*/ false);

        //  assignConmenu();
        },

        menuShow : function(node ){
        //  alert ( "menuShow\n" + node.ui.getEl() );
            menuC.show(node.ui.getEl());
        }
    };
}();