var app = angular.module('textyExample', ['texty']);
app.run(['textySvc', function (textySvc) {
    textySvc.addApplier('bold', {
        elementTagName: 'strong',
        removeClass: true
    });
}]);
app.controller('ExampleCtrl', ['$scope', function ($scope) {
    $scope.editor = '';
    $scope.html = "<h1>Heading</h1><p>Paragraph <strong>strong</strong></p>";
}]);
angular.bootstrap(document, ['textyExample']);