DROP DATABASE `document_manager`;
CREATE DATABASE `document_manager`;
USE `document_manager`;

CREATE TABLE Users(
    id INT NOT NULL PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    firstname VARCHAR(60),
    lastname VARCHAR(60),
    email VARCHAR(60),
    password VARCHAR(500),
    role VARCHAR(10)
  );

  