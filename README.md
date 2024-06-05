# <img src="https://github.com/Glucofy-Team/.github/blob/main/profile/img/logo.png" width="50"> Glucofy-Backend

## 1. Cloud Architecture
The app architecture in the cloud will be like this :

<img src="https://github.com/Glucofy-Team/Glucofy-Cloud-Computing/blob/main/img/Glucofy_Cloud.drawio.png">

We use Cloud Run, Cloud Storage, and Cloud Firestore services to support our application. The frontend consumes the API from two servers: the Backend and the Machine Learning models. The Backend directly connects to Cloud Firestore as a database. The Machine Learning models directly connect to Cloud Storage to store analyzed images from the user and to Cloud Firestore as a database. We deploy these services in the asia-southeast2 region and the asia-southeast2-b zone.

## 2. Database
<img src="https://github.com/Glucofy-Team/Glucofy-Cloud-Computing/blob/main/img/Glucofy_NoSQL.drawio.png">
Our application's database utilizes Firestore, which contains a primary user collection. Each document within this user collection represents an individual user and includes a tracker subcollection that stores related tracking information specific to that user.

## Deploy Models to Cloud Run
 **Build the Docker Image**:
    ```console
    docker build -t gcr.io/glucofy/machine-learning:tag .
    ```
    
**Push the Docker Image to Container Registry**:
    ```console
    docker push gcr.io/glucofy/machine-learning:tag
    ```
    
**Deploy to Google Cloud Run**:
    ```console
    gcloud run deploy machine-learning \
        --image gcr.io/glucofy/machine-learning:tag \
        --platform managed \
        --region asia-southeast2 \
        --allow-unauthenticated \
        --memory 2Gi
    ```
    
## Endpoints

| Endpoint    | Method | Description              |
|-------------|--------|--------------------------|
| `/recommend`| GET    | Gives meal recommendation|
| To be discussed                                 |

