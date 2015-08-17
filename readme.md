# ASCIIfy

This project demonstrates a non-trivial app with
[heroku-docker](https://github.com/heroku/heroku-docker).

## Quick Start

- [install docker](https://docs.docker.com/installation/)
- [install docker-compose](https://docs.docker.com/compose/install/)
- check that docker is available (`docker ps`)
- check that docker-compose is available (`docker-compose -v`)

```
$ git clone https://github.com/heroku-examples/node-asciify.git
$ cd node-asciify
$ docker-compose up web worker
```

Then, in a different terminal, open your docker host.
With boot2docker, this looks like:

```
$ open "http://$(boot2docker ip):8080"
```

Try some images:

- http://static.comicvine.com/uploads/original/14/147508/4716538-the_avengers___ironman_by_stephencanlas-d4zpaxl.jpg
- http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/4/30/1367315381079/1990-TEENAGE-MUTANT-NINJA-011.jpg
- http://fc08.deviantart.net/fs70/f/2011/072/0/f/shadow_across_her_face_by_hattori_hanzo_2010-d3bjg74.jpg

### Deploying

First, install the heroku-docker plugin:

```
$ heroku plugins:install heroku-docker
```

Then, create and release the app:

```
$ heroku create
$ heroku docker:release
$ heroku scale web=1 worker=1
$ heroku open
```

### Local development

```
$ docker-compose run --service-ports shell
root@368fd5150ded:/app/user# npm install
root@368fd5150ded:/app/user# bin/worker &
root@368fd5150ded:/app/user# nodemon bin/web
```

You can open your docker host in a browser to interact with the server.
With boot2docker, this looks like:

```
$ open "http://$(boot2docker ip):8080"
```

The volume is mounted, so you can open the project outside of docker in your usual editor,
make changes, and those changes will be reflected within the Cedar-14 container.

## All the Moving Parts

ASCIIfy is composed of four parts and is intentionally modular to
illustrate how Heroku-Docker helps manage complexity:

- web (node.js)
- worker (node.js)
- postgres (db - processed images)
- redis (queue - pending images)
- graphicsmagick (custom binary)

ASCIIfy also needs graphicsmagick, which isn't built into Heroku's Cedar-14 stack.
We extend the stack to support the app by adding gm to the generated `Dockerfile`.
