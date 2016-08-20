function ngAutocomplete($parse) {
  let directive = {
    scope: {
      details: '=',
      ngAutocomplete: '=',
      options: '='
    },
    link
  }

  function link(scope, element, attrs, model) {
    let opts = {};
    if (scope.options) {
      if (scope.options.types) opts.types = [scope.options.types];
      if (scope.options.bounds) opts.bounds = scope.options.bounds;
      if (scope.options.country) opts.componentRestrictions = {
        country: scope.options.country
      }
    }

    scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
    google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
      scope.$apply(function() {
          scope.details = scope.gPlace.getPlace();
        scope.ngAutocomplete = element.val();
      });
    })
  }

  return directive;
}
