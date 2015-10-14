FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-QueueMusic.git /usr/local/src/queueMusic
RUN cd /usr/local/src/queueMusic; npm install
CMD ["nodejs", "/usr/local/src/queueMusic/app.js"]

EXPOSE 8842