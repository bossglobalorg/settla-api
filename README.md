# Settla API

## Installation

### Prerequisites

- Docker for Desktop
- Node.js LTS

### Getting started

- Clone the repository 
```console
git clone https://github.com/bossglobalorg/settla-api.git
```

- Run docker containers (DB, Redis, etc)
```console
docker-compose up -d
```

- Go to api folder and copy env file
```console
cd api
cp .env.example .env
```

- Update .env file with credentials if needed

- Next install dependencies
```console
npm ci
```

- Init config and run migrations
```console
npm run migrations:up
```

- Run application
```console
npm start
```

- Open browser and go to http://localhost:3000/api