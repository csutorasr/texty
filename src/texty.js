function Texty(element) {
    var _element = element;
    var appliers = {};
    var _this = this;
    var getSelectedNodes = function () {
        var sel = rangy.getSelection();
        var selectedNodes = [];
        for (var i = 0; i < sel.rangeCount; ++i) {
            selectedNodes = selectedNodes.concat(sel.getRangeAt(i).getNodes());
        }
        return selectedNodes;
    };
    _this.element = function () {
        return _element;
    };
    _this.addApplier = function (name, tagName, options) {
        var applier = rangy.createClassApplier(name);
        appliers[name] = {
            toggle: function () {
                applier.toggleSelection();
            },
            apply: function () {
                applier.applyToSelection();
            },
            remove: function () {
                applier.undoToSelection();
            },
            is: function () {
                return applier.isAppliedToSelection();
            }
        };
    };
    _this.getApplier = function (name) {
        if (appliers[name] !== undefined) {
            return appliers[name];
        }
    };
    _this.onSelectionEnds = function () {
        _this.isImageSelected = false; // TODO: check
        _this.isLinkSelected = false; // TODO: check
        while (_this.activeAppliers.length > 0) {
            _this.activeAppliers.pop();
        }
        Object.keys(appliers).map(function (name, index) {
            if (appliers[name].is()) {
                _this.activeAppliers.push(name);
            }
        });
        if (_this.selectionChanged !== undefined) {
            _this.selectionChanged();
        }
    };
    _this.onSelectionChanged = function (callback) {
        _this.selectionChanged = callback;
    };
    _this.parseInput = function (input) {
        _element.innerHTML = input;
    };
    _this.getOutput = function () {
        return _element.innerHTML;
    };
    _this.setBlockNodeTag = function (tagName) {
        var blockNodes = texty.utils.filterBlockNodes(getSelectedNodes());
        for (var i = 0; i < blockNodes.length; ++i) {
            var blockNode = blockNodes[i];
            var newNode = document.createElement(tagName);
            while (blockNode.firstChild) {
                newNode.appendChild(blockNode.firstChild);
            }
            for (var index = blockNode.attributes.length - 1; index >= 0; --index) {
                newNode.attributes.setNamedItem(blockNode.attributes[index].cloneNode());
            }
            blockNode.parentNode.replaceChild(newNode, blockNode);
        }
    };
    _this.isImageSelected = false;
    _this.isLinkSelected = false;
    _this.activeAppliers = [];
    _this.init();
}
Texty.prototype.init = function () {
    var element = this.element();
    element.setAttribute('contenteditable', 'true');
    element.addEventListener('keyup', this.onSelectionEnds);
    document.addEventListener('mouseup', this.onSelectionEnds);
};
Texty.prototype.destory = function () {
    var element = this.element();
    element.removeAttribute('contenteditable');
    element.removeEventListener('keyup', this.onSelectionEnds);
    document.removeEventListener('mouseup', this.onSelectionEnds);
};
function LoadTexty() {
    rangy.init();
    texty = window.texty = {};
    texty.init = function (element) {
        return new Texty(element);
    };
    texty.utils = {};
    LoadUtils();
}