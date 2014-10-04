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
    "\n" +
    "	<div ng-if=\"type === 'date'\">\n" +
    "		<p>The recommended the way to search for dates is to use one of these three formats.</p>\n" +
    "		<ul class=\"text-info\">\n" +
    "			<li>yyyy-mm-dd</li>\n" +
    "			<li>yyyy-mm (No day specified)</li>\n" +
    "			<li>yyyy (No month and day specified)</li>\n" +
    "		</ul>\n" +
    "	</div>\n" +
    "\n" +
    "	<form novalidate class=\"form-horizontal\" role=\"form\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Greater than</label>\n" +
    "\n" +
    "			<div class=\"col-sm-9\">\n" +
    "				<input type=\"text\" name=\"greater\" class=\"form-control\" ng-model=\"search.greater\">\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label class=\"col-sm-3 control-label\">Less than</label>\n" +
    "\n" +
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
    "<h1 class=\"title\">{{selectedFeed.organization | title}} Feeds</h1>\n" +
    "\n" +
    "<!-- <div class=\"col-md-5\">\n" +
    "	<div class=\"pag-dividor\"></div>\n" +
    "	<div ng-show=\"count!=0\" class=\"text-primary result-text pull-right\">{{count}} events found</div>\n" +
    "	<br><br>\n" +
    "	<pagination ng-model=\"currentPage\"\n" +
    "	            ng-change=\"updateData()\"\n" +
    "	            total-items=\"count\"\n" +
    "	            items-per-page=\"limit\"\n" +
    "	            max-size=\"paginationCells\"\n" +
    "	            class=\"pagination-sm pag pull-right\"\n" +
    "	            boundary-links=\"true\"\n" +
    "	            rotate=\"false\">\n" +
    "	</pagination>\n" +
    "</div> -->\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "	<div class=\"col-md-3\"></div>\n" +
    "\n" +
    "	<form class=\"form-horizontal col-md-6 well\" role=\"form\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"feed\" class=\"col-md-4 control-label text-info mid-font\">Select your Feed: </label>\n" +
    "\n" +
    "			<div class=\"col-md-6\">\n" +
    "				<select class=\"form-control\"\n" +
    "				        id=\"feed\"\n" +
    "				        ng-model=\"selectedFeed\"\n" +
    "				        ng-change=\"selectFeed(selectedFeed)\"\n" +
    "				        ng-options=\"feed.name group by feed.organization for feed in feeds\"></select>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<label for=\"limit\" class=\"col-md-4 control-label text-info mid-font\">Results per page: </label>\n" +
    "\n" +
    "			<div class=\"col-md-6\">\n" +
    "				<input class=\"form-control\" id=\"limit\" ng-model=\"limit\" ng-blur=\"autoUpdate()\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "\n" +
    "		<div class=\"form-group\">\n" +
    "			<div class=\"col-md-offset-3 add-padding\">\n" +
    "				<a class=\"btn btn-primary\" ng-click=\"updateData()\">\n" +
    "					<span class=\"glyphicon glyphicon glyphicon-refresh\"></span> Update\n" +
    "				</a>\n" +
    "\n" +
    "				<a class=\"btn btn-warning\" ng-click=\"reset()\">\n" +
    "					<span class=\"glyphicon glyphicon-repeat\"></span> Reset\n" +
    "				</a>\n" +
    "\n" +
    "				<a class=\"btn btn-success\"\n" +
    "				   target=\"_self\"\n" +
    "				   ng-href=\"/api/feeds/download/{{selectedFeed.location}}/{{selectedFeed.feed}}/{{getDate()}}/{{stringify(criteria)}}\">\n" +
    "					<span class=\"glyphicon glyphicon-cloud-download\"></span> Download Results\n" +
    "				</a>\n" +
    "			</div>\n" +
    "			<!--<div class=\"checkbox\"><label><input type=\"checkbox\" ng-model=\"automaticUpdate\"> Update Automatically</label></div>-->\n" +
    "		</div>\n" +
    "	</form>\n" +
    "\n" +
    "	<div class=\"col-md-3\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "	<pagination ng-model=\"currentPage\"\n" +
    "	            ng-change=\"updateData()\"\n" +
    "	            total-items=\"count\"\n" +
    "	            items-per-page=\"limit\"\n" +
    "	            max-size=\"paginationCells\"\n" +
    "	            class=\"pagination-sm pag col-md-9\"\n" +
    "	            boundary-links=\"true\"\n" +
    "	            rotate=\"false\">\n" +
    "	</pagination>\n" +
    "	\n" +
    "	<div ng-show=\"count!=0\" class=\"text-primary result-text pull-right\">{{count}} feeds found</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"table-container\">\n" +
    "	<table class=\"table table-bordered table-striped table-hover\">\n" +
    "\n" +
    "		<tr>\n" +
    "			<th>Result</th>\n" +
    "			<th ng-repeat=\"header in headers track by $index\" class=\"overflow-ellipsis\">\n" +
    "				<div>{{header}}</div>\n" +
    "\n" +
    "				<div class=\"field_input\">\n" +
    "					<input ng-model=\"filters[header]\"\n" +
    "					       ng-change=\"updateCriteria(header, schema, filters, criteria)\"\n" +
    "					       ng-disabled=\"cannotBeSearched(header, schema)\"\n" +
    "						/>\n" +
    "					<img src=\"/static/img/search-icon.png\"\n" +
    "					     class=\"field_img\"\n" +
    "					     ng-show=\"canSearchByInterval(header, schema)\"\n" +
    "					     ng-click=\"openModal(filters, header, schema)\"/>\n" +
    "				</div>\n" +
    "			</th>\n" +
    "		</tr>\n" +
    "\n" +
    "		<tr ng-if=\"events.length==0\">\n" +
    "			<td colspan=\"{{headers.length+1}}\">\n" +
    "				<h3>No events were found</h3>\n" +
    "			</td>\n" +
    "		</tr>\n" +
    "\n" +
    "\n" +
    "		<tr ng-if=\"events.length!=0\" ng-repeat=\"event in events track by $index\" ng-controller=\"rowController\">\n" +
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
