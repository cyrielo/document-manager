
[![Coverage Status](https://coveralls.io/repos/github/cyrielo/document-manager/badge.svg?branch=development)](https://coveralls.io/github/cyrielo/document-manager?branch=development) [![Code Climate](https://codeclimate.com/github/cyrielo/document-manager/badges/gpa.svg)](https://codeclimate.com/github/cyrielo/document-manager) [![Build Status](https://travis-ci.org/cyrielo/document-manager.svg?branch=development)](https://travis-ci.org/cyrielo/document-manager)

# document-management-system
The document management systems manages users, user roles, and the document the users create

## Requirements
- Clone or Download the project.
- Open the command line and cd into the folder.
- Install dependencies ```npm install```.
- You can install nodemon and run the ```nodemon``` command to run it or just type in ```node server.js```.
- Run test ```npm test```.

## Usage
- Login with the route '/api/users/login' using the 'admin' as username and password.
- You can use the following routes:
  - **'/api/users'**
    - **GET** retrieves all the users.
    - **POST** creates a new user.

  - **'/api/users/:id'**
    - **GET** returns a specific user with same id.
    - **PUT** updates a specific user with new details.
    - **DELETE** deletes a specific user.

  - **'/api/users/login'**
    - **POST** logs in a user.

  - **'/api/users/logout'**
    - **POST** logs out a user

  - **'/api/users/:id/documents'**
    - **GET** retrieves document created by the user

  - **'/api/documents'**
    - **GET** retrieves all documents in the system
    - **POST** creates a new document

  - **'/api/documents/:id'**
    - **GET** retrieves a document with same matching id.
    - **PUT** updates document with new details
    - **DELETE** deletes a particular document from the system



  - **'/api/roles'**
    - **GET** retrieves all roles.
    - **POST** create new role.


  - **'/api/roles/:id'**
    - **GET** retrieves specific role.
    - **PUT** update the role with new details
    - **DELETE** deletes the role using the id.