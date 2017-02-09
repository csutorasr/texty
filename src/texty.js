function Texty(element) {
    var _element = element;
    var appliers = {};
    var _this = this;
    var versions = [];
    var callbacks = [];
    var currentVersion = 0;
    var imageSelected = function () {
        _this.isImageSelected = true;
        _this.selectedImage = this;
        onSelectionEnds();
    }, linkSelected = function () {
        _this.isLinkSelected = true;
        _this.selectedLink = this;
        onSelectionEnds();
    };
    var innerHTMLChanged = function () {
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
    var getSelectedNodes = function (sel) {
        sel = sel || rangy.getSelection();
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
    var getSelectedBlockNodes = function (sel) {
        var selectedNodes = getSelectedNodes(sel);
        var blockNodes = texty.utils.filterBlockNodes(selectedNodes);
        if (blockNodes.length === 0 && selectedNodes.length !== 0) {
            blockNodes.push(texty.utils.findFirstBlockParent(selectedNodes[0]));
        }
        return blockNodes.filter(function (node) {
            return _element.contains(node) && node != _element;
        });
    };
    _this.element = function () {
        return _element;
    };
    _this.appliers = {};
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
                    onSelectionEnds();
                },
                apply: function () {
                    applier.applyToSelection();
                    onSelectionEnds();
                },
                remove: function () {
                    applier.undoToSelection();
                    onSelectionEnds();
                },
                is: function () {
                    return applier.isAppliedToSelection();
                }
            },
            private: {
                options: options
            }
        };
        _this.appliers[name] = appliers[name].public;
    };
    _this.getApplier = function (name) {
        if (appliers[name] !== undefined) {
            return appliers[name].public;
        }
    };
    var onSelectionEnds = function () {
        // set active appliers
        while (_this.activeAppliers.length > 0) {
            _this.activeAppliers.pop();
        }
        Object.keys(appliers).map(function (name, index) {
            if (appliers[name].public.is()) {
                _this.activeAppliers.push(name);
            }
        });
        // getAlign, and nodeName
        var blockNodes = getSelectedBlockNodes();
        _this.align = undefined;
        _this.blockNodeName = undefined;
        if (blockNodes.length > 0) {
            _this.align = blockNodes[0].style.textAlign || 'left';
            _this.blockNodeName = blockNodes[0].nodeName;
            for (var o = 1; o < blockNodes.length; ++o) {
                if ((blockNodes[o].style.textAlign || 'left') !== _this.align) {
                    _this.align = undefined;
                }
                if (blockNodes[o].nodeName !== _this.blockNodeName) {
                    _this.blockNodeName = undefined;
                }
            }
        }
        // run callbacks
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[i]();
        }
        _this.isImageSelected = false;
        _this.isLinkSelected = false;
        _this.selectedImage = undefined;
        _this.selectedLink = undefined;
    };
    var onChange = function (e) {
        if (_this.isRedoable()) {
            versions = versions.filter(function (value, index) {
                return index < currentVersion;
            });
        }
        if (_element.innerHTML !== versions[versions.length - 1]) {
            versions = versions.concat([]);
            currentVersion = versions.push(_element.innerHTML);
        }
        onSelectionEnds();
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
        onChange();
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
    _this.setBlockNodeTagName = function (tagName) {
        if (texty.utils.blockTagNames.indexOf(tagName) === -1) {
            console.error(tagName + " is not a valid block element. Please add it to block tagnames.");
            return;
        }
        var sel = rangy.getSelection();
        var blockNodes = getSelectedBlockNodes(sel);
        var range = rangy.createRange();
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
            if (i == 0) {
                range.setStartBefore(newNode);
            }
            if (i == blockNodes.length - 1) {
                range.setEndAfter(newNode);
            }
        }
        sel.setSingleRange(range);
        onChange();
    };
    var toggleBlockNodeTagName = function (tagName) {
        if (_this.blockNodeName == tagName) {
            _this.setBlockNodeTagName("P");
        }
        else {
            _this.setBlockNodeTagName(tagName);
        }
    }
    _this.increaseIndent = function (type) {
        var sel = rangy.getSelection();
        var blockNodes = getSelectedBlockNodes(sel);
        var range = rangy.createRange();
        for (var i = 0; i < blockNodes.length; ++i) {
            var blockNode = blockNodes[i];
            blockNode.style.textIndent = (parseFloat(blockNode.style.textIndent || 0) + 20) + 'px';
        }
        range.setStartBefore(blockNodes[0]);
        range.setEndAfter(blockNodes[blockNodes.length - 1]);
        sel.setSingleRange(range);
        onChange();
    };
    _this.decreaseIndent = function (type) {
        var sel = rangy.getSelection();
        var blockNodes = getSelectedBlockNodes(sel);
        var range = rangy.createRange();
        for (var i = 0; i < blockNodes.length; ++i) {
            var blockNode = blockNodes[i];
            blockNode.style.textIndent = (parseFloat(blockNode.style.textIndent || 0) - 20) + 'px';
            if (parseFloat(blockNode.style.textIndent) <= 0)
                blockNode.style.textIndent = "";
        }
        range.setStartBefore(blockNodes[0]);
        range.setEndAfter(blockNodes[blockNodes.length - 1]);
        sel.setSingleRange(range);
        onChange();
    };
    _this.setAlign = function (type) {
        var sel = rangy.getSelection();
        var blockNodes = getSelectedBlockNodes(sel);
        var range = rangy.createRange();
        for (var i = 0; i < blockNodes.length; ++i) {
            var blockNode = blockNodes[i];
            blockNode.style.textAlign = type;
        }
        range.setStartBefore(blockNodes[0]);
        range.setEndAfter(blockNodes[blockNodes.length - 1]);
        sel.setSingleRange(range);
        onChange();
    };
    _this.removeFormatting = function () {
        var selectedNodes = getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; i++) {
            var selectedNode = selectedNodes[i];
            if (texty.utils.blockTagNames.indexOf(selectedNode.nodeName) === -1) {
                var newNode = document.createTextNode(selectedNode.textContent);
                selectedNode.parentNode.replaceChild(newNode, selectedNode);
            }
        }
    };
    _this.insertText = function (text) {
        if (!Array.isArray(text)) {
            text = text.split("\n");
        }
        var blockNodes = getSelectedBlockNodes();
        var referenceNode;
        if (blockNodes.length > 0) {
            referenceNode = blockNodes[blockNodes.length - 1];
        }
        else {
            referenceNode = _element.children[_element.children.length - 1];
        }
        while (text.length > 0) {
            var newNode = document.createElement('P');
            newNode.textContent = text.shift();
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            referenceNode = newNode;
        }
    };
    _this.insertLink = function (href, text) {
        text = text || 'Link';
        var sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
            var selectedNodes = getSelectedNodes(sel);
            for (var i = 0; i < selectedNodes.length; i++) {
                if (!_element.contains(selectedNodes[i])) {
                    return false;
                }
            }
            var range = sel.getRangeAt(0);
            var anchor;
            if (selectedNodes.length === 0 || range.toString() === '') {
                anchor = document.createElement("A");
                anchor.addEventListener('click', linkSelected);
                anchor.href = href;
                anchor.textContent = text;
                range.deleteContents();
                range.insertNode(anchor);
            }
            else {
                var applier = rangy.createClassApplier('texty-link-applier', {
                    elementTagName: 'a',
                    applyToEditableOnly: true
                });
                applier.applyToSelection();
                var anchors = _element.querySelectorAll('.texty-link-applier');
                for (var i = 0; i < anchors.length; i++) {
                    anchors[i].href = href;
                    anchors[i].addEventListener('click', linkSelected);
                    anchors[i].classList.remove('texty-link-applier');
                }
                anchor = anchors[0];
            }
            return anchor;
        }
    };
    _this.insertImage = function (src) {
        var selectedNodes = getSelectedNodes();
        for (var i = 0; i < selectedNodes.length; i++) {
            if (!_element.contains(selectedNodes[i])) {
                return false;
            }
        }
        var sel = rangy.getSelection();
        if (sel.rangeCount > 0) {
            var range = sel.getRangeAt(0);
            range.collapse(false);
            var image = document.createElement("img");
            image.addEventListener('click', imageSelected);
            image.src = src;
            range.insertNode(image);
            return image;
        }
    };
    _this.toggleListType = function (type) {
        type = type || "UL";
        var blockNodes = getSelectedBlockNodes();
        var allSame = true;
        for (var i = 0; i < blockNodes.length; i++) {
            var Item = blockNodes[i];
        }
        var Lists = [], isListSelected = false;
        for (var i = 0; i < blockNodes.length; i++) {
            var Item = blockNodes[i];
            if (texty.utils.listTagNames.indexOf(Item.nodeName) !== -1) { // if list tag add to Lists
                if (Lists.indexOf(Item) === -1) {
                    Lists.push(Item);
                }
                if (Item.nodeName != type) {
                    allSame = false;
                }
            }
            else if (texty.utils.listItemTagNames.indexOf(Item.nodeName) !== -1) { // if listitem tag add its parents to the Lists
                if (Lists.indexOf(Item.parentNode) === -1) {
                    Lists.push(Item.parentNode);
                }
                if (Item.parentNode.nodeName != type) {
                    allSame = false;
                }
            }
            else { // if none of them turn them to listelements
                allSame = false;
            }
        }
        var Items = [];
        for (var i = 0; i < Lists.length; i++) {
            Items = Items.concat(Lists[i].children);
        }
        if (allSame) { // if all lists are from the same type
            if (Lists.length == 1) { // if one list is selected, then remove the list.
                // move elements outside the lists
                for (var i = 0; i < Lists.length; i++) {
                    var List = Lists[i];
                    var Items = List.children;
                    for (var i = 0; i < Items.length; i++) {
                        var Item = Items[i];
                        var newNode = document.createElement("P");
                        while (Item.firstChild) {
                            newNode.appendChild(Item.firstChild);
                        }
                        for (var index = Item.attributes.length - 1; index >= 0; --index) {
                            newNode.attributes.setNamedItem(Item.attributes[index].cloneNode());
                        }
                        Item.parentNode.parentNode.insertBefore(newNode, Item.parentNode);
                    }
                }
                // remove lists
                while (Lists.length > 0) {
                    Lists.pop().remove();
                }
            }
            else { // if more list is selected, then merge them into one list

            }
            var selectedSeen = false;
            for (var i = 0; i < Items.length; i++) {
                var Item = Items[i];
                if (Item.nodeName == "LI") {
                    if (selectedSeen) {
                    }
                    else {
                    }
                }
                else {
                }
            }
        }
        else { // if there are different types
            for (var i = 0; i < blockNodes.length; i++) {
                var Item = blockNodes[i];
                if (Item.nodeName != type && Item.nodeName != "LI") {
                    var newNode = document.createElement(type);
                    while (Item.firstChild) {
                        newNode.appendChild(Item.firstChild);
                    }
                    for (var index = Item.attributes.length - 1; index >= 0; --index) {
                        newNode.attributes.setNamedItem(Item.attributes[index].cloneNode());
                    }
                    Item.parentNode.replaceChild(newNode, Item);
                }
            }
        }
    };
    var keyboardRemap = function (e) {
        var evtobj = window.event ? event : e;
        if (evtobj.keyCode == 9) {
            if (evtobj.shiftKey) {
                _this.decreaseIndent();
            }
            else {
                _this.increaseIndent();
            }
            e.preventDefault();
            return false;
        }
        if (evtobj.ctrlKey) { // Ctrl +
            switch (evtobj.keyCode) {
                case 90: // Z
                    _this.undo();
                    e.preventDefault();
                    break;
                case 89: // Y
                    _this.redo();
                    e.preventDefault();
                    break;
                case 66: // B
                    if (appliers.bold) {
                        appliers.bold.public.toggle();
                        e.preventDefault();
                    }
                    break;
                case 69: // E
                    _this.setAlign('center');
                    e.preventDefault();
                    break;
                case 73: // I
                    if (appliers.italics) {
                        appliers.italics.public.toggle();
                        e.preventDefault();
                    }
                    break;
                case 74: // J
                    _this.setAlign('justify');
                    e.preventDefault();
                    break;
                case 76: // L
                    _this.setAlign('left');
                    e.preventDefault();
                    break;
                case 77: // M
                    _this.increaseIndent();
                    e.preventDefault();
                    break;
                case 82: // R
                    _this.setAlign('right');
                    e.preventDefault();
                    break;
                case 85: // U
                    if (appliers.underline) {
                        appliers.underline.public.toggle();
                        e.preventDefault();
                    }
                    break;
            }
        }
        if (evtobj.altKey) {
            switch (evtobj.keyCode) {
                case 49: // 1
                    toggleBlockNodeTagName('H1');
                    e.preventDefault();
                    break;
                case 50: // 2
                    toggleBlockNodeTagName('H2');
                    e.preventDefault();
                    break;
                case 51: // 3
                    toggleBlockNodeTagName('H3');
                    e.preventDefault();
                    break;
                case 52: // 4
                    toggleBlockNodeTagName('H4');
                    e.preventDefault();
                    break;
                case 53: // 5
                    toggleBlockNodeTagName('H5');
                    e.preventDefault();
                    break;
                case 54: // 6
                    toggleBlockNodeTagName('H6');
                    e.preventDefault();
                    break;
            }
        }
    }
    _this.init = function () {
        var element = this.element();
        element.setAttribute('contenteditable', 'true');
        element.addEventListener('keyup', onSelectionEnds);
        element.addEventListener('input', onChange);
        document.addEventListener('mouseup', onSelectionEnds);
        element.addEventListener('keydown', keyboardRemap);
        this.parseInput();
        onChange();
    };
    _this.destory = function () {
        var element = this.element();
        element.removeAttribute('contenteditable');
        element.removeEventListener('keyup', onSelectionEnds);
        element.removeEventListener('input', onChange);
        document.removeEventListener('mouseup', onSelectionEnds);
        element.removeEventListener('keydown', keyboardRemap);
    };
    _this.isImageSelected = false;
    _this.isLinkSelected = false;
    _this.blockNodeName = undefined;
    _this.align = undefined;
    _this.activeAppliers = [];
}
function LoadTexty() {
    rangy.init();
    texty = window.texty = {};
    texty.init = function (element) {
        return new Texty(element);
    };
    texty.utils = {};
    LoadUtils();
}