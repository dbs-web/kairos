import { FindPaginatedArgs } from '@/repositories/Repository';
import { IUser, UserRoles } from '@/domain/entities/user';
import { IUserRepository } from '@/repositories/UserRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';
import { ServiceError } from '@/shared/errors';

interface UpdateUserArgs {
    id: number;
    data: Partial<IUser>;
}

interface DeleteUserArgs {
    id: number;
}

export interface IUserService extends IPaginatedDataService<IUser> {
    findAll(): Promise<IUser[]>;
    findById(id: number): Promise<IUser>;
    findByEmail(email: string): Promise<IUser>;
    findManyByRole(role: UserRoles): Promise<IUser[]>
    create(suggestionData: Omit<IUser, 'id'>): Promise<IUser>;
    update(args: UpdateUserArgs): Promise<IUser>;
    delete(args: DeleteUserArgs): Promise<IUser>;
}

export default class UserService implements IUserService {
    private repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async findAll(): Promise<IUser[]> {
        return await this.repository.find({ criteria: {} });
    }

    async findById(id: number): Promise<IUser> {
        const user = await this.repository.findUnique({
            criteria: {
                id,
            },
        });

        if (!user) {
            throw new ServiceError('User with the provided id was not found');
        }

        return user;
    }

    async findManyByRole(role: UserRoles): Promise<IUser[]> {
        const users = await this.repository.find({
            criteria: {role}
        })

        return users
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this.repository.findUnique({ criteria: { email } });

        if (!user) {
            throw new ServiceError('User with the provided id was not found');
        }

        return user;
    }

    async findWithQueryAndPagination({
        userId,
        statuses,
        query,
        skip,
        take,
        orderBy,
    }: FindPaginatedServiceArgs): Promise<[IUser[], number]> {
        const criteria = {
            userId,
            status: {
                in: statuses,
            },
            title: {
                contains: query,
            },
        };

        return Promise.all([
            this.repository.find({ criteria, skip, take, orderBy }),
            this.repository.count({ criteria }),
        ]);
    }

    async create(suggestionData: Omit<IUser, 'id'>): Promise<IUser> {
        return this.repository.create(suggestionData);
    }

    async update({ id, data }: UpdateUserArgs): Promise<IUser> {
        const user = await this.repository.update({
            criteria: { id },
            data,
        });

        if (!user) {
            throw new ServiceError('User with the provided id was not found');
        }

        return user;
    }

    async delete({ id }: DeleteUserArgs): Promise<IUser> {
        const user = await this.repository.delete({
            criteria: { id },
        });

        if (!user) {
            throw new ServiceError('User with the provided id was not found');
        }

        return user;
    }
}
