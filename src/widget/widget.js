'use strict';

angular
	//if you change module name you need to change app.js that loads it.
	.module('my.widget', ['adf.provider', 'templates'])
 	.config(function (dashboardProvider) {
	 	/**
	 	 * Available options
	 	 *   Object properties:
	 	 *
	 	 *   - `title` - `{string=}` - The title of the widget.
	 	 *   - `description` - `{string=}` - Description of the widget.
	 	 *   - `config` - `{object}` - Predefined widget configuration.
	 	 *   - `controller` - `{string=|function()=}` - Controller fn that should be
	 	 *      associated with newly created scope of the widget or the name of a
	 	 *      {@link http://docs.angularjs.org/api/angular.Module#controller registered controller}
	 	 *      if passed as a string.
	 	 *   - `controllerAs` - `{string=}` - A controller alias name. If present the controller will be
	 	 *      published to scope under the `controllerAs` name.
	 	 *   - `template` - `{string=|function()=}` - html template as a string.
	 	 *   - `templateUrl` - `{string=}` - path to an html template.
	 	 *   - `reload` - `{boolean=}` - true if the widget could be reloaded. The default is false.
	 	 *   - `resolve` - `{Object.<string, function>=}` - An optional map of dependencies which should
	 	 *      be injected into the controller. If any of these dependencies are promises, the widget
	 	 *      will wait for them all to be resolved or one to be rejected before the controller is
	 	 *      instantiated.
	 	 *      If all the promises are resolved successfully, the values of the resolved promises are
	 	 *      injected.
	 	 *
	 	 *      The map object is:
	 	 *      - `key` – `{string}`: a name of a dependency to be injected into the controller.
	 	 *      - `factory` - `{string|function}`: If `string` then it is an alias for a service.
	 	 *        Otherwise if function, then it is {@link http://docs.angularjs.org/api/AUTO.$injector#invoke injected}
	 	 *        and the return value is treated as the dependency. If the result is a promise, it is
	 	 *        resolved before its value is injected into the controller.
	 	 *   - `edit` - `{object}` - Edit modus of the widget.
	 	 *      - `controller` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
	 	 *      - `template` - `{string=|function()=}` - Same as above, but for the edit mode of the widget.
	 	 *      - `templateUrl` - `{string=}` - Same as above, but for the edit mode of the widget.
	 	 *      - `resolve` - `{Object.<string, function>=}` - Same as above, but for the edit mode of the widget.
	 	 *      - `reload` - {boolean} - true if the widget should be reloaded, after the edit mode is closed.
	 	 *        Default is true.
	 	 */

		//if you change the widget "type" name (first argument) you need to change it app.js:26
		dashboardProvider.widget('mywidget', {
			title: 'Hello name',
			description: 'Hello name',
			controller: 'myCtrl',
			templateUrl: '../src/widget/index.html',
			edit: {
				templateUrl: '../src/widget/edit.html'
			}
	 	});
	}).controller('myCtrl', function ($scope, config) {
		$scope.name = config.name || 'Anonymous';
  	});
