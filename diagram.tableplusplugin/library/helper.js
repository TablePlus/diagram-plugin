'use strict';

var async = require("async");

var remoteQuoteIfNeeded = function(str) {
	if (str.charAt(0) === '"' && str.charAt(str.length-1) === '"') {
	    return str.substr(1, str.length-2);
	}
	return str;
}

var getItemMySQLJson = function(context, items, webView, cb) {
	var schema = context.currentSchema();
	var jsonData = {"columns":[{"id":"0","name":"name","type":"string"},{"id":"1","name":"type","type":"string"},{"id":"2","name":"nullable","type":"boolean"}],"schema":schema,"items":[],"refs":[]};
	var query1 = "SELECT table_name as table_name,ordinal_position AS ordinal_position,column_name AS column_name,column_type AS data_type,character_set_name AS character_set,collation_name AS COLLATION,is_nullable AS is_nullable,column_default AS column_default,extra AS extra,column_name AS foreign_key,column_comment AS COMMENT FROM information_schema.columns WHERE table_schema='" + schema + "' ORDER BY table_name, ordinal_position;";
	var names = [];
	items.forEach(function (item) {
		names.push(item.name());
	});
	// Load the table structure
	context.execute(query1, res => {
		var name = null;
		var jsonItem = null;
		res.rows.forEach(row => {
			if (names.length > 0 && !names.includes(row.raw("table_name"))) {
				return;
			}
			if (name == null) {
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else if (row.raw("table_name") == name) {
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else {
				jsonData["items"].push(jsonItem);
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			}
		});
		jsonData["items"].push(jsonItem);
		webView.evaluate("window.Diagram.setProgressIndicator(0.5, 'Loading...')");
	});
	// Load foreign keys
	var query2 = "SELECT TABLE_NAME,TABLE_SCHEMA,COLUMN_NAME,CONSTRAINT_NAME,REFERENCED_TABLE_SCHEMA,REFERENCED_TABLE_NAME,REFERENCED_COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA='" + schema + "' AND REFERENCED_TABLE_NAME IS NOT NULL ORDER BY ORDINAL_POSITION;";
	context.execute(query2, res => {
		var name = null;
		var jsonItem = null;
		res.rows.forEach(row => {
			var childName = row.raw("TABLE_NAME");
			var parentName = row.raw("REFERENCED_TABLE_NAME");
			if (names.length > 0 && (!names.includes(childName) || !names.includes(parentName))) {
				return;
			}
			if (name == null) {
				name = row.raw("CONSTRAINT_NAME");
				jsonItem = {"from": {"name": childName, "schema": row.raw("TABLE_SCHEMA"), "rows": []}, "to": {"name": parentName, "schema": row.raw("REFERENCED_TABLE_SCHEMA"), "rows": []}};
			 	jsonItem["from"]["rows"].push(row.raw("COLUMN_NAME"));
			 	jsonItem["to"]["rows"].push(row.raw("REFERENCED_COLUMN_NAME"));
			} else if (row.raw("CONSTRAINT_NAME") == name) {
			 	jsonItem["from"]["rows"].push(row.raw("COLUMN_NAME"));
			 	jsonItem["to"]["rows"].push(row.raw("REFERENCED_COLUMN_NAME"));
			} else {
			 	jsonData["refs"].push(jsonItem);
				name = row.raw("CONSTRAINT_NAME");
				jsonItem = {"from": {"name": row.raw("TABLE_NAME"), "schema": row.raw("TABLE_SCHEMA"), "rows": []}, "to": {"name": row.raw("REFERENCED_TABLE_NAME"), "schema": row.raw("REFERENCED_TABLE_SCHEMA"), "rows": []}};
			 	jsonItem["from"]["rows"].push(row.raw("COLUMN_NAME"));
			 	jsonItem["to"]["rows"].push(row.raw("REFERENCED_COLUMN_NAME"));
			}
		});
		if (jsonItem != null) {
			jsonData["refs"].push(jsonItem);			
		}
		webView.evaluate("window.Diagram.setProgressIndicator(1, 'Loading...')");
		cb(jsonData);
	});
}

var getItemPostgreSQLJson = function(context, items, webView, cb) {
	var schema = context.currentSchema();
	var query1 = "SELECT table_name,table_schema,ordinal_position,column_name,udt_name AS data_type,numeric_precision,datetime_precision,numeric_scale,character_maximum_length AS data_length,is_nullable,column_name AS CHECK,column_name AS check_constraint,column_default FROM information_schema.columns WHERE table_schema='" + schema + "' ORDER BY table_name, ordinal_position;";
	var jsonData = {"columns":[{"id":"0","name":"name","type":"string"},{"id":"1","name":"type","type":"string"},{"id":"2","name":"nullable","type":"boolean"}],"schema":schema,"items":[],"refs":[]};
	var names = [];
	items.forEach(function (item) {
		names.push(item.name());
	});
	// Load the table structure
	context.execute(query1, res => {
		var name = null;
		var jsonItem = null;
		res.rows.forEach(row => {
			if (names.length > 0 && !names.includes(row.raw("table_name"))) {
				return;
			}
			if (name == null) {
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else if (row.raw("table_name") == name) {
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else {
				jsonData["items"].push(jsonItem);
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			}
		});
		jsonData["items"].push(jsonItem);
	});
	// Load foreign keys
	var query2 = "SELECT(SELECT STRING_AGG(QUOTE_IDENT(a.attname),',' ORDER BY t.seq)FROM(SELECT ROW_NUMBER()OVER(ROWS UNBOUNDED PRECEDING)AS seq,attnum FROM UNNEST(c.conkey)AS t(attnum))AS t INNER JOIN pg_attribute AS a ON a.attrelid=c.conrelid AND a.attnum=t.attnum)AS child_column,tf.schema as child_schema,tf.name as child_name,tt.schema AS parent_schema,tt.name AS parent_name,(SELECT STRING_AGG(QUOTE_IDENT(a.attname),',' ORDER BY t.seq)FROM(SELECT ROW_NUMBER()OVER(ROWS UNBOUNDED PRECEDING)AS seq,attnum FROM UNNEST(c.confkey)AS t(attnum))AS t INNER JOIN pg_attribute AS a ON a.attrelid=c.confrelid AND a.attnum=t.attnum)AS parent_column FROM pg_catalog.pg_constraint AS c INNER JOIN(SELECT pg_class.oid,QUOTE_IDENT(pg_namespace.nspname)AS SCHEMA,QUOTE_IDENT(pg_class.relname)AS name FROM pg_class INNER JOIN pg_namespace ON pg_class.relnamespace=pg_namespace.oid)AS tf ON tf.oid=c.conrelid INNER JOIN(SELECT pg_class.oid,QUOTE_IDENT(pg_namespace.nspname)AS SCHEMA,QUOTE_IDENT(pg_class.relname)AS name FROM pg_class INNER JOIN pg_namespace ON pg_class.relnamespace=pg_namespace.oid)AS tt ON tt.oid=c.confrelid WHERE tt.schema='" + schema + "' AND c.contype='f';";
	context.execute(query2, res => {
		res.rows.forEach(row => {
			var childName = remoteQuoteIfNeeded(row.raw("child_name"));
			var parentName = remoteQuoteIfNeeded(row.raw("parent_name"));
			if (names.length > 0 && (!names.includes(childName) || !names.includes(parentName))) {
				return;
			}
			var jsonItem = {"from": {"name": childName,"schema": remoteQuoteIfNeeded(row.raw("child_schema")), "rows": []}, "to": {"name": parentName, "schema": remoteQuoteIfNeeded(row.raw("parent_schema")), "rows": []}};
			row.raw("child_column").split(",").forEach(col => {
		 		jsonItem["from"]["rows"].push(remoteQuoteIfNeeded(col));
			});
			row.raw("parent_column").split(",").forEach(col => {
		 		jsonItem["to"]["rows"].push(remoteQuoteIfNeeded(col));
			});
		 	jsonData["refs"].push(jsonItem);
		});
		webView.evaluate("window.Diagram.setProgressIndicator(1, 'Loading...')");
		cb(jsonData);
	});
}

var getItemSQLServerJson = function(context, items, webView, cb) {
	var schema = context.currentSchema();
	var query1 = "SELECT o.name as table_name,s.name as dbname,c.name AS column_name,t.name AS data_type,c.is_identity AS is_identity,c.max_length AS data_length,c.precision AS numeric_precision,c.scale AS numeric_scale,CASE WHEN c.is_nullable=0 THEN'NO' ELSE'YES' END AS is_nullable FROM sys.columns c JOIN sys.types t ON c.user_type_id=t.user_type_id JOIN sys.objects o ON o.object_id=c.object_id JOIN sys.schemas s ON s.schema_id=o.schema_id LEFT JOIN sys.default_constraints d ON o.object_id=d.parent_object_id AND c.column_id=d.parent_column_id WHERE s.name='" + schema + "';";
	var jsonData = {"columns":[{"id":"0","name":"name","type":"string"},{"id":"1","name":"type","type":"string"},{"id":"2","name":"nullable","type":"boolean"}],"schema":schema,"items":[],"refs":[]};
	var names = [];
	items.forEach(function (item) {
		names.push(item.name());
	});
	// Load the table structure
	context.execute(query1, res => {
		var name = null;
		var jsonItem = null;
		res.rows.forEach(row => {
			if (names.length > 0 && !names.includes(row.raw("table_name"))) {
				return;
			}
			if (name == null) {
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else if (row.raw("table_name") == name) {
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			} else {
				jsonData["items"].push(jsonItem);
				name = row.raw("table_name");
				jsonItem = {"id": name, "schema": schema, "name": name, "rows": []};
				var row = {"id": row.raw("column_name"), "name": row.raw("column_name"), "type": row.raw("data_type"), "nullable": "true"};
				jsonItem["rows"].push(row);
			}
		});
		jsonData["items"].push(jsonItem);
	});
	// Load foreign keys
	var query2 = "SELECT f.name AS constraint_name,OBJECT_SCHEMA_NAME(fc.parent_object_id)AS child_schema,OBJECT_NAME(fc.parent_object_id)AS child_name,COL_NAME(fc.parent_object_id,fc.parent_column_id)AS child_column,OBJECT_SCHEMA_NAME(f.referenced_object_id)AS parent_schema,OBJECT_NAME(f.referenced_object_id)AS parent_name,COL_NAME(fc.referenced_object_id,fc.referenced_column_id)AS parent_column FROM sys.foreign_keys AS f INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID=fc.constraint_object_id WHERE OBJECT_SCHEMA_NAME(f.parent_object_id)='" + schema + "';";
	context.execute(query2, res => {
		var name = null;
		var jsonItem = null;
		res.rows.forEach(row => {
			var childName = row.raw("child_name");
			var parentName = row.raw("parent_name");
			if (names.length > 0 && (!names.includes(childName) || !names.includes(parentName))) {
				return;
			}
			if (name == null) {
				name = row.raw("constraint_name");
				jsonItem = {"from": {"name": childName, "schema": row.raw("child_schema"), "rows": []}, "to": {"name": parentName, "schema": row.raw("parent_schema"), "rows": []}};
			 	jsonItem["from"]["rows"].push(row.raw("child_column"));
			 	jsonItem["to"]["rows"].push(row.raw("parent_column"));
			} else if (row.raw("constraint_name") == name) {
			 	jsonItem["from"]["rows"].push(row.raw("child_column"));
			 	jsonItem["to"]["rows"].push(row.raw("parent_column"));
			} else {
			 	jsonData["refs"].push(jsonItem);
				name = row.raw("constraint_name");
				jsonItem = {"from": {"name": row.raw("child_name"), "schema": row.raw("child_schema"), "rows": []}, "to": {"name": row.raw("parent_name"), "schema": row.raw("parent_schema"), "rows": []}};
			 	jsonItem["from"]["rows"].push(row.raw("child_column"));
			 	jsonItem["to"]["rows"].push(row.raw("parent_column"));
			}
		});
		if (jsonItem != null) {
			jsonData["refs"].push(jsonItem);			
		}
		webView.evaluate("window.Diagram.setProgressIndicator(1, 'Loading...')");
		cb(jsonData);
	});
}

// Fallback default
var getItemJson = function(context, items, webView, cb) {
	var schema = context.currentSchema();
	var jsonData = {"columns":[{"id":"0","name":"name","type":"string"},{"id":"1","name":"type","type":"string"},{"id":"2","name":"nullable","type":"boolean"}],"schema":schema,"items":[],"refs":[]};
	var count = 0;
	var total = items.length;
	async.map(items, function(item, callback) {
		context.fetchMeta(item, function(data) {
			var jsonItem = {"id": item.name(), "name": item.name(), "schema": item.schema(), "rows": []};
			data["columns"].forEach(function(column) {
				var row = {"id": column["name"], "name": column["name"], "type": column["typeString"], "nullable": "true"};
				jsonItem["rows"].push(row);
			});
			jsonData["refs"] = jsonData["refs"].concat(data["foriegnKeys"]);
			count += 1;
			webView.evaluate("window.Diagram.setProgressIndicator(" + (count/total).toString() + ", 'Loading: " + count.toString() + "/" + total.toString() + " items')");
			callback(null, jsonItem);
		});
	}, function(err, results) {
		jsonData["items"] = results;
		cb(jsonData);
    });
}

export { getItemPostgreSQLJson, getItemMySQLJson, getItemSQLServerJson, getItemJson };