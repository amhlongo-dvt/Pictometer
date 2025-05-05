  /**
   * Interface for a database resource.
   *
   * @template T - The type of the resource.
   * @template S - The type of the data used to create the resource.
   */
export interface IDatabaseResource<T, S>{
    create(data: S): Promise<T>;
    update(id: string, data: Partial<S>): Promise<T | null>;
    get(id: string): Promise<T | null>;
    find(data: Partial<T>): Promise<T | null>;
    findAll(data: Partial<T>): Promise<T[]>;
    delete(id: string): Promise<T | null>;
}