# Dockerfile for BrainFit container
FROM debian:stretch
MAINTAINER Contextual Dynamics Lab <contextualdynamics@gmail.com>

# install debian-related stuff
RUN apt-get update
RUN apt-get install -y eatmydata
RUN eatmydata apt-get install -y \
    python-dev \
    default-libmysqlclient-dev \
    python-pip \
    procps \
    git \
    curl \
    yasm \
    python-tk
RUN rm -rf /var/lib/apt/lists/*


# install python packages
RUN pip install --upgrade pip
RUN pip install --upgrade \
setuptools \
requests \
mysql-python \
google-cloud-speech \
psiturk \
pydub \
quail

# install ffmpeg
RUN git clone https://github.com/FFmpeg/FFmpeg
RUN cd FFmpeg && ./configure --enable-gpl && \
make && make install && ldconfig

# need google-cloud-speech version 0.30 instead of 0.32
RUN pip install google-cloud

# add experiment folder
#ADD exp /psiturk/exp

#add environment variable for Google credentials (?)
#ENV GOOGLE_APPLICATION_CREDENTIALS=/psiturk/exp/google-credentials/credentials.json

# setup working directory
WORKDIR /psiturk

# set up psiturk to use the .psiturkconfig in /psiturk
ENV PSITURK_GLOBAL_CONFIG_LOCATION=/psiturk/

# expose port to access psiturk from outside
EXPOSE 22362


