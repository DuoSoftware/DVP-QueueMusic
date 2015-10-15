FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-QueueMusic.git /usr/local/src/queuemusic
RUN cd /usr/local/src/queuemusic; npm install
CMD ["nodejs", "/usr/local/src/queuemusic/app.js"]

EXPOSE 8842
