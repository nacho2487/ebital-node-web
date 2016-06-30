# Node JS full web application

This is a full web application using Node JS on the backend and Bootstrap and jQuery on the frontend as main technologies.
It has a main web page full responsive and full localized for spanish and english, and an administration page with 6 fully updated sections: home, company, projects, services, news and clients.   

## Features
   Full responsive using bootstrap
   CRUD operations on Mongo database
   User login
   Images manager using Cloudinary server
   Localization for Spanish and English
   Unit test and integration test using Mocha BDD
   Error handler using Express
   Linting using eslint

## Tech stack
   **Backend**
   Node(latest version, using ES6 features)
   Mongoose
   Express
   Jade
   i18n
   Multer
   Cloudinary
   Passport
   Nodemailer
   Mocha
   Supertest
   EsLint

   **Frontend**
   Bootstrap
   jQuery
   FontAwesome
   Lightbox
   Tinymce


## Installation
1. Start MongoDB
Download MongoDB and start mongod using this guides for [windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/) or [os x](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
2. Clone the project
```
git clone https://github.com/nacho2487/ebital-node-web.git
cd ebital-node-web
```
3. (if you want to manage images) Create Cloudinary free account [here](https://cloudinary.com/users/register/free)
4. (if you want to send emails) Create Sendgrid free account [here](https://app.sendgrid.com/signup?id=8b9ae93b-ce8a-11e4-b4e5-5fcde71ee009)
5. Create configuration file .env
On the root of the project create a .env file with this keys:
   MONGOLAB_URI  (mongodb uri)
   MONGOLAB_URI_TEST (mongodb uri for unit test)
   SESSION_SECRET
   SENDGRID_USER
   SENDGRID_PASSWORD
   CLOUDINARY_URL
   ADMIN_USER (first admin user created)
   ADMIN_PASSWORD (first admin user created)

6. Start server
```
npm install
npm start
open http://localhost:3000
```

## Demo

   https://ebital-test.herokuapp.com/

   https://ebital-test.herokuapp.com/admin
   User: test
   Pass: test





