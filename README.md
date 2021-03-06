# Dashboard Widget Template

This is a template for quickly getting started to write widget to the dashboard.

## Installation

	npm install
	./node_modules/.bin/bower install

## Getting started

Run

	./node_modules/.bin/gulp serve

Start editing your widget, files of interest are in the src/widget folder.

The files in `src/app` as well as `src/index.html` are only there to allow
testing the widget in a sample dashboard setup. When publishing the widget,
only the widgets folder is taken into account.

## Limitations / Problems / Gotchas

A widget must be registered with an unique name to the dashboardProvider e.g

	dashboardProvider.widget('myWidgetWithUniqueName', {});

The widget must use a unique angular module name.

	angular.module('my.unique.widget.angular.module', ['adf.provider', 'templates']);

Templates needs to use an unique url e.g

	templateUrl: '../src/widget/index.my.unique.widget.angular.module.html'

## Creating a release

The file will be located in build/dist/

	./node_modules/.bin/gulp build:dist

## Publish the new widget

Generate a token here, set your apiKey as value for sub, iss property and use you apiSecret to sign it.

	http://jwt.io/?value=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI8aW5zZXJ0IHlvdXIgYXBpS2V5PiIsInN1YiI6IjxpbnNlcnQgeW91ciBhcGlLZXk-In0.MGm_l8-yTE8zsoCqOftn1AuFu06WAoBVqMz3qyqKPGA

Register the widget with the API by sending a POST to ```//dashboardurl.com/widgets``` with a Json body containing the widget definition.

```json
	{
		"name": "widget name (app.js:26)",
		"module": "module name (widget.js:5)",
		"url": "url to javascript from /build/dist/",
		"resources": [
			"url to css from /build/dist/",
			"any additional css or js resources"
		]
	}
```
