angular.module('templates.common', ['security/login/form.tpl.html', 'security/login/toolbar.tpl.html']);

angular.module("security/login/form.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/form.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<h4>Sign in</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	<form name=\"form\" novalidate class=\"form-horizontal\" role=\"form\">\n" +
    "		<div class=\"alert alert-warning\" ng-show=\"authReason\">{{authReason}}</div>\n" +
    "		<div class=\"alert alert-danger\" ng-show=\"authError\">{{authError}}</div>\n" +
    "\n" +
    "		<div class=\"alert alert-info\" ng-show=\"!authReason && !authError\">Please enter your login details</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"usernameField\" class=\"col-sm-3 control-label\">Username</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\"\n" +
    "				       name=\"login\"\n" +
    "				       ng-model=\"user.username\"\n" +
    "				       class=\"form-control\"\n" +
    "				       id=\"usernameField\"\n" +
    "				       placeholder=\"Username\"\n" +
    "				       required\n" +
    "				       autofocus>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"passwordField\" class=\"col-sm-3 control-label\">Password</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"password\"\n" +
    "				       name=\"pass\"\n" +
    "				       ng-model=\"user.password\"\n" +
    "				       class=\"form-control\"\n" +
    "				       id=\"passwordField\"\n" +
    "				       placeholder=\"Password\"\n" +
    "				       required>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</form>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button class=\"btn btn-primary\" ng-click=\"login()\" ng-disabled='form.$invalid'>Sign in</button>\n" +
    "	<button class=\"btn btn-danger\" ng-click=\"clearForm()\">Clear</button>\n" +
    "	<button class=\"btn btn-warning\" ng-click=\"cancelLogin()\">Cancel</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("security/login/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("security/login/toolbar.tpl.html",
    "<ul class=\"nav pull-right\">\n" +
    "	<li class=\"divider-vertical\"></li>\n" +
    "	<li ng-if=\"isAuthenticated()\" class=\"logout\">\n" +
    "		<form class=\"navbar-form\">\n" +
    "			<button class=\"btn logout\" ng-click=\"logout()\">Log out</button>\n" +
    "		</form>\n" +
    "	</li>\n" +
    "	<li ng-if=\"!isAuthenticated()\" class=\"login\">\n" +
    "		<form class=\"navbar-form\">\n" +
    "			<button class=\"btn login\" ng-click=\"login()\">Log in</button>\n" +
    "		</form>\n" +
    "	</li>\n" +
    "</ul>");
}]);
