$ heroku addons:create heroku-postgresql -r staging
$ heroku addons:create heroku-redis -r staging
$ heroku _container:build -r staging
$ heroku _container:run -r staging --config
