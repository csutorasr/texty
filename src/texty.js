function Texty(element) {
    var _element = element;
    var appliers = {};
    var _this = this;
    var versions = [], olderVersions = [], versionFallbackNeeded = false;
    var currentVersion = 0;
    var versionfallback = function () {
        if (versionFallbackNeeded) {
            versions = olderVersions.concat([]);
            if (currentVersion > versions.length) {
                currentVersion = versions.length;
            }
            else {
                currentVersion--;
            }
        }
    };
    var imageSelected = function () {
        _this.isImageSelected = true;
        _this.selectedImage = this;
        _this.onSelectionEnds();
    }, linkSelected = function () {
        _this.isLinkSelected = true;
        _this.selectedLink = this;
        _this.onSelectionEnds();
    };
    var innerHTMLChanged = function () {
        versionFallbackNeeded = false;
        _this.isImageSelected = false;
        _this.isLinkSelected = false;
        _this.selectedImage = undefined;
        _this.selectedLink = undefined;
        var children = texty.utils.findChildren(_element);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeName == "IMG") {
                child.addEventListener('click', imageSelected);
            }
            if (child.nodeName == "A") {
                child.addEventListener('click', linkSelected);
            }
        }
    };
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
    _this.addApplier = function (name, options) {
        var applier = rangy.createClassApplier(name, options);
        if (options && options.elementTagName) {
            options.elementTagName = options.elementTagName.toUpperCase();
        }
        appliers[name] = {
            public: {
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
            },
            private: {
                options: options
            }
        };
    };
    _this.getApplier = function (name) {
        if (appliers[name] !== undefined) {
            return appliers[name].public;
        }
    };
    _this.onSelectionEnds = function () {
        while (_this.activeAppliers.length > 0) {
            _this.activeAppliers.pop();
        }
        Object.keys(appliers).map(function (name, index) {
            if (appliers[name].public.is()) {
                _this.activeAppliers.push(name);
            }
        });
        if (_this.selectionChanged !== undefined) {
            _this.selectionChanged();
        }
        _this.isImageSelected = false;
        _this.isLinkSelected = false;
        _this.selectedImage = undefined;
        _this.selectedLink = undefined;
    };
    _this.onChange = function (e) {
        if (_this.isRedoable()) {
            versions = versions.filter(function (value, index) {
                return index < currentVersion;
            });
        }
        else {
            olderVersions = versions;
        }
        versions = versions.concat([]);
        currentVersion = versions.push(_element.innerHTML);
        versionFallbackNeeded = true;
    };
    _this.redo = function () {
        if (_this.isRedoable()) {
            currentVersion++;
            _element.innerHTML = versions[currentVersion - 1];
            innerHTMLChanged();
        }
    };
    _this.isRedoable = function () {
        return (currentVersion !== versions.length);
    };
    _this.undo = function () {
        if (_this.isUndoable()) {
            currentVersion--;
            _element.innerHTML = versions[currentVersion - 1];
            innerHTMLChanged();
        }
    };
    _this.isUndoable = function () {
        return (currentVersion !== 1);
    };
    _this.onSelectionChanged = function (callback) {
        _this.selectionChanged = callback;
    };
    _this.parseInput = function (input) {
        if (input !== undefined) {
            _element.innerHTML = input;
        }
        var children = texty.utils.findChildren(_element);
        Object.keys(appliers).map(function (name, index) {
            var tagName = appliers[name].private.options.elementTagName;
            if (tagName && tagName != 'SPAN') {
                for (var i = 0; i < children.length; i++) {
                    var node = children[i];
                    if (node.nodeName == tagName && !node.classList.contains(name)) {
                        node.classList.add(name);
                    }
                }
            }
        });
        innerHTMLChanged();
        _this.onChange();
    };
    _this.getOutput = function () {
        return _element.innerHTML;
    };
    _this.setBlockNodeTag = function (tagName) {
        if (texty.utils.blockTagNames.indexOf(tagName) === -1) {
            console.error(tagName + " is not a valid block element. Please add it to block tagnames.");
            return;
        }
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
        _this.onChange();
    };
    _this.keyboardShortcuts = function (e) {
        var evtobj = window.event ? event : e;
        if (evtobj.ctrlKey) {
            if (evtobj.keyCode == 90) {
                versionfallback();
                _this.undo();
            }
            if (evtobj.keyCode == 89) {
                versionfallback();
                _this.redo();
            }
            if (evtobj.keyCode == 86) {
                // TODO: ctrl+V
            }
        }
    };
    _this.isImageSelected = false;
    _this.isLinkSelected = false;
    _this.activeAppliers = [];
}
Texty.prototype.init = function () {
    var element = this.element();
    element.setAttribute('contenteditable', 'true');
    element.addEventListener('keyup', this.onSelectionEnds);
    element.addEventListener('input', this.onChange);
    document.addEventListener('mouseup', this.onSelectionEnds);
    element.addEventListener('keyup', this.keyboardShortcuts);
    this.parseInput();
    this.onChange();
};
Texty.prototype.destory = function () {
    var element = this.element();
    element.removeAttribute('contenteditable');
    element.removeEventListener('keyup', this.onSelectionEnds);
    element.removeEventListener('input', this.onChange);
    document.removeEventListener('mouseup', this.onSelectionEnds);
    document.removeEventListener('keyup', this.keyboardShortcuts);
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