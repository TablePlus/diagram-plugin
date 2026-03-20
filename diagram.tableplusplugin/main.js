'use strict';

import { getItemJson, getItemMySQLJson, getItemPostgreSQLJson, getItemSQLServerJson } from './library/helper';

var escapeStr = function(data) {
	return JSON.stringify(data);
};

var canImportPayload = function(data) {
	return (
		data &&
		Array.isArray(data.items) &&
		data.items.length > 0
	);
};

var importDiagram = function(webView, data, context) {
	var script =
		'(function(){try{' +
		"if(typeof window.Diagram==='undefined'||typeof window.Diagram.importDiagramObject!=='function'){" +
		'return{success:false,error:' +
		JSON.stringify(
			'window.Diagram.importDiagramObject is missing (bundle not loaded or too early).'
		) +
		'};' +
		'}' +
		'window.Diagram.importDiagramObject(' +
		escapeStr(data) +
		');' +
		'return{success:true};' +
		'}catch(e){' +
		'return{success:false,error:(e&&e.stack)?e.stack:String(e)};' +
		'}' +
		'})()';
	webView.evaluate(script, function () {});
};

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

    var driver = context.driver();
	switch (driver) {
	case "MySQL":
	case "MariaDB":
		getItemMySQLJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
		break;
	case "PostgreSQL":
	case "Redshift":
	case "Greenplum":
		getItemPostgreSQLJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	default:
		var items = context.items();
		getItemJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
		break;
	}
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

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");

    var driver = context.driver();
	switch (driver) {
	case "MySQL":
	case "MariaDB":
		getItemMySQLJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
		break;
	case "PostgreSQL":
	case "Redshift":
	case "Greenplum":
		getItemPostgreSQLJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, [], webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	default:
		var items = context.items();
		getItemJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
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

	// Disable menu context
	webView.evaluate("document.body.setAttribute('oncontextmenu', 'event.preventDefault();');");

    var driver = context.driver();
    var items = context.selectedItems();

	switch (driver) {
	case "MySQL":
		getItemMySQLJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
		break;
	case "PostgreSQL":
		getItemPostgreSQLJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	case "MicrosoftSQLServer":
		getItemSQLServerJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
	  	break;
	default:
		getItemJson(context, items, webView, function (data) {
			if (canImportPayload(data)) {
				importDiagram(webView, data, context);
			}
		});
		break;
	}
};

global.newDiagram = newDiagram;
global.generateDiagram = generateDiagram;
global.generateDiagramSelectedItems = generateDiagramSelectedItems;
