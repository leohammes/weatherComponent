function weatherDirective(WeatherHandler) {
  let directive = {
    restrict: 'E',
    transclude: false,
    template: getTemplate(),
    scope: {
      config : "="
    },
    link: linkFunc
  }

  function linkFunc(scope, element) {
      scope.handler = new WeatherHandler(scope);
      // default values to initialize the directive
      scope.state = "SC";
      scope.city = "Blumenau";
      scope.unit = "C";
      initialize();

      scope.$watch('config', function (newValue, oldValue) {
        if (newValue) {
          scope.config = newValue;
          reInitialize();
        }
      });

      function success(result) {
        scope.$applyAsync(function () {
          scope.weatherInfo = result;
        });
      };

      function error(error) {
        console.error(error);
      };

      function initialize() {
        let location = `'${scope.city},${scope.state}'`;
        let unit = scope.unit;
        $.simpleWeather({location, unit, success, error});
      }

      function reInitialize() {
        if (scope.config) {
          scope.config.address_components.forEach((element, index) => {
            switch (index) {
              case 1:
                scope.city = element.long_name;
                break;
              case 2:
                scope.state = element.short_name;
                break;
            }
          });

          initialize();
        }
      }
  }

  function getTemplate() {

    let template = `
      <div>
        <h1>Cidade escolhida é: {{weatherInfo.city}}</h1>
        <div>Temperatura atual: {{weatherInfo.temp}}º{{unit}}</div>
        <div>A Máxima para hoje é: {{handler.getMaximumTemperature()}}º{{unit}}</div>
        <div>A Mínima para hoje é: {{handler.getMinimumTemperature()}}º{{unit}}</div>
      </div>
    `

    return template;
  }

  return directive;
}
