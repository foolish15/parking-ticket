# Parking Ticket

## Tools

- Implement with Nodejs, Typescript
- Database is MySQL
- Develop environment use Docker
- Rest API document use Postmant

## Get start

- Start MySQL database `docker compose up -d`
- Install package `npm install`
- Setting environment variable `cp .env.example .env`
- Initial your database `npm run db:init`
- Start service `npm dev:start`

## API document

- You can import Postman request and environment file from `./docs/postman` directory

## Build docker image and run

- Build command use `docker build -f .Dockerfile -t your-image-name`
- Run command `docker run you-image-name`

## Run with docker compose

- Pull image `docker compose pull`
- Build image `docker compose build`
- Run `docker compose up -d`
