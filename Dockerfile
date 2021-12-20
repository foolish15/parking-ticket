FROM node:16-alpine as ts-compiler
WORKDIR /usr/app
COPY package.json ./
COPY tsconfig.json ./
COPY tslint.json ./
RUN npm install
COPY jest.config.js ./
COPY babel.config.js ./
COPY knexfile.ts ./
COPY ./tests ./tests
COPY ./src ./src
RUN npm run test && npm run build

FROM node:16-alpine as ts-remover
WORKDIR /usr/app
COPY --from=ts-compiler /usr/app/package.json ./
COPY --from=ts-compiler /usr/app/dist ./
RUN npm install --only=production

FROM gcr.io/distroless/nodejs:16
WORKDIR /usr/app
COPY --from=ts-remover /usr/app ./
USER 1000
CMD ["src/index.js"]