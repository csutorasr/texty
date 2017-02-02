# texty
Fully customizable WYSIWYG html editor with custom tags.

It's using [rangy](https://github.com/timdown/rangy) for selection handling and class allpier as helper function.

It is going to available on npm soon.

# API

Main object is called texty. It has one init function that creates new Texty prototype and one object of functions called utils.

## Texty prototype

### element()

Returns the element that is used as the main texty node.

### addApplier(name, options)

Name is the className that will be applied. Options are the same as the [rangy options](https://github.com/timdown/rangy/wiki/Class-Applier-Module#options-parameter-new-in-v12) extended by 

* removeClass : if true, the class will be removed from the output.

### Known issues

Sometimes history is not working.