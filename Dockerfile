ARG BUILD_IMAGE_NAME=docker-remote-docker-hub.jfrog.adeo.cloud/node:22-alpine
ARG FINAL_IMAGE_NAME=adeo-docker.jfrog.io/dockerfiles-distroless-collection/distroless-adeo-node22:latest

FROM $BUILD_IMAGE_NAME AS builder
#Create folder and add user with rights
RUN mkdir -p /usr/src/web-app
RUN adduser -u 1001 1001 --disabled-password
RUN chown 1001 -R /usr/src/web-app
USER 1001
WORKDIR /usr/src/web-app/
#Copy needed files
COPY --chown=1001:1001 ./package*.json /usr/src/web-app/
COPY --chown=1001:1001 ./node_modules /usr/src/web-app/node_modules
COPY --chown=1001:1001 ./dist /usr/src/web-app/dist

FROM $FINAL_IMAGE_NAME
COPY --from=builder /usr/src/web-app/ /usr/src/web-app/
WORKDIR /usr/src/web-app
EXPOSE 8080
EXPOSE 8081
ENTRYPOINT ["node", "dist/main.js"]