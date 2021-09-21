# Hissingsbron

## Run it locally

### Frontend

```
cd frontend
npm install
REACT_APP_HOST_IP_ADDRESS=http://localhost:8000 npm start
```

### Backend

```
cd backend
python -m venv venv
source venv/bin/activate
cd app
uvicorn main:app --reload  
```

## Run it using Docker

### Using Docker Compose

### Frontend

```
cd frontend
docker build -t frontend:dev .
docker run
    -it \
    --rm \
    -v ${PWD}:/app \
    -v /app/node_modules \
    -p 3001:3000 \
    -e CHOKIDAR_USEPOLLING=true \
    frontend:dev

```
Visible on 127.0.0.1:3001


### Backend
```
cd backend
docker build -t backend:dev .
docker run -d --name backendcontainer -p 80:80 backend:dev
```