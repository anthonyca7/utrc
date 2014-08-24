angular.module('services.schemas', []).factory('Schemas', ['$q', '$http', function($q, $http) {
  var helpers = {};

  helpers.getByName = function (name) {
    var schemas = this,
        result = null;

    schemas.forEach(function (schema) {
      if (schema.name && schema.name === name){
        result = schema;
      }
    });
	  console.log('all schemas', schemas);
    return result;
  };

  helpers.getHeaders = function (name) {
    var schema = this.getByName(name);
    if (!!schema) {
      return Object.keys(schema.format);
    }
    return {};
  };

  var service = {
    all: function(){
      return $http.get('/api/schema').then(function (response) {
        var schemas = response.data;
        angular.extend(schemas, helpers);
        return schemas;
      });
    }
  };
  return service;
}]);