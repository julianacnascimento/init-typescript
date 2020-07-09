import express from 'express';
import UsersController from './controllers/UsersController';

const routes = express.Router();

const userscontroller =  new UsersController();

routes.get('/', (request, response) =>{
    return response.json({
        message: "hello!"
    });
}),

routes.post('/user', userscontroller.create);
routes.get('/user/', userscontroller.index);
routes.put('/user/:id', userscontroller.update);
routes.delete('/user/:id', userscontroller.delete);



export default routes;