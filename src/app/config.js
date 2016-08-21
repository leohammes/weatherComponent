let autocomplete = angular.module('ngAutocomplete', []);
let app = angular.module('wheaterComponent', ['ngAutocomplete', 'ngMaterial', 'ui.bootstrap']);

// Main Controller
app.controller('mainController', function($scope, $templateCache) {
  $scope.selectedValue = '';
  $scope.details = '';
  $scope.options = {
   country: 'BR',
   types: '(cities)'
  };
  $scope.saveLocal = saveLocal;

  function saveLocal() {
    if (window.localStorage) {
      if ($scope.selectedValue != '') {
        localStorage.setItem("weatherForecastLocal", JSON.stringify($scope.details));
        localStorage.setItem("localPictureUrl", angular.element(".header").css("background-image"));
        angular.element(".form-group span").addClass("bookmarked");
      } else {
        alert("Escolha um lugar primeiro");
      }
    } else {
      alert("Seu navegador não tem localStorage");
    }
  }
})

// Internal directives
app.directive('weather', weatherDirective);
app.factory('WeatherHandler', WeatherHandler);
autocomplete.directive('ngAutocomplete', ngAutocomplete);
