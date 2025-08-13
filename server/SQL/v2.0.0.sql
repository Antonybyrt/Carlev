CREATE TABLE IF NOT EXISTS loaner_car(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    car_brand_id INT NOT NULL,
    car_model_id INT NOT NULL,
    registration_id INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (car_brand_id) REFERENCES car_brand(id),
    FOREIGN KEY (car_model_id) REFERENCES car_model(id),
    FOREIGN KEY (registration_id) REFERENCES registration(id)
);

CREATE TABLE IF NOT EXISTS loan(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    loaner_car_id INT NOT NULL,
    or_number INT NOT NULL,
    customer_id INT NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    notes VARCHAR(1500) NOT NULL,
    FOREIGN KEY (loaner_car_id) REFERENCES loaner_car(id),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);