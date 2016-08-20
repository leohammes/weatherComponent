function weatherDirective() {
  let directive = {
    restrict: 'E',
    transclude: false,
    template: "<div><h1>Cidade escolhida é: {{result.city}}</h1><div>Temperatura atual: {{result.temp}}ºC</div></div>",
    scope: {
      config : "="
    },
    link: linkFunc
  }

  function linkFunc(scope, element) {
      // default values to initialize the directive
      scope.state = "SC";
      scope.city = "Blumenau";
      scope.unit = "C";
      initialize();
      
      scope.$watch('config', function (newValue, oldValue) {
        scope.config = newValue;
        reInitialize();
      });

      function success(result) {
        scope.$applyAsync(function () {
          scope.result = result;
        });
      };

      function error(error) {
        console.error(error);
      };

      function initialize() {
        let location = `'${scope.city}, ${scope.uf}'`;
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


  return directive;
}
