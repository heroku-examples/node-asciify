# ASCIIfy

This project demonstrates a non-trivial app with
[heroku-docker and docker-compose](https://github.com/heroku/heroku-docker/tree/compose).

It requires the following services:

- web (node)
- worker (node)
- postgres (db)
- redis (queue)

All of this complexity is handled within the heroku-docker plugin's
`heroku docker:init` function, which generates a `Dockerfile` and
`docker-compose.yml`.

It also requires an extension to the node Dockerfile (for graphicsmagick).
This is accomplished by editing the generated `Dockerfile`.

### Clone this project

```
$ git clone https://github.com/hunterloftis/asciify.git
$ cd asciify
```

### Start it up!

```
$ docker-compose up web worker
$ open "http://$(boot2docker ip):3000"
```

Try some images:

- http://fc08.deviantart.net/fs70/f/2011/072/0/f/shadow_across_her_face_by_hattori_hanzo_2010-d3bjg74.jpg
- https://c1.staticflickr.com/1/173/402025411_47075ce5f3_b.jpg
- https://s-media-cache-ak0.pinimg.com/236x/27/ff/23/27ff23066ff352197b0c32ca0421703c.jpg


### Edit

```
$ docker-compose run --service-ports shell
$
```
