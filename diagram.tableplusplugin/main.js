'use strict';

import { getItemPostgreSQLJson, getItemMySQLJson, getItemSQLServerJson, getItemJson } from './library/helper';

var newDiagram = function(context) {
	var build = parseInt(Application.appBuild(), 10);
	if (build < 330) {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");
};

var generateDiagram = function(context) {
	var build = parseInt(Application.appBuild(), 10);
	if (build < 330) {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Show indicator
	webView.evaluate("window.Diagram.setProgressIndicator(true, 'Loading...')");

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");

    var driver = context.driver();
	switch (driver) {
	case "MySQL":
		getItemMySQLJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	case "PostgreSQL":
		getItemPostgreSQLJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	default:
		var items = context.items();
		getItemJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	}
};

var generateDiagramSelectedItems = function(context) {
	var build = parseInt(Application.appBuild(), 10);
	if (build < 330) {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Show indicator
	webView.evaluate("window.Diagram.setProgressIndicator(true, 'Loading...')");

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");

    var driver = context.driver();
    var items = context.selectedItems();

	switch (driver) {
	case "MySQL":
		getItemMySQLJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	case "PostgreSQL":
		getItemPostgreSQLJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	default:
		getItemJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagram('" + JSON.stringify(data) + "')", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	}
};

global.newDiagram = newDiagram;
global.generateDiagram = generateDiagram;
global.generateDiagramSelectedItems = generateDiagramSelectedItems;