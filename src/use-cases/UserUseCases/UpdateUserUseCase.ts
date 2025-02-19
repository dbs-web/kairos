import { IUser } from '@/domain/entities/user';
import { IUserService } from '@/services/UserService';

export default class UpdateUserUseCase {
    private userService: IUserService;
    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async execute({ id, data }: { id: number; data: Partial<IUser> }) {
        return this.userService.update({ id, data });
    }
}
