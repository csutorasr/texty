var editor = $('#editor').texty();
editor.on('texty-change', function () {
    /*if (editor.activeAppliers.indexOf('bold') !== -1) {
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
    document.getElementById('h1').classList.remove('active');
    document.getElementById('h2').classList.remove('active');
    document.getElementById('p').classList.remove('active');
    if (editor.blockNodeName) {
        document.getElementById(editor.blockNodeName.toLowerCase()).classList.add('active');
    }*/
});
editor.texty('addApplier', {
    name: 'bold',
    options: {
        elementTagName: 'strong',
        removeClass: true
    }
});
$('#bold').click(function () {
    editor.texty('getApplier', { name: 'bold' }).toggle();
});
$('#h1').click(function () {
    editor.texty('setBlockNodeTagName', { tagName: 'H1' });
});
$('#h2').click(function () {
    editor.texty('setBlockNodeTagName', { tagName: 'H2' });
});
$('#p').click(function () {
    editor.texty('setBlockNodeTagName', { tagName: 'P' });
});
$('#redo').click(function () {
    editor.texty('redo');
});
$('#undo').click(function () {
    editor.texty('undo');
});
$('#removeFormatting').click(function () {
    editor.texty('removeFormatting');
});
$('#increaseIndent').click(function () {
    editor.texty('increaseIndent');
});
$('#decreaseIndent').click(function () {
    editor.texty('decreaseIndent');
});
$('#left').click(function () {
    editor.texty('setAlign', { align: 'left' });
});
$('#center').click(function () {
    editor.texty('setAlign', { align: 'center' });
});
$('#right').click(function () {
    editor.texty('setAlign', { align: 'right' });
});
$('#justify').click(function () {
    editor.texty('setAlign', { align: 'justify' });
});
$('#output').click(function () {
    alert(editor.texty('getOutput'));
});
$('#image').click(function () {
    editor.texty('insertImage', { src: prompt('image, src=', '/asd') });
});
$('#link').click(function () {
    editor.texty('insertLink', { href: prompt('link, href=', '/asd') });
});