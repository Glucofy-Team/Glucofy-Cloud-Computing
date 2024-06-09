# <img src="https://github.com/Glucofy-Team/.github/blob/main/profile/img/logo.png" width="50"> Glucofy-Backend

## 1. Cloud Architecture
The app architecture in the cloud will be like this :

<img src="https://github.com/Glucofy-Team/Glucofy-Cloud-Computing/blob/main/img/Glucofy_Cloud.drawio.png">

We use Cloud Run, Cloud Storage, and Cloud Firestore services to support our application. The frontend consumes the API from two servers: the Backend and the Machine Learning models. The Backend directly connects to Cloud Firestore as a database. The Machine Learning models directly connect to Cloud Storage to store analyzed images from the user and to Cloud Firestore as a database. We deploy these services in the asia-southeast2 region and the asia-southeast2-b zone.

## 2. Database
<img src="https://github.com/Glucofy-Team/Glucofy-Cloud-Computing/blob/main/img/Glucofy_NoSQL.drawio.png">
Our application's database utilizes Firestore, which contains a primary user collection. Each document within this user collection represents an individual user and includes a tracker subcollection that stores related tracking information specific to that user.

## 3. API Endpoint
|             Endpoint        | Method |                                                      Body                                                     |            Description          | 
| :-------------------------: | :----: | :-----------------------------------------------------------------------------------------------------------: | :-----------------------------: |
|   /                         |   GET  |                                   -                                                                           | Accessing our root endpoints    | 
|   /auth/register            |  POST  |        firstName, lastName, phoneNumber, email, password, gender, weight, height, age                         | Register account for new user   | 
|   /auth/login               |  POST  |                             email, password                                                                   | Login to access the feature in application|   
|   /user/profile             |   GET  |                                   -                                                                           | Show the detail data from user  | 
|   /user/update              |   PUT  |`Anything you want to edit from` firstName, lastName, phoneNumber, email, password, gender, weight, height, age| Edit profile from user          | 
|   /user/delete              | DELETE |                                   -                                                                           | Delete profile from user        | 
|   /tracker                  |   GET  |                                   -                                                                           |Show all glucose trackers from user| 
|   /tracker/add              |  POST  |             glucose, condition, notes, datetime                                                               | Create new glucose tracker      | 
|/tracker/delete/{{trackerId}}| DELETE |                                   -                                                                           | Delete glucose tracker from user| 

## Deploy API to Cloud Run
- First, make sure the Artifact Registry, Cloud Run, and Cloud Build APIs are active by running the following command (click Authorize if the popup appears):
```console
gcloud services enable artifactregistry.googleapis.com cloudbuild.googleapis.com run.googleapis.com
```
- Create an Artifact Registry repository by running the following command:
```console
gcloud artifacts repositories create backend --repository-format=docker --location=asia-southeast2 --async
```
- Create a new container image by running the following command: 
```console
gcloud builds submit --tag asia-southeast2-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/backend/glucofy-api:1.0.0
```
- Deploy a new container image to Google Cloud Run:
```console
gcloud run deploy --image asia-southeast2-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/backend/glucofy-api:1.0.0
```
