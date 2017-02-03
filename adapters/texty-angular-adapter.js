var app = angular.module('texty', []);
app.service('textySvc', function () {
    if (window.texty === undefined) {
        console.error("Texty is not loaded");
    }
    var appliers = {};
    return {
        addApplier: function (name, options) {
            appliers[name] = options;
        },
        getAppliers: function () {
            return appliers;
        }
    };
});
app.directive('texty', ['textySvc', function (textySvc) {
    return {
        restrict: 'A',
        scope: {
            html: '=html',
            editor: '=texty'
        },
        link: function (scope, element, attrs) {
            var editor;
            if (window.texty !== undefined) {
                editor = window.texty.init(element[0]);
                angular.forEach(textySvc.getAppliers(), function (options, name) {
                    editor.addApplier(name, options);
                });
                editor.init();
                if (scope.html !== undefined) {
                    editor.parseInput(scope.html);
                }
                scope.editor = editor;
                editor.addCallback(function () {
                    scope.$apply();
                });
            }
            else {
                console.error("Texty is not loaded");
            }
        },
    };
}]);