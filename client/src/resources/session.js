'use strict';

angular.module('schoolstore')
  .factory('Session', ['$resource', function ($resource) {
    return $resource('/api/session/');
  }]);
