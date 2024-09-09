import { ContactCreate, ContactRepository } from "../interfaces/contact.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactRepositoryPrisma } from "../repositories/contacts.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class ContactUseCase {
    private contactRepository: ContactRepository
    private userRepository: UserRepository
    constructor() {
        this.contactRepository = new ContactRepositoryPrisma()
        this.userRepository = new UserRepositoryPrisma()
    }

    async create({ email, name, phone, userEmail }: ContactCreate) {
        // email do usuário logado
        // buscar o usuário pelo email
        // se nao existir, retornar erro
        // se existir, criar o contato 
        // antes de criar o contato, validar se ele já existe pelo telefone ou email
        const user = await this.userRepository.findByEmail(userEmail)
        if(!user) {
            throw new Error('User not found')
        }
        const verifyIfContactExists = await this.contactRepository.findByEmailOrPhone(email, phone)
        if(verifyIfContactExists) {
            throw new Error('Contact already exists')
        }
        const contact = this.contactRepository.create({
            name, 
            email,
            phone, 
            userId: user.id
        })

        return contact
    }
}

export { ContactUseCase }