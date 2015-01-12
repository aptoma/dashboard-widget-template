Desklist Widget
===============

This widget provides a desklist for DrPublish, with lists recent of articles
and related activity.

Setup
-----

This widget depends on three values from the environment:

    .value('token', 'ey..ik')
    .value('apiBase', 'http://drp-dev.aptoma.no/gunnar/drpublish/api')
    .value('publication', 'Solarius')

We need to figure out how to best provide these. For now, you can add
them to `../app/app.js`, in order to have a working demo.

`apiBase` and `publication` is should probably be encoded in the `token`,
and the `token` should be provided either from DrPublish through a login
dialog, or from the Dashboard framework as an AngularJS service or value.

To generate a token, do a POST to `api/login`, with username, password and
publication id in the body:

````
POST http://drp-dev.aptoma.no/gunnar/drpublish/api/login
Content-Type: application/json

{"username": "aptoma", "password": "secret", "publicationId": 2}
````
