// DB
import db from '@/infrastructure/database/DatabaseFactory';

// Repository
import UserRepository from '@/repositories/UserRepository';

// Service
import UserService from '@/services/UserService';

import GetUserDifyAgentUseCase from './GetUserDifyAgentUseCase';
import CreateUserUseCase from './CreateUserUseCase';
import GetUsersUseCase from './GetUsersUseCase';
import UpdateUserUseCase from './UpdateUserUseCase';
import DeleteUserUseCase from './DeleteUserUseCase';

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);

const createUserUseCase = new CreateUserUseCase(userService);
const getUsersUseCase = new GetUsersUseCase(userService);
const getUserDifyAgentUseCase = new GetUserDifyAgentUseCase(userService);
const updateUserUseCase = new UpdateUserUseCase(userService);
const deleteUserUseCase = new DeleteUserUseCase(userService);

export {
    getUsersUseCase,
    createUserUseCase,
    getUserDifyAgentUseCase,
    updateUserUseCase,
    deleteUserUseCase,
};
