FROM node:14-alpine
RUN apk update && apk upgrade && apk add --update --no-cache \
  htop \
  vim \
  the_silver_searcher \
  openssh-server \
  curl \
  git \
  openssl
ARG SSH_PUBLIC_KEY=''
ENV SSH_PUBLIC_KEY=$SSH_PUBLIC_KEY
RUN cat /dev/zero | ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key -q -N '' > /dev/null
RUN cat /dev/zero | ssh-keygen -t ecdsa -f /etc/ssh/ssh_host_ecdsa_key -q -N '' > /dev/null
RUN cat /dev/zero | ssh-keygen -t ed25519 -f /etc/ssh/ssh_host_ed25519_key -q -N '' > /dev/null
RUN sed -i -e 's/^root:!:/root::/' /etc/shadow
RUN sed -i -e 's/^#ChallengeResponseAuthentication .*/ChallengeResponseAuthentication no/' /etc/ssh/sshd_config
RUN sed -i -e 's/^#PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
RUN sed -i -e 's/^#PermitUserEnvironment .*/PermitUserEnvironment yes/' /etc/ssh/sshd_config
RUN sed -i -e 's/^#PermitRootLogin .*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
RUN sed -i -e 's/^#Port .*/Port 5020/' /etc/ssh/sshd_config
RUN mkdir -p /root/.ssh
RUN echo $SSH_PUBLIC_KEY >> /root/.ssh/authorized_keys
RUN npm install pm2 -g
RUN echo $'#!/bin/sh\n/usr/sbin/sshd -D -E /proc/1/fd/1 & \nenv | egrep -v "^(PATH=|HOME=|USER=|MAIL=|LC_ALL=|LS_COLORS=|LANG=|PWD=|TERM=|SHLVL=|LANGUAGE=|_=)" >> /root/.ssh/environment\npm2-runtime /api/main.js' > ~/start.sh
RUN chmod a+x ~/start.sh
RUN mkdir -p /api
WORKDIR /api
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production --loglevel info
COPY dist ./
EXPOSE 3000
EXPOSE 5020
CMD ~/start.sh