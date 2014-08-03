angular.module('security.service', [
  'security.retryQueue',
  'security.login',
  'ui.bootstrap'
])

  .factory('security', [
    '$http', '$q', '$location', 'securityRetryQueue', '$modal', function ($http, $q, $location, queue, $modal) {

      function redirect(url) {
        url = url || '/';
        $location.path(url);
      }

      var loginModal = null;

      function openLoginModal() {
        if (loginModal) {
          throw new Error('Trying to open a modal that is already open!');
        }
        loginModal = $modal.open({
          templateUrl: 'security/login/form.tpl.html',
          controller: 'LoginFormController'
        });

        loginModal.result.then(function (success) {
            loginModal = null;
            queue.retryAll();
          }, function () {
            loginModal = null;
            queue.cancelAll();
            redirect();
          }
        );
      }

      queue.onItemAddedCallbacks.push(function (retryItem) {
        if (queue.hasMore()) {
          service.showLogin();
        }
      });

      var service = {

        getLoginReason: function () {
          return queue.retryReason();
        },

        showLogin: function () {
          openLoginModal();
        },

        login: function (username, password) {
          var request = $http.post('/api/session', {username: username, password: password});
          return request.then(function (response) {
            service.currentUser = response.data.user;
            return service.isAuthenticated();
          });
        },

        logout: function (redirectTo) {
          $http.delete('/api/session').then(function () {
            service.currentUser = null;
            redirect(redirectTo);
          });
        },

        requestCurrentUser: function () {
          if (service.isAuthenticated()) {
            return $q.when(service.currentUser);
          } else {
            return $http.get('/api/users/current').then(function (response) {
              service.currentUser = response.data.user;
              return service.currentUser;
            });
          }
        },

        currentUser: null,

        isAuthenticated: function () {
          return !!service.currentUser;
        },

        isAdmin: function () {
          return !!(service.currentUser && service.currentUser.admin);
        }
      };

      return service;
    }
  ]);
