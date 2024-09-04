import axios from "axios";
import { nanoid } from 'nanoid';
import UrlRepository from "../repository/url.repository";
import { Url } from "../entity/Urls";
//TODO: Adicionar countador de clicks
export default class UrlShortnerService {
    constructor(private readonly urlRepository: UrlRepository){}
    private generateHashUrl() {
        const hash = nanoid(6);
        return hash;
    }
    
    async createShortUrl(longUrl: string, host: string) {
        const existingUrl = await axios.get(longUrl);

        if (existingUrl.status < 400) {
            const hash = this.generateHashUrl();
            const shortenedUrl = `${host}/${hash}`;
            const newUrl = await this.urlRepository.create({longUrl: longUrl, hash:hash, shortenedUrl: shortenedUrl});
            if(!!newUrl){
                return newUrl.shortenedUrl;
            }
            throw new Error('Failed to create short URL');
        }
        throw new Error('Failed to fetch long URL');
    }

    async findById(id: number): Promise<Url> {
        const url = await this.urlRepository.findById(id);
        if (!url) {
            throw new Error('Short URL not found');
        }
        return url;
    }

    async findByUserId(userId: number): Promise<Url[]> {
        const urls = await this.urlRepository.findByUserId(userId);
        if (!urls) {
            throw new Error('No short URLs found for this user');
        }
        return urls;
    }
    async update(id: number, longUrl: string) : Promise<string> {
        
        const url = await this.urlRepository.update(id, longUrl);       
        if(url.affected === 0){
            console.log(url);
            
            throw new Error('Failed to update short URL');
        }
        const shortUrl = await this.urlRepository.findById(id);
        if(!!shortUrl){
          return shortUrl.shortenedUrl;
        }
        throw new Error('Failed to find updated short URL');
    }
    async delete(id: number): Promise<string> {
        const urlDeleted = await this.urlRepository.delete(id);
        if(urlDeleted.affected === 0){
            throw new Error('Failed to delete short URL');
        }
        return "Deleted successfully"
    }
    async redirectToLongUrl(hash: string) {
        const url = await this.urlRepository.findByHash(hash);

        if (!url) {
            throw new Error('Short URL not found');
        }
        return url.longUrl;
    }
}