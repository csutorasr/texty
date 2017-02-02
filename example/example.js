var editor = texty.init(document.getElementById('editor'));
editor.onSelectionChanged(function () {
    console.log(editor.activeAppliers);
});
editor.addApplier('bold', {
    elementTagName: 'strong',
    removeClass: true
});
editor.init();
console.log(editor);