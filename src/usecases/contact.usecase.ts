import { Contact, ContactCreate, ContactRepository } from "../interfaces/contact.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactRepositoryPrisma } from "../repositories/contact.repository";
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

    async listAllContacts(userEmail: string) {
        const user = await this.userRepository.findByEmail(userEmail)

        if(!user) {
            throw new Error('User not found')
        }

        const contacts = await this.contactRepository.findAllContacts(user.id)

        return contacts
    }

    async updateContact({id, name, email, phone}: Contact) {
        const data = await this.contactRepository.updateContact({ id, name, email, phone })

        return data
    }

    async deleteContact(id: string) {
        const data = await this.contactRepository.deleteContact(id)

        return data
    }
}

export { ContactUseCase }