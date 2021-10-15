#!/bin/bash

ACCOUNT_ID=$1

# Build backend image
docker build -t $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/hissingsbridgerepository:backend backend/

# Log into AWS ECR
aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com

# Push images to ECR
docker push $ACCOUNT_ID.dkr.ecr.eu-north-1.amazonaws.com/hissingsbridgerepository:backend