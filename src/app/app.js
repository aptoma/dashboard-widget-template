'use strict';

angular
	.module('app', ['ui.router', 'adf', 'drp.desklist'])
	.config(function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('root', {
				url: '/',
				views: {
					main: {
						controller: 'DashboardCtrl',
						template: '<adf-dashboard name="{{dashboard.name}}" structure="4-8" adf-model="dashboard.model" />'
					}
				}
			});
	}).controller('DashboardCtrl', function ($scope) {
		$scope.dashboard = {
			name: 'Dashboard',
			model: {
				rows: [{
					columns: [{
						styleClass: 'col-md-12',
						widgets: [{
							title: 'My Widget',
							type: 'desklist',
							config: {
							}
						}]
					}]
				}]
			}
		};
	});
