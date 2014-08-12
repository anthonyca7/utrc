angular.module('templates.app', ['header.tpl.html', 'interface/criteria/criteria-modal.tpl.html', 'interface/interface.tpl.html', 'main-page.tpl.html', 'notifications.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\" ng-controller=\"HeaderController\">\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"navbar-header\">\n" +
    "			<button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#header-content\">\n" +
    "				<span class=\"sr-only\">Toggle navigation</span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "				<span class=\"icon-bar\"></span>\n" +
    "			</button>\n" +
    "			<a class=\"navbar-brand\" ng-click=\"home()\">UTRC</a>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"collapse navbar-collapse\" id=\"header-content\">\n" +
    "			<login-toolbar></login-toolbar>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("interface/criteria/criteria-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("interface/criteria/criteria-modal.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<button type=\"button\" class=\"close\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button>\n" +
    "	<h3 class=\"modal-title\">Search for {{field}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "	<p>The recommended the way to search for dates is to use one of these three formats.</p>\n" +
    "	<ul class=\"text-info\">\n" +
    "		<li>yyyy-mm-dd</li>\n" +
    "		<li>yyyy-mm (No day specified)</li>\n" +
    "		<li>yyyy (No month and day specified)</li>\n" +
    "	</ul>\n" +
    "\n" +
    "	<form novalidate class=\"form-horizontal\" role=\"form\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Greater than</label>\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\" name=\"greater\" class=\"form-control\" ng-model=\"search.greater\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Less than</label>\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\" name=\"less\" class=\"form-control\" ng-model=\"search.less\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\" ng-click=\"cancel()\">Close</button>\n" +
    "	<button type=\"button\" class=\"btn btn-primary\" ng-click=\"submit()\">Search</button>\n" +
    "</div>");
}]);

angular.module("interface/interface.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("interface/interface.tpl.html",
    "<h1 class=\"title\">{{selectedFeed | title}} Feeds</h1>\n" +
    "\n" +
    "<form class=\"form-inline text-center\" role=\"form\">\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"feed\" class=\"text-info mid-font\">Feed</label>\n" +
    "		<select class=\"form-control\"\n" +
    "		        id=\"feed\"\n" +
    "		        ng-model=\"selectedFeed\"\n" +
    "		        ng-change=\"selectFeed(selectedFeed)\"\n" +
    "		        ng-options=\"feed for feed in feeds\"></select>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"limit\" class=\"text-info mid-font\">Rows</label>\n" +
    "		<input class=\"form-control\" id=\"limit\" ng-model=\"limit\" ng-blur=\"autoUpdate()\"/>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<!--<a class=\"btn btn-primary\" ng-click=\"updateData()\">Update</a>-->\n" +
    "\n" +
    "		<a class=\"btn btn-primary\" target=\"_self\"\n" +
    "		   ng-href=\"/api/feeds/download/{{selectedFeed | title}}/{{stringify(criteria)}}\">\n" +
    "			<span class=\"glyphicon glyphicon-cloud-download\"></span> Download\n" +
    "		</a>\n" +
    "\n" +
    "		<a class=\"btn btn-warning\" ng-click=\"reset()\">\n" +
    "			<span class=\"glyphicon glyphicon-repeat\"></span> Reset\n" +
    "		</a>\n" +
    "\n" +
    "		<!--<div class=\"checkbox\">\n" +
    "				<label>\n" +
    "						<input type=\"checkbox\" ng-model=\"automaticUpdate\"> Update Automatically\n" +
    "				</label>\n" +
    "		</div>-->\n" +
    "	</div>\n" +
    "</form>\n" +
    "\n" +
    "<pagination ng-model=\"currentPage\"\n" +
    "            ng-change=\"updateData()\"\n" +
    "            total-items=\"count\"\n" +
    "            items-per-page=\"limit\"\n" +
    "            max-size=\"paginationCells\"\n" +
    "            class=\"pagination-sm pag\"\n" +
    "            boundary-links=\"true\"\n" +
    "            rotate=\"false\">\n" +
    "</pagination>\n" +
    "\n" +
    "<div ng-show=\"count!=0\">{{count}} events found</div>\n" +
    "<div class=\"table-container\">\n" +
    "	<table class=\"table table-bordered table-striped table-hover\">\n" +
    "\n" +
    "		<tr>\n" +
    "			<th>Serial</th>\n" +
    "			<th ng-repeat=\"header in headers track by $index\" class=\"overflow-ellipsis\">\n" +
    "				<div>{{header}}</div>\n" +
    "\n" +
    "				<div class=\"field_input\">\n" +
    "					<input ng-model=\"filters[header]\"\n" +
    "					       ng-change=\"updateCriteria(header, schema, filters, criteria)\"\n" +
    "						/>\n" +
    "					<img src=\"/static/img/search-icon.png\"\n" +
    "					     class=\"field_img\"\n" +
    "					     ng-click=\"openModal(filters, header)\"/>\n" +
    "				</div>\n" +
    "			</th>\n" +
    "		</tr>\n" +
    "\n" +
    "		<tr ng-if=\"events.length==0\">\n" +
    "			<td colspan=\"{{headers.length}}\">\n" +
    "				<h3>No events were found</h3>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "\n" +
    "\n" +
    "		<tr ng-repeat=\"event in events track by $index\" ng-controller=\"rowController\">\n" +
    "			<td>{{ (currentPage - 1) * limit + $index + 1 }}</td>\n" +
    "			<td ng-repeat=\"header in headers\" ng-click=\"fullContent()\">\n" +
    "				<div>{{ getEventField(event, schema, header)|limitCharacters:50:tc }}</div>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "	</table>\n" +
    "</div>");
}]);

angular.module("main-page.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("main-page.tpl.html",
    "<h1>Welcome to the UTRC data feed application</h1>\n" +
    "<p><a ng-href=\"/interface\">Data Interface</a></p>");
}]);

angular.module("notifications.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("notifications.tpl.html",
    "<div ng-class=\"['alert', 'alert-'+notification.type, 'notification']\"\n" +
    "     ng-repeat=\"notification in notifications.getCurrent()\">\n" +
    "	<button class=\"close\" ng-click=\"removeNotification(notification)\">x</button>\n" +
    "	{{notification.message}}\n" +
    "</div>");
}]);
