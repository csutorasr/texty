function LoadUtils(){
    texty.utils.blockTagNames = ['H1','H2','H3','H4'];
    texty.utils.filterBlockNodes = function(nodes) {
        return nodes.filter(function(node){
            return (node.tagName) && texty.utils.blockTagNames.indexOf(node.tagName) !== -1;
        });
    };
}