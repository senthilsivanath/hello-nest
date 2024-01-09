export interface CrudRepository<T, ID> {
    save(entity: T) : Promise<T>
    findById(id: ID): Promise<T | undefined>
    deleteById(id: ID): Promise<void>
}
