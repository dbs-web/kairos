import IUserService from '@/services/UserService';

export default class GetUserDifyAgentUseCase {
    private userService: IUserService;

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    async execute({ userId }: { userId: number }): Promise<string> {
        const user = await this.userService.findById(userId);

        if (!user || !user.difyAgent) {
            throw new Error('User not found or difyAgent not set.');
        }

        return user.difyAgent;
    }
}
