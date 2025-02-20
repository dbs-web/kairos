import { FindPaginatedArgs } from '@/repositories/Repository';
import { IUser } from '@/domain/entities/user';
import { IUserRepository } from '@/repositories/UserRepository';
import { FindPaginatedServiceArgs, IPaginatedDataService } from './PaginatedDataService';

interface UpdateUserArgs {
    id: number;
    data: Partial<IUser>;
}

interface DeleteUserArgs {
    id: number;
}

export interface IUserService extends IPaginatedDataService<IUser> {
    findAll(): Promise<IUser[]>;
    findById(id: number): Promise<IUser | undefined>;
    findByEmail(email: string): Promise<IUser | undefined>;
    create(suggestionData: Omit<IUser, 'id'>): Promise<IUser | undefined>;
    update(args: UpdateUserArgs): Promise<IUser | undefined>;
    delete(args: DeleteUserArgs): Promise<IUser | undefined>;
}

export default class UserService implements IUserService {
    private repository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.repository = userRepository;
    }

    async findAll(): Promise<IUser[]> {
        return await this.repository.find({ criteria: {} });
    }

    async findById(id: number): Promise<IUser | undefined> {
        return await this.repository.findUnique({
            criteria: {
                id,
            },
        });
    }

    async findByEmail(email: string): Promise<IUser | undefined> {
        return await this.repository.findUnique({ criteria: { email } });
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

    async create(suggestionData: Omit<IUser, 'id'>): Promise<IUser | undefined> {
        return this.repository.create(suggestionData);
    }

    async update({ id, data }: UpdateUserArgs): Promise<IUser | undefined> {
        return this.repository.update({
            criteria: { id },
            data,
        });
    }

    async delete({ id }: DeleteUserArgs): Promise<IUser | undefined> {
        return this.repository.delete({
            criteria: { id },
        });
    }
}
