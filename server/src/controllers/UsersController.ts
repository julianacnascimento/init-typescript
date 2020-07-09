import { Request, Response } from 'express';
import knex from '../database/connection';
import bcrypt from 'bcrypt';

class UsersController {

    async create(request: Request, response: Response) {
        const {
            name,
            username,
            email,
            password
        } = request.body;

        await bcrypt.hash(password, 12).then((result) => {
            knex('users').insert({
                name,
                username,
                email,
                password: result
            }).then(() => {
                response.json({
                    message: 'user added'
                })
            });
        });
    };

    async index(request: Request, response: Response) {
        const user = await knex('users').select('*');

        if (user.length == 0) {
            return response.json({ message: 'user not found' })
        } else {
            const serializedUsers = user.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    password: user.password
                };
            });
            return response.json(serializedUsers);
        }
    };

    async update(request:Request, response: Response){
        const {
            name,
            username,
            email,
            password
        } = request.body;

        const { id } = request.params;

        const user = await knex('users').select('*').where('id', id);

        if(!user) {
            return response.json({ message: 'user not found' })
        }else{
            const userModified = await bcrypt.hash(password, 12).then((result)=>{
                knex('users').select('*').where('id', id).update({
                    name, 
                    username, 
                    email, 
                    password: result
                }).then((user) => {
                    response.json({ message: 'user data changed' });
                });
            }) 
        }
        

    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;

        const user = await knex('users').where('id', id).del();

        if (!user) {
            return response.json({ message: 'user not found' })
        }
        await knex('users').select('*').where('id', id).del();
        return response.json({ message: 'user deleted' });
    }
}



export default UsersController;