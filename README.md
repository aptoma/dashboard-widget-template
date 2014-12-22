# Dashboard Widget Template

This is a template for quickly getting started to write widget to the dashboard.

## Installation

	npm install
	./node_modules/.bin/bower install

## Getting started

Run

	./node_modules/.bin/gulp serve

Start editing your widget, files of interest are in the src/widget folder.

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

Register the widget with the API

	curl -i -X POST -H 'Authorization: bearer <YOUR JWT TOKEN>' \
	-d '{ "url": "http://to/your/widget", "name": "angular module name" }' \
	http://dashboardurl.com/widgets
