import { IUser } from '@/domain/entities/user';
import { IUserService } from '@/services/UserService';

export default class CreateUserUseCase {
    private userService: IUserService;
    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async execute(user: Omit<IUser, 'id'>): Promise<IUser | undefined> {
        return await this.userService.create(user);
    }
}
