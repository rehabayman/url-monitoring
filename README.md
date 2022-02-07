## URL Monitoring App
This app is for providing the APIs to check the uptime monitoring for urls provided by an authenticated and authorized user and sending the report to the user's email.

## Getting Started

These steps will get you a copy of the project up and running for development and testing purposes.
## Installation

1. Install  **Nodejs**,  _^v12.18.3_
2. Install  **npm** _^6.14.6_
3. Install  **mongoDB** _^5.0.2_
4. _Optional Step_ ⇒ You can install **MongoDB Compass** [any user interface application for MongoDB] as it offers a user interface for dealing with the database
5. Clone the Project
6. Run the following commands:
	```
	npm install
	cp .env.example .env
	```
7. Create a database in mongo for the application.
8. In the **.env** file change the  `DB_HOST`,  `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` and `DB_PORT`  variables to match the credentials of the database you just created. 
9. In the **.env** file change the  `JWT_SECRET`,  `EMAIL_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD` and `EMAIL_USER_DISPLAY`.

## User Features
1. Sign up
2. Verify email
3. Sign in
4. Create, Update and Delete checks for the url(s) he wants to check
5. Receive check monitor results on Email and/or specified webhook

## URLs
GET {{server_url}}/api-docs/ - to browse the url documentation

## Built With
1. Nodejs
2. MongoDB
