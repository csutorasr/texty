function LoadUtils() {
    texty.utils.blockTagNames = ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "CANVAS", "DD", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE", "H1", "H2", "H3", "H4", "H5", "H6", "FOOTER", "FORM", "HEADER", "HGROUP", "HR", "LI", "MAIN", "NAV", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION",/* "TABLE", "TFOOT",*/ "UL", "VIDEO"];
    texty.utils.inLineTagNames = ["B", "BIG", "I", "SMALL", "TT", "ABBR", "ACRONYM", "CITE", "CODE", "DFN", "EM", "KBD", "STRONG", "SAMP", "TIME", "VAR", "A", "BDO", "BR", "IMG", "MAP", "OBJECT", "Q", "SCRIPT", "SPAN", "SUB", "SUP", "BUTTON", "INPUT", "LABEL", "SELECT", "TEXTAREA"];
    texty.utils.filterBlockNodes = function (nodes) {
        return nodes.filter(function (node) {
            return texty.utils.blockTagNames.indexOf(node.nodeName) !== -1;
        });
    };
    texty.utils.filterInLineNodes = function (nodes) {
        return nodes.filter(function (node) {
            return texty.utils.inLineTagNames.indexOf(node.nodeName) !== -1;
        });
    };
    texty.utils.findChildren = function (element) {
        // [].slice.call() - HTMLCollection to Array
        var children = [].slice.call(element.children), found = 0;
        while (children.length > found) {
            children = children.concat([].slice.call(children[found].children));
            found++;
        }
        return children;
    };
    texty.utils.findFirstBlockParent = function(element) {
        while (texty.utils.blockTagNames.indexOf(element.nodeName) === -1) {
            element = element.parentNode;
        }
        return element;
    };
}