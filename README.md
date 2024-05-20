# API-Glucofy

## 1. Cloud Architecture
The app architecture in the cloud will be like this :

![Cloud Architecture drawio](https://github.com/Glucofy-Team/Glucofy-Cloud-Computing/assets/93801579/941d2d50-b8f5-46be-a9d0-1ce3e96a8881)

We use Cloud Run, Cloud Storage, and Cloud Firestore services to support our application. The frontend consumes the API from two servers: the Backend and the Machine Learning models. The Backend directly connects to Cloud Firestore as a database. The Machine Learning models directly connect to Cloud Storage to store analyzed images from the user and to Cloud Firestore as a database. We deploy these services in the asia-southeast2 region and the asia-southeast2-b zone.
