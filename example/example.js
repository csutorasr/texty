var editor = texty.init(document.getElementById('editor'));
editor.onSelectionChanged(function() {
    console.log(editor.activeAppliers);
});
editor.addApplier('bold',{
    elementTagName: 'strong'
});
editor.init();
console.log(editor);