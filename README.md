[![Netlify Status](https://api.netlify.com/api/v1/badges/30e1ada8-1dab-4e0f-ad0c-fb67e3228baf/deploy-status)](https://app.netlify.com/sites/hissingsbron/deploys)

# Hissingsbron

**www.hissingsbron.se**

*Currently, the data from Göteborg Stad is not available so no data is shown*

Web application for displaying the status new bridge connecting Hissingen with Göteborg, [hissingsbron](https://sv.wikipedia.org/wiki/Hisingsbron).

It visualizes whether and when the bridge was **open** or **closed** for the last
- 24h
- Week
- Month

I develop this web application with the goal of learning:
- Web development using React.
- Continuous deployment of docker containers to AWS ECR and running them in AWS ECS.
- Deployment and DNS configuration of a website.


## Infrastructure and frameworks
- **Backend**:
    - API developed in Python using [FastApi](https://fastapi.tiangolo.com/) containing two `GET` endpoints. 
        - `/current-status` - Get latest status.
        - `/history` - Get historical data between two dates.
    - SQLite db storing timestamps when the status changes.
    - (Not yet automated) Stored as a container image in `AWS ECR` and hosted in `AWS ECS`
- **Frontend**:
    - React App
    - Hosted using [netlify](https://www.netlify.com/) 


## Run Backend locally


### Create a virtual environment and install dependencies

```
cd backend && python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
### Start the backend

```
cd app
uvicorn main:app --reload
```

### Run tests

```
pytest test/
```

### Format python code
```
black .
```

## Run Frontend locally

### Install dependencies

```
cd frontend && npm install
```

### Start the frontend
```
REACT_APP_HOST_IP_ADDRESS=http://localhost:8000 npm start
```

## Run it using Docker

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