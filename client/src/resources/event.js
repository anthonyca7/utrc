'use strict';

angular.module('webinterface')
  .factory('Event', ['$resource', function ($resource) {
    return $resource('/api/event/:evt', {
        evt:'@event'
    });
  }]);