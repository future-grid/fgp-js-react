FROM node:10-alpine
COPY . /opt/app
RUN cd /opt/app && \
    npm install -f
RUN cd /opt/app && \
    npm run-script build