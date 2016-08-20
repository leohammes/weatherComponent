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

  }
}
