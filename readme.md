# ASCIIfy

This project demonstrates a non-trivial app with
[the compose branch of heroku-docker](https://github.com/heroku/heroku-docker/tree/compose).

## Requirements

To run this project, you'll need to
[install docker](https://docs.docker.com/installation/)
and [compose](https://docs.docker.com/compose/install/).

You can check that docker is available by running `docker ps` in your terminal.
`docker-compose --version` should also run without error (tested with 1.2.0).

It's a good idea to restart boot2docker before trying this out,
as boot2docker can get into weird network states: `boot2docker restart`.

### Proof of concept

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

### Clone this project

```
$ git clone https://github.com/hunterloftis/asciify.git
$ cd asciify
```

### Start it up!

```
$ docker-compose up web worker
```

Then, in a different terminal, open your docker host.
With boot2docker, this looks like:

```
$ open "http://$(boot2docker ip):3000"
```

Try some images:

- http://fc08.deviantart.net/fs70/f/2011/072/0/f/shadow_across_her_face_by_hattori_hanzo_2010-d3bjg74.jpg
- https://c1.staticflickr.com/1/173/402025411_47075ce5f3_b.jpg
- https://s-media-cache-ak0.pinimg.com/236x/27/ff/23/27ff23066ff352197b0c32ca0421703c.jpg


### Hack

```
$ docker-compose run --service-ports shell
```

*docker-compose sometimes requires an (enter) to show the first line of stdout*

Now, you're running bash inside of a cedar-14 container!
The local volume is mounted (*.:/app/user*) so any changes you make inside
the container will persist in your application directory.

The local development workflow should feel pretty normal:

```
$ npm install
$ bin/worker &
$ nodemon bin/web
```

Edit the project's files in your favorite editor and nodemon will
automatically restart the server on .js file changes.

You can open your docker host in a browser to interact with the server.
With boot2docker, this looks like:

```
$ open "http://$(boot2docker ip):3000"
```
