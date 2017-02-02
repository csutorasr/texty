var editor = texty.init(document.getElementById('editor'));
editor.onSelectionChanged(function() {
    console.log(editor.activeAppliers);
});
console.log(editor);