var editor = $('#editor').texty();
editor.on('texty-change', function () {
    if (editor.texty('activeAppliers').indexOf('bold') !== -1) {
        $('#bold').addClass('active');
    }
    else {
        $('#bold').removeClass('active');
    }
    if (editor.texty('isRedoable')) {
        $('#redo').addClass('active');
    }
    else {
        $('#redo').removeClass('active');
    }
    if (editor.texty('isUndoable')) {
        $('#undo').addClass('active');
    }
    else {
        $('#undo').removeClass('active');
    }
    $('#left').removeClass('active');
    $('#center').removeClass('active');
    $('#right').removeClass('active');
    $('#justify').removeClass('active');
    if (editor.texty('align')) {
        document.getElementById(editor.texty('align')).classList.add('active');
    }
    if (editor.texty('selectedImage')) {
        editor.texty('selectedImage').src = prompt('new src=','/asdnew');
    }
    if (editor.texty('selectedLink')) {
        editor.texty('selectedLink').href = prompt('new href=','/asdnew');
    }
    $('#h1').removeClass('active');
    $('#h2').removeClass('active');
    $('#p').removeClass('active');
    if (editor.texty('blockNodeName')) {
        $('#' + editor.texty('blockNodeName').toLowerCase()).addClass('active');
    }
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