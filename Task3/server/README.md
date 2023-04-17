# Demo for Authentication

An app demonstrating simple API implementation with NodeJs, Express and MongoDb

The `api` uri preceed all API endpoints and the following endpoints are currently available
* GET `/api/products`
* POST `/api/products`
* GET `/api/products/:id`
* PUT `/api/products/:id`
* PATCH `/api/products/:id`
* DELETE `/api/products/:id`

```
Start Express server - nodemon server
Access Postman
```

```
Login Endpoint
* POST `/user/login`

Registration Endpoint
* POST `/user/registration`
```

```
Set auth-token under headers with user token value
```

```
MongoDB

show dbs
use <db name>
show collections
db.collectionName.find()
db.collection.drop()
db.dropDatabase()
```
