FROM node:12-alpine

ENV NODE_ENV production
ENV PORT 3000
ENV HOME /opt/app

WORKDIR ${HOME}
COPY . ${HOME}

RUN npm install && \
npm cache clean --force

EXPOSE 3000

CMD [ "npm", "start" ]
