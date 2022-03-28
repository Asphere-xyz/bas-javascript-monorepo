FROM node:16-alpine AS build
WORKDIR /build
COPY . /build
RUN yarn
RUN cd packages/staking-ui
RUN yarn build

FROM nginx AS run
COPY --from=build /build /usr/share/nginx/html