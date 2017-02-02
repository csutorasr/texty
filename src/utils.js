function LoadUtils() {
    texty.utils.blockTagNames = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "CANVAS", "DD", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE", "H1", "H2", "H3", "H4", "H5", "H6", "FOOTER", "FORM", "HEADER", "HGROUP", "HR", "LI", "MAIN", "NAV", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TFOOT", "UL", "VIDEO"];
    texty.utils.filterBlockNodes = function (nodes) {
        return nodes.filter(function (node) {
            return texty.utils.blockTagNames.indexOf(node.nodeName) !== -1;
        });
    };
}