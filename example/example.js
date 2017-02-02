var editor = texty.init(document.getElementById('editor'));
editor.addCallback(function () {
    console.log(editor);
});
editor.addApplier('bold', {
    elementTagName: 'strong',
    removeClass: true
});
editor.init();