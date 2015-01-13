/**
 * Mock for the tokenService thats available in the dashboard.
 */
angular
	.module('common.services.token', [])
	.factory('TokenService', function () {
		var TokenService = {
			get: function () {
				return '';
			},

			getDecoded: function () {
				return {
					drp: {
						url: 'http://drp-dev.aptoma.no/gunnar/drpublish/api',
						pub: 'Solarius'
					}
				};
			}
		};

		return TokenService;
	});