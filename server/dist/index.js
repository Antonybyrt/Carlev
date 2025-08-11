"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_config_1 = __importDefault(require("./config/database.config"));
const middleware_1 = require("./middleware");
// Controllers
const controllers_1 = require("./controllers");
const controllers_2 = require("./controllers");
const controllers_3 = require("./controllers");
const controllers_4 = require("./controllers");
const controllers_5 = require("./controllers");
const controllers_6 = require("./controllers");
const controllers_7 = require("./controllers");
const controllers_8 = require("./controllers");
const controllers_9 = require("./controllers");
const controllers_10 = require("./controllers");
const controllers_11 = require("./controllers");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Initialize controllers
const authController = new controllers_1.AuthController();
const userController = new controllers_2.UserController();
const carBrandController = new controllers_3.CarBrandController();
const carModelController = new controllers_4.CarModelController();
const customerController = new controllers_5.CustomerController();
const itemController = new controllers_6.ItemController();
const loginController = new controllers_7.LoginController();
const orderController = new controllers_8.OrderController();
const orderDetailController = new controllers_9.OrderDetailController();
const registrationController = new controllers_10.RegistrationController();
const supplierController = new controllers_11.SupplierController();
app.use("/auth", authController.buildRoutes());
app.use("/user", userController.buildRoutes());
app.use("/car_brand", middleware_1.AuthMiddleware.requireAuth, carBrandController.buildRoutes());
app.use("/car_model", middleware_1.AuthMiddleware.requireAuth, carModelController.buildRoutes());
app.use("/customer", middleware_1.AuthMiddleware.requireAuth, customerController.buildRoutes());
app.use("/item", middleware_1.AuthMiddleware.requireAuth, itemController.buildRoutes());
app.use("/login", middleware_1.AuthMiddleware.requireAuth, loginController.buildRoutes());
app.use("/orders", middleware_1.AuthMiddleware.requireAuth, orderController.buildRoutes());
app.use("/order_detail", middleware_1.AuthMiddleware.requireAuth, orderDetailController.buildRoutes());
app.use("/registration", middleware_1.AuthMiddleware.requireAuth, registrationController.buildRoutes());
app.use("/supplier", middleware_1.AuthMiddleware.requireAuth, supplierController.buildRoutes());
database_config_1.default.sync({ force: false, alter: false }).then(() => {
    app.listen(Number(process.env.PORT), () => {
        console.log("Server running on port 3001!");
    });
}).catch((error) => {
    console.error("Database sync error:", error);
});
