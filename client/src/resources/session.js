'use strict';

angular.module('webinterface')
  .factory('Session', ['$resource', function ($resource) {
    return $resource('/api/session/');
  }]);
