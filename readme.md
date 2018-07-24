# ASCIIfy

This project demonstrates a non-trivial app with
[container-build](https://devcenter.heroku.com/articles/build-and-run-heroku-apps-locally-with-docker?preview=1).

## Quick Start

- Install [Docker](https://www.docker.com/)
- Check that docker is available in your terminal (`docker ps`)

```
$ heroku plugins:install container-build
$ git clone https://github.com/heroku-examples/node-asciify.git
$ cd node-asciify
$ heroku create
$ heroku addons:create heroku-redis
$ heroku addons:create heroku-postgresql
$ heroku _container:build
$ heroku _container:run --config
```

Now open [http://localhost:5000](http://localhost:5000).

Then, in a new terminal:

```
$ cd node-asciify
$ heroku _container:run --type worker --config
```

Now, you have two local dynos running: `web` and `worker`.
Your [local server](http://localhost:5000) should be able to turn images into ASCII art.

Test some images:

- http://static.comicvine.com/uploads/original/14/147508/4716538-the_avengers___ironman_by_stephencanlas-d4zpaxl.jpg
- http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/4/30/1367315381079/1990-TEENAGE-MUTANT-NINJA-011.jpg
- http://fc08.deviantart.net/fs70/f/2011/072/0/f/shadow_across_her_face_by_hattori_hanzo_2010-d3bjg74.jpg

## Deploy

Once you're done working locally, deploy to Heroku:

```
$ heroku _container:build
$ heroku _container:push
$ heroku scale worker=1
$ heroku open
```

## All the Moving Parts

ASCIIfy is composed of four parts and is intentionally modular to
illustrate how Heroku-Docker helps manage complexity:

- web (node.js)
- worker (node.js)
- postgres (db - processed images)
- redis (queue - pending images)
- graphicsmagick (custom binary)

ASCIIfy also needs graphicsmagick, which isn't built into Heroku's Cedar-14 stack.
We extend the stack to support the app by adding the dependency to `heroku.yml`.

## Compared to a standard deploy

Try this with a new Heroku app:

```
$ git remote rm heroku
$ heroku create
$ heroku addons:create heroku-postgresql
$ heroku addons:create heroku-redis
$ git push heroku master
$ heroku scale worker=1
$ heroku open
```

This app will never process images because the worker crashes when trying to locate graphicsmagick.

## Compared to a Dockerfile deploy

In order to deploy this with a Dockerfile,
you'll need to first write (or find) an appropriate Dockerfile.
Then you'll need to use Docker locally to build the image,
then tag the image,
then push the image to Heroku's container registry.

Good luck!
