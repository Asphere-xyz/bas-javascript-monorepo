FROM node:16-alpine AS build
WORKDIR /build
RUN apk update && apk add python3 alpine-sdk
COPY . /build
RUN yarn
RUN yarn build && cd packages/config-ui && yarn build

FROM nginx AS run
COPY --from=build /build/packages/config-ui/build /usr/share/nginx/html
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD /entrypoint.sh