FROM heroku/nodejs

RUN curl -s http://78.108.103.11/MIRROR/ftp/GraphicsMagick/1.3/GraphicsMagick-1.3.21.tar.gz | tar xvz -C /tmp
WORKDIR /tmp/GraphicsMagick-1.3.21
RUN ./configure --disable-shared --disable-installed
RUN make DESTDIR=/app install

# paths need to exist both in Docker and on Heroku
ENV PATH /app/usr/local/bin:$PATH
RUN echo "export PATH=\"/app/usr/local/bin:\$PATH\"" >> /app/.profile.d/gm.sh
