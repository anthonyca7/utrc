angular.module('services.notifications', []).factory('notifications', [
  '$rootScope', function ($rootScope) {

    var notifications = {
      'STICKY': [],
      'ROUTE_CURRENT': [],
      'ROUTE_NEXT': []
    };
    var notificationsService = {};

    var addNotification = function (notificationsArray, message, type, otherProperties) {
      notification = angular.extend({
        message: message,
        type: type
      }, otherProperties || {});

      notificationsArray.push(notification);
      return notification;
    };

    $rootScope.$on('$routeChangeSuccess', function () {
      notifications.ROUTE_CURRENT.length = 0;

      notifications.ROUTE_CURRENT = angular.copy(notifications.ROUTE_NEXT);
      notifications.ROUTE_NEXT.length = 0;
    });

    notificationsService.getCurrent = function () {
      return [].concat(notifications.STICKY, notifications.ROUTE_CURRENT);
    };

    notificationsService.pushSticky = function (message, type, otherProperties) {
      return addNotification(notifications.STICKY, message, type, otherProperties);
    };

    notificationsService.pushForCurrentRoute = function (message, type, otherProperties) {
      return addNotification(notifications.ROUTE_CURRENT, message, type, otherProperties);
    };

    notificationsService.pushForNextRoute = function (message, type, otherProperties) {
      return addNotification(notifications.ROUTE_NEXT, message, type, otherProperties);
    };

    notificationsService.remove = function (notification) {
      angular.forEach(notifications, function (notificationsByType) {
        var idx = notificationsByType.indexOf(notification);
        if (idx > -1) {
          notificationsByType.splice(idx, 1);
        }
      });
    };

    notificationsService.removeAll = function () {
      angular.forEach(notifications, function (notificationsByType) {
        notificationsByType.length = 0;
      });
    };

    return notificationsService;
  }
]);