var editor = texty.init(document.getElementById('editor'));
editor.addCallback(function () {
    console.log(editor);
    if (editor.activeAppliers.indexOf('bold') !== -1) {
        document.getElementById('bold').classList.add('active');
    }
    else {
        document.getElementById('bold').classList.remove('active');
    }
    if (editor.isRedoable()) {
        document.getElementById('redo').classList.add('active');
    }
    else {
        document.getElementById('redo').classList.remove('active');
    }
    if (editor.isUndoable()) {
        document.getElementById('undo').classList.add('active');
    }
    else {
        document.getElementById('undo').classList.remove('active');
    }
    document.getElementById('left').classList.remove('active');
    document.getElementById('center').classList.remove('active');
    document.getElementById('right').classList.remove('active');
    document.getElementById('justify').classList.remove('active');
    if (editor.align) {
        document.getElementById(editor.align).classList.add('active');
    }
    if (editor.selectedImage) {
        editor.selectedImage.src = prompt('new src=','/asdnew');
    }
    if (editor.selectedLink) {
        editor.selectedLink.href = prompt('new href=','/asdnew');
    }
});
editor.addApplier('bold', {
    elementTagName: 'strong',
    removeClass: true
});
document.getElementById('bold').addEventListener('click',function () {
    editor.getApplier('bold').toggle();
});
document.getElementById('h1').addEventListener('click',function () {
    editor.setBlockNodeTagName('H1');
});
document.getElementById('h2').addEventListener('click',function () {
    editor.setBlockNodeTagName('H2');
});
document.getElementById('p').addEventListener('click',function () {
    editor.setBlockNodeTagName('P');
});
document.getElementById('redo').addEventListener('click',function () {
    editor.redo();
});
document.getElementById('undo').addEventListener('click',function () {
    editor.undo();
});
document.getElementById('removeFormatting').addEventListener('click',function () {
    editor.removeFormatting();
});
document.getElementById('increaseIndent').addEventListener('click',function () {
    editor.increaseIndent();
});
document.getElementById('decreaseIndent').addEventListener('click',function () {
    editor.decreaseIndent();
});
document.getElementById('left').addEventListener('click',function () {
    editor.setAlign('left');
});
document.getElementById('center').addEventListener('click',function () {
    editor.setAlign('center');
});
document.getElementById('right').addEventListener('click',function () {
    editor.setAlign('right');
});
document.getElementById('justify').addEventListener('click',function () {
    editor.setAlign('justify');
});
document.getElementById('output').addEventListener('click',function () {
    alert(editor.getOutput());
});
document.getElementById('image').addEventListener('click',function () {
    editor.insertImage(prompt('image, src=','/asd'));
});
document.getElementById('link').addEventListener('click',function () {
    editor.insertLink(prompt('link, href=','/asd'));
});
editor.init();