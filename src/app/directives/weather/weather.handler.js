function WeatherHandler() {

  return handler;

  function handler(scope) {

    this.getMaximumTemperature = function() {
      if (scope.weatherInfo) {
        return scope.weatherInfo.high;
      }
    }

    this.getMinimumTemperature = function() {
      if (scope.weatherInfo) {
        return scope.weatherInfo.low;
      }
    }

    this.getSomePictureOfLocal = function() {
      if (scope.config && scope.config.photos) {
        return scope.config.photos[getRandomInt(0, 9)].getUrl({maxWidth: 1280, maxHeight: 720});
      }
    }

    this.refreshPictureOfLocal = function() {
      if (scope.config.predefinedImage) {
        angular.element(".header").css("background-image", scope.config.predefinedImage);
        delete scope.config.predefinedImage;
      } else {
        let url = scope.handler.getSomePictureOfLocal();
        if (url) {
            angular.element(".header").css("background-image", `url('${url}')`);
        }
      }
    }

    this.initialize = function() {
      let location = `'${scope.city},${scope.state}'`;
      let unit = 'C';
      $.simpleWeather({location, unit, success, error});
    }

    this.restart = function() {
      if (scope.config) {
        scope.handler.refreshPictureOfLocal();
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

        scope.handler.initialize();
      }
    }

    this.isGoodToGoToTheBeach = function() {
      if (scope.weatherInfo) {
        let goodWeatherCodes = [44, 36, 34, 32, 30, 26] // partly cloudy, hot, sunny, partly cloudy (day), cloudy
        let goodWeather = goodWeatherCodes.filter(function(element, index) { if (element == scope.weatherInfo.code) { return true } })
        return (angular.isDefined(goodWeather[0]) && scope.weatherInfo.temp > 25);
      }
    }

    this.openLink = function() {
      if (scope.weatherInfo) {
        window.open(scope.weatherInfo.link, '_blank');
      }
    }

    function success(result) {
      scope.$applyAsync(function () {
        scope.weatherInfo = result;
        scope.low = scope.weatherInfo.low;
        scope.high = scope.weatherInfo.high;
        scope.currentDate = scope.weatherInfo.forecast[0].date;
        createGraphs();
      });
    };

    function createGraphs() {
      let options = {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }

      let graphLabels = [];
      let graphMaxTemperatureContent = [];
      let graphMinTemperatureContent = [];
      let graphMaxBackgroundColors = [];
      let graphMinBackgroundColors = [];
      let borderColors = [];

      scope.weatherInfo.forecast.forEach(function(elm) {
        graphMaxTemperatureContent.push(elm.high);
        graphMinTemperatureContent.push(elm.low);
        let date = new Date(elm.date);
        let label = date.getDate() + "/" + (date.getMonth() + 1);
        graphLabels.push(label);
        graphMaxBackgroundColors.push('#FFC107');
        graphMinBackgroundColors.push('blue');
        borderColors.push("black");
      });

      scope.maxGraph = new Chart(document.getElementById("maxTemperature"), {
          type: 'bar',
          data: {
              labels: graphLabels,
              datasets: [{
                  label: 'Higher temperatures in the week',
                  data: graphMaxTemperatureContent,
                  backgroundColor: graphMaxBackgroundColors,
                  borderColor: borderColors,
                  borderWidth: 1
              }]
          },
          options
      });

      scope.minGraph = new Chart(document.getElementById("minTemperature"), {
          type: 'bar',
          data: {
              labels: graphLabels,
              datasets: [{
                  label: 'Smaller temperatures in the week',
                  data: graphMinTemperatureContent,
                  backgroundColor: graphMinBackgroundColors,
                  borderColor: borderColors,
                  borderWidth: 1
              }]
          },
          options
      });
    }

    function error(error) {
      console.error(error);
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }
}
