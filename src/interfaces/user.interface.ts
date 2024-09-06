export interface User{
    id: string
    email: string
    name: string
}

export interface UserRepository {
    create(data: User): Promise<User>
}