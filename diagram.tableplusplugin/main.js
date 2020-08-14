'use strict';

import { getItemPostgreSQLJson, getItemMySQLJson, getItemSQLServerJson, getItemJson } from './library/helper';

var escapeStr = function(data) {
	return JSON.stringify(data);
}

var newDiagram = function(context) {
	var build = parseInt(Application.appBuild(), 10);
	var platform = Application.platform();
	if (build < 330 && platform == "macOS") {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	if (build < 138 && platform == "Windows") {
		context.alert("Warning", "Please update TablePlus to the build 138 or newer.");
		return;
	};

	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Windows does not support auto theme
	if (platform == "Windows") {
		var theme = context.currentThemeName();
		webView.evaluate("window.Diagram.setTheme('" + theme + "');");
	}

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");
};

var generateDiagram = function(context) {
	var build = parseInt(Application.appBuild(), 10);
	var platform = Application.platform();
	if (build < 330 && platform == "macOS") {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	if (build < 138 && platform == "Windows") {
		context.alert("Warning", "Please update TablePlus to the build 138 or newer.");
		return;
	};

	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Windows does not support auto theme
	if (platform == "Windows") {
		var theme = context.currentThemeName();
		webView.evaluate("window.Diagram.setTheme('" + theme + "');");
	}

	// Show indicator
	webView.evaluate("window.Diagram.setProgressIndicator(true, 'Loading...')");

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");

    var driver = context.driver();
	switch (driver) {
	case "MySQL":
	case "MariaDB":
		getItemMySQLJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data) + ")", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	case "PostgreSQL":
	case "Redshift":
	case "Greenplum":
		getItemPostgreSQLJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, [], webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
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
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
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
	var platform = Application.platform();
	if (build < 330 && platform == "macOS") {
		context.alert("Warning", "Please update TablePlus to the build 330 or newer.");
		return;
	};
	if (build < 138 && platform == "Windows") {
		context.alert("Warning", "Please update TablePlus to the build 138 or newer.");
		return;
	};

	var workingPath = Application.pluginRootPath() + "/com.tableplus.TablePlus.diagram.tableplusplugin/diagram/index.html"
	var webView = context.loadFile(workingPath, null);

	// Windows does not support auto theme
	if (platform == "Windows") {
		var theme = context.currentThemeName();
		webView.evaluate("window.Diagram.setTheme('" + theme + "');");
	}

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
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
		break;
	case "PostgreSQL":
		getItemPostgreSQLJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
				if (result["error"] != null) {
					context.alert("Hey", result["error"]);
				}
			});
		});
	  	break;
	default:
		getItemJson(context, items, webView, function (data) {
			webView.evaluate("window.Diagram.setProgressIndicator(false, 'Loading...')");
			webView.evaluate("window.Diagram.importDiagramObject(" + escapeStr(data)  + ")", function (result) {
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