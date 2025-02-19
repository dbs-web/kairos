import { IUserService } from '@/services/UserService';

export default class DeleteUserUseCase {
    private userService: IUserService;
    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async execute({ id }: { id: number }) {
        return this.userService.delete({ id });
    }
}
