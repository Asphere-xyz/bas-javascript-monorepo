FROM node:16-alpine AS build
WORKDIR /build
COPY . /build
RUN yarn
RUN yarn build

FROM nginx AS run
COPY --from=build /build/build /usr/share/nginx/html