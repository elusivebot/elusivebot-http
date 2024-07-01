FROM node:20
LABEL version="0.0.1" description="ElusiveBot HTTP backend endpoint service" maintainer="bryan@degrendel.com"

WORKDIR /home/node/service

USER node
COPY .package.json package.json
COPY .package-lock.json package-lock.json
COPY dist dist
COPY node_modules node_modules

CMD ["node", "./dist/index.js"]

