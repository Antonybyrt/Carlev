import express from 'express';
import cors from 'cors';
import sequelize from './config/database.config';
import { AuthMiddleware } from './middleware';

import { AuthController } from './controllers';
import { UserController } from './controllers';
import { CarBrandController } from './controllers';
import { CarModelController } from './controllers';
import { CustomerController } from './controllers';
import { ItemController } from './controllers';
import { LoginController } from './controllers';
import { OrderController } from './controllers';
import { OrderDetailController } from './controllers';
import { RegistrationController } from './controllers';
import { SupplierController } from './controllers';

const app = express();

app.use(express.json());
app.use(cors());

const authController = new AuthController();
const userController = new UserController();
const carBrandController = new CarBrandController();
const carModelController = new CarModelController();
const customerController = new CustomerController();
const itemController = new ItemController();
const loginController = new LoginController();
const orderController = new OrderController();
const orderDetailController = new OrderDetailController();
const registrationController = new RegistrationController();
const supplierController = new SupplierController();

app.use("/auth", authController.buildRoutes());

app.use("/user", userController.buildRoutes());
app.use("/car_brand", AuthMiddleware.requireAuth, carBrandController.buildRoutes());
app.use("/car_model", AuthMiddleware.requireAuth, carModelController.buildRoutes());
app.use("/customer", AuthMiddleware.requireAuth, customerController.buildRoutes());
app.use("/item", AuthMiddleware.requireAuth, itemController.buildRoutes());
app.use("/login", AuthMiddleware.requireAuth, loginController.buildRoutes());
app.use("/orders", AuthMiddleware.requireAuth, orderController.buildRoutes());
app.use("/order_detail", AuthMiddleware.requireAuth, orderDetailController.buildRoutes());
app.use("/registration", AuthMiddleware.requireAuth, registrationController.buildRoutes());
app.use("/supplier", AuthMiddleware.requireAuth, supplierController.buildRoutes());

sequelize.sync({ force: false, alter: false }).then(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données établie avec succès.');
        
        app.listen(Number(process.env.PORT), () => {
            console.log(`Server running on port ${process.env.PORT || 3001}!`);
        });
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    }
}).catch((error: unknown) => {
    console.error("Database sync error:", error);
    process.exit(1);
});