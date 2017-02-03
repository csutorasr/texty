# texty
Fully customizable WYSIWYG html editor with custom tags.
The library does not use the browsers build-in functions to edit the html code, so everything can be customized. If you are in favor of HTML5 `STRONG` element you do not have to use build-in `B` element of the browser.

It's using [rangy](https://github.com/timdown/rangy) for selection handling and class allpier as helper function.

JQuery and angular adapters are coming soon.
It is going to available on npm soon.

# Example

```HTML
<button id="bold">Bold</button>
<div id="editor">
    <h1>Heading</h1>
    <p>Paragraph with <strong>strong</strong> text</p>
</div>
<script src="rangy.js"></script>
<script src="rangy-classapplier.js"></script>
<script src="texty.js"></script>
<script>
var editor = texty.init(document.getElementById('editor'));
editor.addApplier('bold', {
    elementTagName: 'strong',
    removeClass: true
});
document.getElementById('bold').addEventListener('click',function () {
    editor.getApplier('bold').toggle();
});
editor.init();
</script>
```

Fully working example can be found in the exmaple directory. After [Build](#build) you can run the exmaples.

# Build

```Shell
npm install
npm run build
```

Afterwards in the build directory the rangy with class applier and texty modules can be found, that is needed to run the Texty library.

# API

Main object is called texty. It has one `init` function that creates new Texty prototype and one object of functions called `utils`.

## Texty prototype

* [Functions](#functions)
* [Properties](#properties)

## Functions:

### element()

Returns the element that is used as the main texty node.

### `addApplier(name[, options])`

`name` is the className that will be applied. `options` are the same as the [rangy options](https://github.com/timdown/rangy/wiki/Class-Applier-Module#options-parameter-new-in-v12) extended by 

* `removeClass`: Boolean. If true, the class will be removed from the output.

#### Example:

##### JS:

```JavaScript
var editor = texty.init(document.getElementById('editor'));
editor.addApplier('bold', {
    elementTagName: 'strong',
    removeClass: true
});
```

##### input:

```HTML
<strong>example</strong>
```

##### during edit mode:

```HTML
<strong class="bold">example</strong>
```

##### output: (with `removeClass: true`)

```HTML
<strong>example</strong>
```

### `getApplier(name)`

Returns an object of function to control the applier with the given name. The functions are the following:

* `toggle()`: Toogles the applier.
* `apply()`: Applies the applier.
* `remove()`: Removes the applier.
* `is()`: Returns a Boolean if the applier is applied.

### `redo()`

Do a redo if called.

### `isRedoable()`

Returns a Boolean if redo can be done.

### `undo()`

Do a undo if called.

### `isUndoable()`

Returns a Boolean if undo can be done.

### `addCallback(callback)`

Adds the `callback` that is called whenever modifications can be made to the selection or to the editor. (No parameter is given to the function)

### `removeCallback(callback)`

Removes the `callback`.

### `parseInput([input])`

Parses the `input`. Adds class to non-span applier. See [addApplier](#addappliername-options).

### `getOutput()`

Returns the output. Classes are removed if needed. (See [addApplier](#addappliername-options).) The unused attributes are removed.

### `setBlockNodeTagName(tagName)`

Sets the tag name of the block node. `tagName` must be uppercase and `texty.utils.blockTagNames` must contain it.

### `increaseIndent()`

Increases indent on block node by increasing margin-left by 40px.

### `decreaseIndent()`

Decreases indent on block node by decreasing margin-left by 40px.

### `setAlign(type)`

Sets the align of the block element. Type should be one of `left`, `center`, `right`, `justify`.

### `removeFormatting()`

Removes formatting on the selection.

### `insertText(text)`

Inserts the `text` in paragraphs. If the `text` is string, it will be split on every `\n`. If the `text` is an array of string, then each will become one paragraph.

### `insertLink(href[,text])`

Inserts link or replaces selected text to a link. (See [Known issues](#known-issues)) If no `text` is given and there's no selection then Link will be the text of the new `A` tag.

Return the newly created `A` element.

### `insertImage(src)`

Collapses selection and inserts image with the given `src`.

Returns the newly created `IMG` element.

## Properties

### `isImageSelected` : Boolean

Indicates if the selection is on an image.

### `selectedImage` : node

The node of the selected image. If no image is selected then undefined.

### `isLinkSelected` : Boolean

Indicates if the selection is on an image.

### `selectedLink` : node

The node of the selected link. If no link is selected then undefined.

### `align`: string

Indicates the alignment of the selected block elements. If cannot be determined (e.g. no selection or more types of alignment) then value is undefined.

### `activeAppliers`: string[]

An array of the name of the active appliers.

### `appliers`: string[]

An array of the name of the appliers.

# Known issues

Sometimes history is not working.

Images cannot act as link.

IE8 or older is not supported.