import axios from "axios";
import { nanoid } from "nanoid";
import UrlRepository from "../repository/url.repository";
import { Url } from "../entity/Urls";
import { UrlShortenerDTO } from "../dto/ulrShortener.dto";
import { CreateShortUrlDTO } from "../dto/createShortUrl.dto";
//TODO: Adicionar countador de clicks
export default class UrlShortnerService {
  constructor(private readonly urlRepository: UrlRepository) {}
  private generateHashUrl() {
    const hash = nanoid(6);
    return hash;
  }

  async createShortUrl({ longUrl, host, userId }: CreateShortUrlDTO) {
    const existingUrl = await axios.get(longUrl);

    if (existingUrl.status < 400) {
      const body: UrlShortenerDTO = {
        longUrl: longUrl,
        hash: "",
        shortenedUrl: "",
      };
      body.hash = this.generateHashUrl();
      body.shortenedUrl = `${host}/${body.hash}`;
      if (userId) {
        body.userId = userId;
      }
      const newUrl = await this.urlRepository.create(body);
      if (!!newUrl) {
        return newUrl.shortenedUrl;
      }
      throw new Error("Failed to create short URL");
    }
    throw new Error("Failed to fetch long URL");
  }

  async findById(id: number, userId: number): Promise<Url> {
    const url = await this.urlRepository.findById(id, userId);
    if (!url) {
      throw new Error("Short URL not found");
    }
    return url;
  }

  async findByUserId(userId: number): Promise<Url[]> {
    const urls = await this.urlRepository.findByUserId(userId);
    if (!urls) {
      throw new Error("No short URLs found for this user");
    }
    return urls;
  }
  async update(id: number, userId: number, longUrl: string): Promise<string> {
    const url = await this.urlRepository.update(id, userId, longUrl);
    if (url.affected === 0) {
      console.log(url);

      throw new Error("Failed to update short URL");
    }
    const shortUrl = await this.urlRepository.findById(id, userId);
    if (!!shortUrl) {
      return shortUrl.shortenedUrl;
    }
    throw new Error("Failed to find updated short URL");
  }
  async delete(id: number, userId: number): Promise<string> {
    const urlDeleted = await this.urlRepository.delete(id, userId);
    if (urlDeleted.affected === 0) {
      throw new Error("Failed to delete short URL");
    }
    return "Deleted successfully";
  }
  async redirectToLongUrl(hash: string) {
    const url = await this.urlRepository.findByHash(hash);

    if (!url) {
      throw new Error("Short URL not found");
    }
    return url.longUrl;
  }
}
