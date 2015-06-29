# ASCIIfy

This project demonstrates a non-trivial app with
[the compose branch of heroku-docker](https://github.com/heroku/heroku-docker/tree/compose).

## Workflow

- [install docker](https://docs.docker.com/installation/)
- [install docker-compose](https://docs.docker.com/compose/install/)
- check that docker is available (`docker ps`) (you may need to start `boot2docker` first)

```
$ git clone https://github.com/hunterloftis/asciify.git
$ cd asciify
$ docker-compose up web worker
```

Then, in a different terminal, open your docker host.
With boot2docker, this looks like:

```
$ open "http://$(boot2docker ip):8080"
```

Try some images:

- http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2013/4/30/1367315381079/1990-TEENAGE-MUTANT-NINJA-011.jpg
- http://fc08.deviantart.net/fs70/f/2011/072/0/f/shadow_across_her_face_by_hattori_hanzo_2010-d3bjg74.jpg

### Deploying

```
$ heroku create
$ heroku addons:create heroku-postgresql
$ heroku addons:create heroku-redis
$ heroku docker:release
$ heroku scale worker=1
$ heroku open
```

### Local development

First, [install the compose branch](https://github.com/heroku/heroku-docker/tree/compose#installation)
of heroku-docker. Then:

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

*docker-compose sometimes requires an (enter) to show the first line of stdout*

The volume is mounted, so you can open the project outside of docker in your usual editor,
make changes, and those changes will be reflected within the Cedar-14 container.

## Proof of concept

Four services compose ASCIIfy:

- web (node)
- worker (node)
- postgres (db)
- redis (queue)

All of this is handled by the [heroku-docker plugin's](https://github.com/heroku/heroku-docker/tree/compose)
`heroku docker:init` function, which generates a `Dockerfile` along with
`docker-compose.yml`.

ASCIIfy also needs graphicsmagick, which isn't built into Heroku's Cedar-14 stack.
We extend the stack to support the app by adding gm to the generated `Dockerfile`.
