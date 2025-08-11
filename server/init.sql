CREATE DATABASE IF NOT EXISTS Carlev;
USE Carlev;

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    pw VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email),
);

CREATE TABLE IF NOT EXISTS user_session (
    user_id INT,
    expirationDate DATETIME NOT NULL,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY (token),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS login (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    login_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    login_id INT NOT NULL,
    FOREIGN KEY (login_id) REFERENCES login(id)
);

CREATE TABLE IF NOT EXISTS car_brand (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    brand_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS car_model(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    model_name VARCHAR(255) NOT NULL,
    brand_id INT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES car_brand(id) ON DELETE CASCADE;
);

CREATE TABLE IF NOT EXISTS supplier(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
);

CREATE TABLE registration (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  registration_name varchar(255) NOT NULL,
);

CREATE TABLE IF NOT EXISTS orders(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    creation_date DATETIME NOT NULL,
    customer_id INT NOT NULL,
    car_brand_id INT NOT NULL,
    car_model_id INT NOT NULL,
    supplier_id INT NOT NULL,
    login_id INT NOT NULL,
    registration_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(id),
    FOREIGN KEY (car_brand_id) REFERENCES car_brand(id),
    FOREIGN KEY (car_model_id) REFERENCES car_model(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    FOREIGN KEY (login_id) REFERENCES login(id),
    FOREIGN KEY (registration_id) REFERENCES registration(id)
);

CREATE TABLE IF NOT EXISTS item(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    item_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS order_detail(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    quantity INT NOT NULL,
    item_id INT NOT NULL,
    order_id INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO login (login_name)
VALUES
	('Levon'),
	('CarLev'),
	('Cal');
    
SELECT * FROM login;