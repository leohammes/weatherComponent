let autocomplete = angular.module('ngAutocomplete', []);
let app = angular.module('wheaterComponent', ['ngAutocomplete']);

// Main Controller
app.controller('mainController', function($scope, $templateCache) {
  $scope.selectedValue = '';
  $scope.details = '';
  $scope.options = {
   country: 'BR',
   types: '(cities)'
  };
})

// Internal directives
app.directive('weather', weatherDirective);
app.factory('WeatherHandler', WeatherHandler);
autocomplete.directive('ngAutocomplete', ngAutocomplete);
