import { IUser } from '@/domain/entities/user';
import { IUserService } from '@/services/UserService';

export default class GetUsersUseCase {
    private userService: IUserService;
    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async all(): Promise<IUser[]> {
        return this.userService.findAll();
    }

    async byId(id: number): Promise<IUser | undefined> {
        return this.userService.findById(id);
    }

    async byEmail(email: string): Promise<IUser | undefined> {
        return this.userService.findByEmail(email);
    }
}
