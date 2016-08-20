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
    //options for autocomplete
    let opts
    //convert options provided to opts
    let initOpts = function() {
      opts = {}
      if (scope.options) {
        if (scope.options.types) {
          opts.types = []
          opts.types.push(scope.options.types)
        }
        if (scope.options.bounds) {
          opts.bounds = scope.options.bounds
        }
        if (scope.options.country) {
          opts.componentRestrictions = {
            country: scope.options.country
          }
        }
      }
    }
    initOpts()
    //create new autocomplete
    //reinitializes on every change of the options provided
    let newAutocomplete = function() {
      scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
      google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
        scope.$apply(function() {
            scope.details = scope.gPlace.getPlace();
          scope.ngAutocomplete = element.val();
        });
      })
    }
    newAutocomplete()

    //watch options provided to directive
    scope.watchOptions = function () {
      return scope.options
    };
    scope.$watch(scope.watchOptions, function () {
      initOpts()
      newAutocomplete()
      element[0].value = '';
      scope.ngAutocomplete = element.val();
    }, true);
  }

  return directive;
}
