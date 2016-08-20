function weatherDirective($templateCache) {
  let directive = {
    restrict: 'E',
    transclude: false,
    template: "<div><h1>Cidade escolhida é: {{result.city}}</h1><div>Temperatura atual: {{result.temp}}ºC</div></div>",
    scope: {
      city : "=",
      uf : "=",
      unit : "="
    },
    link: linkFunc
  }

  function linkFunc(scope, element) {
      console.log($templateCache.get('weather.template.html'));
      $.simpleWeather({
        location: 'Olinda, PE',
        woeid: '',
        unit: 'c',
        success: function(result) {
          scope.$applyAsync(function () {
            scope.result = result;
          });
        },
        error: function(error) {
          scope.result = error;
        }
      });
  }

  return directive;
}
