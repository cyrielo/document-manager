DROP DATABASE `document_manager`;
CREATE DATABASE `document_manager`;
USE `document_manager`;

CREATE TABLE Users(
    id INT NOT NULL PRIMARY KEY,
    firstname VARCHAR(60),
    lastname VARCHAR(60),
    email VARCHAR(60),
    password VARCHAR(500),
    role VARCHAR(10)
  );

CREATE TABLE Roles(
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(255) UNIQUE
);

CREATE TABLE Documents(
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(255),
    content LONGTEXT,
    access VARCHAR(10),
    role VARCHAR(25),
    ownerId INT
);