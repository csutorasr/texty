(function () {
    jQuery.fn.extend({
        texty: function (fnName, parameters) {
            if (window.texty !== undefined) {
                if (fnName === undefined) {
                    return this.each(function () {
                        var element = this;
                        var $element = $(element);
                        var editor = window.texty.init(element);
                        editor.init();
                        $element.data('texty', editor);
                        editor.addCallback(function () {
                            $element.trigger('texty-change');
                        });
                    });
                }
                else {
                    var element = this[0];
                    var editor = $(element).data('texty');
                    if (editor) {
                        switch (fnName) {
                            case 'addApplier':
                                return editor.addApplier(parameters.name, parameters.options);
                                break;
                            case 'getApplier':
                                return editor.getApplier(parameters.name);
                                break;
                            case 'redo':
                                return editor.redo();
                                break;
                            case 'isRedoable':
                                return editor.isRedoable();
                                break;
                            case 'undo':
                                return editor.undo();
                                break;
                            case 'isUndoable':
                                return editor.isUndoable();
                                break;
                            case 'parseInput':
                                return editor.parseInput(parameters.input);
                                break;
                            case 'getOutput':
                                return editor.getOutput();
                                break;
                            case 'setBlockNodeTagName':
                                return editor.setBlockNodeTagName(parameters.tagName);
                                break;
                            case 'increaseIndent':
                                return editor.increaseIndent();
                                break;
                            case 'decreaseIndent':
                                return editor.decreaseIndent();
                                break;
                            case 'setAlign':
                                return editor.setAlign(parameters.type);
                                break;
                            case 'removeFormatting':
                                return editor.removeFormatting();
                                break;
                            case 'insertText':
                                return editor.insertText(parameters.text);
                                break;
                            case 'insertLink':
                                return editor.insertLink(parameters.href, parameters.text);
                                break;
                            case 'insertImage':
                                return editor.insertImage(parameters.src);
                                break;
                            case 'isImageSelected':
                                return editor.isImageSelected;
                                break;
                            case 'selectedImage':
                                return editor.selectedImage;
                                break;
                            case 'isLinkSelected':
                                return editor.isLinkSelected;
                                break;
                            case 'selectedLink':
                                return editor.selectedLink;
                                break;
                            case 'align':
                                return editor.align;
                                break;
                            case 'activeAppliers':
                                return editor.activeAppliers;
                                break;
                            case 'appliers':
                                return editor.appliers;
                                break;
                            default:
                                console.error("Function " + fnName + " not found.");
                                break;
                        }
                    }
                    console.log("Texty is not initialized on this element.");
                    return;
                }
            }
            console.error("Texty is not loaded");
            return this;
        }
    });
})();