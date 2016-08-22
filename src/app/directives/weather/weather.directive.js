function weatherDirective(WeatherHandler) {
  let directive = {
    restrict: 'E',
    transclude: false,
    template: getTemplate(),
    scope: {
      config : "="
    },
    compile: function(element, attributes) {
      return {
        pre: function(scope) {
          scope.handler = new WeatherHandler(scope);
        },
        post: linkFunc
      };
    }
  }

  function linkFunc(scope, element) {
      // default values to initialize the directive
      let savedData = localStorage.weatherForecastLocal;
      if (angular.isDefined(savedData)) {
        scope.config = JSON.parse(savedData);
        scope.config.predefinedImage = localStorage.localPictureUrl;
      } else {
        scope.state = "SC";
        scope.city = "Blumenau";
        scope.handler.initialize();
      }

      scope.$watch('config', function (newValue, oldValue) {
        if (newValue) {
          if (savedData && JSON.parse(savedData).formatted_address == newValue.formatted_address) {
            angular.element(".form-group span").addClass("bookmarked");
          } else {
            angular.element(".form-group span").removeClass("bookmarked");
          }
          scope.config = newValue;
          scope.handler.restart();
        }
      });

      scope.$watch('selectedOption', function (newValue, oldValue) {
        if (newValue) {
          scope.low = newValue.low;
          scope.high = newValue.high;
          scope.currentDate = newValue.date;
        }
      })
  }

  function getCardTemplateOf(isBeach) {
    isBeach = isBeach == 'beach';

    let title = isBeach ? 'Deu Praia hoje' : 'Melhor ficar em casa'
    let description = isBeach ? 'Com esse tempo ai, bora para a praia tomar uma! (Tempo bom e mais que 25°C)' : 'Vamos ficar em casa porque o clima não é de praia :( (Tempo ruim e menos que 25°C)'
    let src = isBeach ? './src/app/images/beach.jpg' : './src/app/images/house.jpg';
    return `
      <md-card class="beach-card">
        <img style="height: 300px !important;" src="${src}" class="md-card-image"></img>
        <md-card-title>
          <md-card-title-text>
            <span class="md-headline">${title}</span>
          </md-card-title-text>
        </md-card-title>
        <md-card-content style="min-height: 200px;">
          <p>
            ${description}
          </p>
        </md-card-content>
        <md-card-actions layout="row" layout-align="end center">
          <button ng-click="handler.openLink()" class="md-button md-ink-ripple">Click to more</button>
        </md-card-actions>
      </md-card>
    `;
  }

  /* Unfortunately, without application's server, i can not put this template into a external HTML file */
  function getTemplate() {
    let beachCardTemplate = getCardTemplateOf('beach');
    let houseCardTemplate = getCardTemplateOf('house');
    let template = `
      <div class="weather-content">
        <div class="actual">
          <h1 title="Weather now">{{city}}, {{state}} {{weatherInfo.temp}}ºC</h1>
        </div>
        <div class="boxes-area">
          <div class="box first-box">
            <md-select class="listbox" placeholder="Select the day" ng-model="selectedOption"><md-option ng-repeat="(index, item) in weatherInfo.forecast" ng-selected="index == 0" ng-value="item">{{item.date}}</md-option></md-select>
            <div class="inner-content">
              <div class="image-area">
                <img title="{{selectedOption.text}}" src="{{selectedOption.image}}"/>
              </div>
              <div class="temperatures-area">
                <div class="max" title="Max of the day"><span>&#8593;</span>{{high}}º{{unit}}</div>
                <div class="min" title="Min of the day"><span>&#8595;</span>{{low}}º{{unit}}</div>
              </div>
            </div>
          </div>
          <div class="box second-box" ng-class="{'beach': handler.isGoodToGoToTheBeach(), 'house': !handler.isGoodToGoToTheBeach()}">
            <div class="inner-content" ng-if="handler.isGoodToGoToTheBeach()">
              ${beachCardTemplate}
            </div>
            <div class="inner-content" ng-if="!handler.isGoodToGoToTheBeach()">
              ${houseCardTemplate}
            </div>
          </div>
          <div class="box third-box">
            <canvas id="maxTemperature" style="max-width: 500px" width="400" height="250">Canvas not supported</canvas>
            <canvas id="minTemperature" style="max-width: 500px" width="400" height="250">Canvas not supported</canvas>
          </div>
        </div>
      </div>
    `
    return template;
  }

  return directive;
}
