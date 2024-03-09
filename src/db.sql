CREATE SCHEMA IF NOT EXISTS `test_orders` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;

CREATE TABLE IF NOT EXISTS `test_orders`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`state` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `state_id` INT NOT NULL,
  `cp` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `state_id` (`state_id` ASC) VISIBLE,
  CONSTRAINT `city_ibfk_1`
    FOREIGN KEY (`state_id`)
    REFERENCES `test_orders`.`state` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`rol` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`client` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `date` DATETIME NULL DEFAULT NULL,
  `city_id` INT NOT NULL,
  `phone1` VARCHAR(255) NULL DEFAULT NULL,
  `phone2` VARCHAR(255) NULL DEFAULT NULL,
  `dni` VARCHAR(255) NULL DEFAULT NULL,
  `username` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(255) NULL DEFAULT NULL,
  `rol_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `city_id` (`city_id` ASC) VISIBLE,
  INDEX `rol_ibfk_1_idx` (`rol_id` ASC) VISIBLE,
  CONSTRAINT `client_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `test_orders`.`city` (`id`),
  CONSTRAINT `rol_ibfk_22`
    FOREIGN KEY (`rol_id`)
    REFERENCES `test_orders`.`rol` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`employee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `date` DATETIME NULL DEFAULT NULL,
  `city_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `city_id` (`city_id` ASC) VISIBLE,
  CONSTRAINT `employee_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `test_orders`.`city` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NULL DEFAULT NULL,
  `amount` FLOAT NULL DEFAULT NULL,
  `client_id` INT NULL DEFAULT NULL,
  `status` VARCHAR(45) NOT NULL,
  `delivery_time` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `client_fk_idx` (`client_id` ASC) VISIBLE,
  CONSTRAINT `client_fk`
    FOREIGN KEY (`client_id`)
    REFERENCES `test_orders`.`client` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 90
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`supplier` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NULL DEFAULT NULL,
  `date` DATETIME NULL DEFAULT NULL,
  `city_id` INT NOT NULL,
  `phone1` VARCHAR(255) NULL DEFAULT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `city_id` (`city_id` ASC) VISIBLE,
  INDEX `category_id` (`category_id` ASC) VISIBLE,
  CONSTRAINT `supplier_ibfk_1`
    FOREIGN KEY (`city_id`)
    REFERENCES `test_orders`.`city` (`id`),
  CONSTRAINT `supplier_ibfk_2`
    FOREIGN KEY (`category_id`)
    REFERENCES `test_orders`.`category` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`order_purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NULL DEFAULT NULL,
  `amount` DOUBLE NULL DEFAULT NULL,
  `supplier_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `supplier_id` (`supplier_id` ASC) VISIBLE,
  CONSTRAINT `order_purchase_ibfk_1`
    FOREIGN KEY (`supplier_id`)
    REFERENCES `test_orders`.`supplier` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NULL DEFAULT NULL,
  `description` VARCHAR(50) NULL DEFAULT NULL,
  `price` FLOAT NULL DEFAULT NULL,
  `active` TINYINT(1) NULL DEFAULT '1',
  `stock` INT NULL DEFAULT NULL,
  `image` VARCHAR(200) NULL DEFAULT NULL,
  `preparation_time` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`order_purchase_product` (
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  PRIMARY KEY (`order_id`, `product_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `order_purchase_product_ibfk_1`
    FOREIGN KEY (`order_id`)
    REFERENCES `test_orders`.`order_purchase` (`id`),
  CONSTRAINT `order_purchase_product_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `test_orders`.`product` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`orderline` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL DEFAULT NULL,
  `discount` FLOAT NULL DEFAULT NULL,
  `quantity` INT NULL DEFAULT NULL,
  `order_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  INDEX `fk_orderline_order` (`order_id` ASC) VISIBLE,
  CONSTRAINT `fk_orderline_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `test_orders`.`order` (`id`),
  CONSTRAINT `orderline_ibfk_1`
    FOREIGN KEY (`product_id`)
    REFERENCES `test_orders`.`product` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 83
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`position` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `test_orders`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NULL DEFAULT NULL,
  `password` VARCHAR(250) NULL DEFAULT NULL,
  `active` TINYINT(1) NULL DEFAULT '1',
  `rol_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `rol_ibfk_1_idx` (`rol_id` ASC) VISIBLE,
  CONSTRAINT `rol_ibfk_1`
    FOREIGN KEY (`rol_id`)
    REFERENCES `test_orders`.`rol` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `InsertOrderLineAndUpdateProduct`(
    IN p_product_id INT,
    IN p_discount DECIMAL(10, 2),
    IN p_quantity INT,
    IN p_order_id INT
)
BEGIN
    DECLARE old_stock INT;

    START TRANSACTION;

    INSERT INTO test_orders.orderline(product_id, discount, quantity, order_id)
    VALUES (p_product_id, p_discount, p_quantity, p_order_id);

    SELECT stock INTO old_stock FROM test_orders.product WHERE id = p_product_id;

    UPDATE test_orders.product
    SET stock = old_stock - p_quantity
    WHERE id = p_product_id;

    COMMIT;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_monthly_data`()
BEGIN
    SELECT
        DATE_FORMAT(date, '%M') AS month,
        SUM(amount) AS amount
    FROM
        test_orders.order
    WHERE
        status = 'CONFIRMED'
    GROUP BY
        DATE_FORMAT(date, '%M')
    ORDER BY
        MIN(date);
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_order_count_per_product`()
BEGIN
    SELECT
        p.name AS productName,
        COUNT(ol.id) AS orderCount
    FROM
        test_orders.product p
    LEFT JOIN
        test_orders.orderline ol ON p.id = ol.product_id
    GROUP BY
        productName;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_sales_count_by_month`()
BEGIN
    SELECT
        DATE_FORMAT(date, '%M') AS month,
        COUNT(*) AS sales_count
    FROM
        test_orders.order
    GROUP BY
        month
    ORDER BY
        MIN(date);
END$$
DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
