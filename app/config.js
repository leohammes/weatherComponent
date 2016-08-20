angular.module('wheatercomponent', []).controller('mainController', function($scope, $templateCache) {
  $scope.state = "sc";
  $scope.city = "Blumenau";

  $scope.cidadeEstados = new dgCidadesEstados(
      document.getElementById('state'),
      document.getElementById('city'),
      true
  );
}).directive('weather', weatherDirective);
