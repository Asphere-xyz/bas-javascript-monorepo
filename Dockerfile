FROM node:16-alpine AS build
WORKDIR /build
RUN apk update && apk add python3 alpine-sdk
COPY . /build
RUN yarn
RUN cd packages/staking-ui && yarn build:testnet

FROM nginx AS run
COPY --from=build /build/packages/staking-ui/build /usr/share/nginx/html