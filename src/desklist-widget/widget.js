'use strict';

angular
    //if you change module name you need to change app.js that loads it.
    .module('drp.desklist', ['ngSanitize', 'adf.provider', 'templates', 'ui.bootstrap'])
    .config(function (dashboardProvider, $tooltipProvider) {
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
        dashboardProvider.widget('desklist', {
            title: 'This is my name',
            description: 'This is my description',
            controller: 'myCtrl',
            templateUrl: '../src/desklist-widget/index.html',
            reload: true,
            edit: {
                templateUrl: '../src/desklist-widget/edit.html'
            }
        });

        $tooltipProvider.options({appendToBody: true});
    })
    .controller('myCtrl', function ($scope, config, DrPublish) {
        $scope.name = config.name || 'Anonymous';
        $scope.list = {
            labels: {
                published: 'Published',
                waiting: 'Waiting',
                draft: 'Drafts'
            },
            offsetClass: 'list-offset-0'
        };
        $scope.refresh = function () {
            $scope.$broadcast('desklist-refresh');
        };

        DrPublish.getCategories().then(function (response) {
            $scope.categories = response.data;
        });

    })
    .factory('DrPublish', function ($http, apiBase, token, publication) {

        function getHttpOptions() {
            return {
                headers: {Authorization: 'Bearer ' + token},
                params: {}
            };
        }

        function getArticles(params) {
            var options = getHttpOptions();
            var defaultSearchParams = {
                order: 'published desc', limit: 50, fields: 'id,metaHeadline,title,modified,published,tag,author,lastEditName,lastEdit,status,subStatus,isWithdrawn,liveArticleUrl,editArticleUrl'
            };
            options.params = angular.extend({}, options.params, defaultSearchParams, params);

            return $http.get(apiBase + '/' + publication + '/articles/search', options);
        }

        function getArticleNotes(articleIds) {
            var params = {
                order: 'asc',
                ids: articleIds.join(',')
            };
            var options = getHttpOptions();
            options.params = angular.extend({}, options.params, params);

            return $http.get(apiBase + '/article-notes', options);
        }

        function getCategories() {
            var options = getHttpOptions();
            return $http.get(apiBase + '/categories', options);
        }

        return {
            getArticles: getArticles,
            getCategories: getCategories,
            getArticleNotes: getArticleNotes
        };
    })
    .factory('DesklistListener', function ($compile, DrPublish) {
        function afterRender(articleIds, context) {
            renderArticleNotes(articleIds, context);
        }

        function renderArticleNotes(articleIds, context) {
            var template = $compile('<div ng-repeat="note in notes">{{note.message}} <span class="text-muted">{{note.author}}, {{note.created}}</span></div>');

            DrPublish.getArticleNotes(articleIds).then(function (response) {
                articleIds.forEach(function (articleId) {
                    var isExpanded;
                    var notes = response.data[articleId];

                    if (!notes) {
                        context.addActionItem(articleId, 'notes', {cssClass: 'notes-container no-notes'});
                        return;
                    }


                    context.addActionItem(articleId, 'notes', {
                        html: '<span class="notes-count">' + notes.length + '</span>',
                        cssClass: 'notes-container has-notes',
                        toolTip: notes[0].message + '<br/><i style="font-size: 11px">' + notes[0].author + ', ' + notes[0].created + '</i>',
                        onClick: onClick
                    });

                    function onClick() {
                        if (isExpanded) {
                            context.emptyExpandedContent(articleId);
                            isExpanded = false;
                            return;
                        }

                        var $scope = context.getScope(articleId);
                        $scope.notes = notes;
                        context.setExpandedContent(articleId, template($scope));
                        isExpanded = true;
                    }
                });
            });
        }

        return {
            afterRender: afterRender
        };
    })
    .filter('tr', function () {
        var strings = {};
        return function (value) {
            return strings['value'] || value;
        };
    })
    .filter('drpdate', function (dateFilter) {
        return function (value) {
            return dateFilter(new Date(value), 'dd.MM hh:mm');
        };
    })
    .directive('desklistArticleList', function ($compile, DrPublish, DesklistListener) {
        return {
            restrict: 'E',
            templateUrl: '../src/desklist-widget/article-list.html',
            scope: {
                status: '@',
                category: '@'
            },
            link: function ($scope, $element) {
                var articleIds = [];
                var articlesById = {};
                var listenerMethods = {
                    addActionItem: addActionItem,
                    emptyExpandedContent: emptyExpandedContent,
                    setExpandedContent: setExpandedContent,
                    getScope: getScope
                };
                var isolateScopes = {};

                $scope.filters = {};

                $scope.$watch('category', fetch);
                $scope.$on('desklist-refresh', fetch);

                function fetch() {
                    DrPublish.getArticles({status: $scope.status, category: $scope.category}).then(function (response) {
                        $scope.articles = response.data.items;
                        $scope.subStatuses = [];
                        response.data.items.forEach(function (item) {
                            item.extraContent = {};
                            articleIds.push(item.id);
                            articlesById[item.id] = item;
                            if (item.subStatus && $scope.subStatuses.indexOf(item.subStatus) === -1) {
                                $scope.subStatuses.push(item.subStatus);
                            }
                        });

                        if ($scope.subStatuses.length > 1) {
                            $scope.filters.subStatus = $scope.subStatuses[0];
                        }

                        DesklistListener.afterRender(articleIds, listenerMethods);
                    });
                }

                function addActionItem(articleId, name, extra) {
                    articlesById[articleId].extraContent[name] = extra;
                }

                function emptyExpandedContent(articleId) {
                    getContainer(articleId).find('.expanded-content').empty();
                }

                function setExpandedContent(articleId, content) {
                    getContainer(articleId).find('.expanded-content').html(content);
                }

                function getScope(articleId) {
                    if (!isolateScopes[articleId]) {
                        isolateScopes[articleId] = $scope.$new(true);
                    }

                    return isolateScopes[articleId];
                }

                function getContainer(articleId) {
                    return $element.find('[data-article-id=' + articleId + ']');
                }
            }
        };
    })
    .filter('desklistArticleListTooltip', function (trFilter) {
        return function (article) {
            var tooltip = trFilter('Last edit') + ': <strong> ' + article.lastEditName + '</strong>';

            if (angular.isArray(article.authors)) {
                tooltip = tooltip + '<br/>' + trFilter('Authors') + ': <strong>' + article.authors.join(', ') + '</strong>';
            }

            if (article.isWithdrawn) {
                tooltip = tooltip + '<br/> <strong class="withdrawn">' + trFilter('Withdrawn') + '</strong>';
            }

            return tooltip;
        };
    })
    .filter('desklistTagsTooltip', function (trFilter) {
        return function (article) {
            if (!article.tags) {
                return trFilter('No tags');
            }

            return trFilter('Tags') + ': ' + article.tags.join(', ');
        };
    })
;
