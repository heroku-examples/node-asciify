```
$ git remote -v
origin	git@github.com:heroku-examples/node-asciify.git (fetch)
origin	git@github.com:heroku-examples/node-asciify.git (push)
prod	https://git.heroku.com/asciify-prod.git (fetch)
prod	https://git.heroku.com/asciify-prod.git (push)
staging	https://git.heroku.com/asciify-staging.git (fetch)
staging	https://git.heroku.com/asciify-staging.git (push)

$ heroku addons:create heroku-postgresql -r staging
$ heroku addons:create heroku-redis -r staging
$ heroku _container:build -r staging
$ heroku _container:run -r staging --config
```