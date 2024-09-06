import axios from "axios";
import { nanoid } from "nanoid";
import UrlRepository from "../repository/url.repository";
import { Url } from "../entity/Urls";
import { UrlShortenerDTO } from "../dto/ulrShortener.dto";
import { CreateShortUrlDTO } from "../dto/createShortUrl.dto";
import { logger } from "../util/logger";
export default class UrlShortnerService {
  constructor(private readonly urlRepository: UrlRepository) {
    logger.info("UrlShortnerService started");
  }
  private generateHashUrl() {
    logger.info("GenerateHashUrl called")
    const hash = nanoid(6);
    logger.info("Return hash")
    return hash;
  }

  async createShortUrl({ longUrl, host, userId }: CreateShortUrlDTO) {
    logger.info("CreateShortUrl called");
    logger.info("Check if url exists")
    const existingUrl = await axios.get(longUrl);
    if (existingUrl.status < 400) {
      const body: UrlShortenerDTO = {
        longUrl: longUrl,
        hash: "",
        shortenedUrl: "",
      };
      logger.info("CreateShortUrl: call generateHashUrl");
      body.hash = this.generateHashUrl();
      body.shortenedUrl = `${host}/${body.hash}`;
      if (userId) {
        logger.info("User authenticated defining body.userId");
        body.userId = userId;
      }
      logger.info("CreateShortUrl: call urlRepository.create");
      const newUrl = await this.urlRepository.create(body);
      if (!!newUrl) {
        logger.info("Successfully return")
        return newUrl.shortenedUrl;
      }
      logger.error("Error: Failed to create short URL")
      throw new Error("Failed to create short URL");
    }
    logger.error("Error: Long url not exist")
    throw new Error("Failed to fetch long URL");
  }

  async findById(id: number, userId: number): Promise<Url> {
    logger.info("FindById called")
    logger.info("FindById: call urlRepository.findById");
    const url = await this.urlRepository.findById(id, userId);
    if (!url) {
      logger.error("Error: Short URL not found");
      throw new Error("Short URL not found");
    }
    logger.info("Successfully return url founded")
    return url;
  }

  async findByUserId(userId: number): Promise<Url[]> {
    logger.info("FindByUserId called")
    logger.info("FindByUserId: call urlRepository.findByUserId")
    const urls = await this.urlRepository.findByUserId(userId);
    logger.info(`Return ${urls.length} urls`);
    return urls;
  }
  async update(id: number, userId: number, longUrl: string): Promise<string> {
    logger.info("Update called");
    logger.info("Update: call urlRepository.update");
    const url = await this.urlRepository.update(id, userId, longUrl);
    if (url.affected === 0) {
      logger.error("Error: Failed to update short URL")
      throw new Error("Failed to update short URL");
    }
    logger.info("Update: call urlRepository.findById");
    const shortUrl = await this.urlRepository.findById(id, userId);
    if (!!shortUrl) {
      logger.info("Successfully return shortenedUrl");
      return shortUrl.shortenedUrl;
    }
    logger.error("Error: failed to find updated short url")
    throw new Error("Failed to find updated short URL");
  }
  async delete(id: number, userId: number): Promise<void> {
    logger.info("Delete called");
    logger.info("Delete: call urlRepository.delete");
    const urlDeleted = await this.urlRepository.delete(id, userId);
    if (urlDeleted.affected === 0) {
      logger.error("Error: Failed to delete")
      throw new Error("Failed to delete short URL");
    }
    return;
  }
  async redirectToLongUrl(hash: string) {
    logger.info("RedirectToLongUrl called")
    logger.info("RedirectToLongUrl: call urlRepository.findByHash");
    const url = await this.urlRepository.findByHash(hash);
    if (!url) {
      logger.error("Error: Short Url not found");
      throw new Error("Short URL not found");
    }
    logger.info("RedirectToLongUrl: call urlRepository.incrementClicks");
    await this.urlRepository.incrementClicks(url.id);
    logger.info("Return longUrl")
    return url.longUrl;
  }
}
