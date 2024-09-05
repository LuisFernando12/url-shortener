import { IsNull, Repository } from "typeorm";
import { Url } from "../entity/Urls";
import { UrlShortenerDTO } from "../dto/ulrShortener.dto";

export default class UrlRepository {
  constructor(private repository: Repository<Url>) {}

  async create(body: UrlShortenerDTO): Promise<Url> {
    return await this.repository.save(body);
  }
  async findById(id: number, userId: number): Promise<Url> {
    return await this.repository.findOneBy( { user: {id: userId}, id: id});
  }
  async findByUserId(userId: number): Promise<Url[]> {
    return await this.repository.findBy({ user: { id: userId}, deletedAt: IsNull() });
  }

  async findByHash(hash: string): Promise<Url> {
    return await this.repository.findOne({ where: { hash: hash, deletedAt: IsNull() } });
  }

  async update(id: number, userId: number , longUrl: string): Promise<any> {  
    return await this.repository.update( {id, user: {id: userId}, deletedAt: IsNull()}  ,{ longUrl: longUrl });
  }

  async delete(id: number, userId: number): Promise<any> {  
    return await this.repository.update( {id, user: { id: userId}, deletedAt: IsNull()}, { deletedAt: new Date() });
  }
}
