function Texty(element) {
    var _element = element;
    var appliers = {};
    var _this = this;
    var versions = [], olderVersions = [], versionFallbackNeeded = false;
    var callbacks = [];
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
            var range = sel.getRangeAt(i);
            var rangeSelectedNodes = range.getNodes();
            if (range.collapsed) {
                rangeSelectedNodes.push(range.startContainer);
            }
            selectedNodes = selectedNodes.concat(rangeSelectedNodes);
        }
        return selectedNodes;
    };
    var getSelectedBlockNodes = function () {
        var selectedNodes = getSelectedNodes();
        var blockNodes = texty.utils.filterBlockNodes(selectedNodes);
        if (blockNodes.length === 0 && selectedNodes.length !== 0) {
            blockNodes.push(texty.utils.findFirstBlockParent(selectedNodes[0]));
        }
        return blockNodes.filter(function (node) {
            return _element.contains(node);
        });
    };
    _this.element = function () {
        return _element;
    };
    _this.addApplier = function (name, options) {
        if (options && !options.applyToEditableOnly) {
            options.applyToEditableOnly = true;
        }
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
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
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
    _this.addCallback = function (callback) {
        callbacks.push(callback);
    };
    _this.removeCallback = function (callback) {
        var index = callbacks.indexOf(callback);
        if (index > -1) {
            array.splice(index, 1);
        }
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
        var element = _element.cloneNode(true);
        var children = texty.utils.findChildren(element);
        // remove classes if needed
        Object.keys(appliers).map(function (name, index) {
            var removeClass = appliers[name].private.options.removeClass;
            if (removeClass) {
                var tagName = appliers[name].private.options.elementTagName || 'SPAN';
                for (var i = 0; i < children.length; i++) {
                    var node = children[i];
                    if (node.nodeName == tagName && node.classList.contains(name)) {
                        node.classList.remove(name);
                    }
                }
            }
        });
        // remove unused attributes
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            var attributesToRemove = [];
            for (var o = 0; o < node.attributes.length; o++) {
                var attributeName = node.attributes[o].name;
                if (node.getAttribute(attributeName) === "") {
                    attributesToRemove.push(attributeName);
                }
            }
            for (o = 0; o < attributesToRemove.length; o++) {
                node.removeAttribute(attributesToRemove[o]);
            }
        }
        return element.innerHTML;
    };
    _this.setBlockNodeTag = function (tagName) {
        if (texty.utils.blockTagNames.indexOf(tagName) === -1) {
            console.error(tagName + " is not a valid block element. Please add it to block tagnames.");
            return;
        }
        var blockNodes = getSelectedBlockNodes();
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
    _this.setAlign = function (type) {
        var blockNodes = getSelectedBlockNodes();
        for (var i = 0; i < blockNodes.length; ++i) {
            var blockNode = blockNodes[i];
            blockNode.style.textAlign = type;
        }
        _this.onChange();
    };
    _this.getAlign = function () {
        var blockNodes = getSelectedBlockNodes();
        if (blockNodes.length > 0) {
            var type = blockNodes[0].style.textAlign || 'left';
            for (var i = 1; i < blockNodes.length; ++i) {
                if ((blockNodes[i].style.textAlign || 'left') !== type)
                    type = undefined;
            }
            return type;
        }
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