function LoadUtils(){
    texty.utils.blockTagNames = ['h1','h2','h3','h4'];
    texty.utils.filterBlockNodes = function(nodes) {
        return nodes.map(function(node){
            return texty.utils.blockTagNames.indexOf(node.tagName.toLowerCase()) !== -1;
        });
    };
}