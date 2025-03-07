import { IUser, UserRoles } from '@/domain/entities/user';
import { IUserService } from '@/services/UserService';

export default class GetUsersUseCase {
    private userService: IUserService;
    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async all(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    async byId(id: number): Promise<IUser> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async byEmail(email: string): Promise<IUser> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async byRole(role: UserRoles): Promise<IUser[]> {
        return await this.userService.findManyByRole(role);
    }
}
