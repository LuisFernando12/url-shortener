import { jwtDecode } from "jwt-decode";
import UrlShortnerService from "../service/urlShortener.service.js";
import { Request, Response } from "express";
import { CreateShortUrlDTO } from "../dto/createShortUrl.dto.js";
import TokenService from "../service/token.service.js";
import { logger } from "../util/logger.js";
export default class UrlShortnerController {
  constructor(
    private readonly urlShortenerService: UrlShortnerService,
    private readonly tokenService: TokenService
  ){
    logger.info("UrlShortenerController started");
  }
  async createShortUrl(req: Request, res: Response): Promise<void> {
    logger.info("CreateShortUrl called")
    const body: CreateShortUrlDTO = {
      longUrl: "",
      host: "",
    };
    if (req.headers.authorization) {
      logger.info("Verify Authorization")
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      logger.info("User authenticated")
      body.userId = Number(tokenDecoded.sub);
    }
    try {
      body.longUrl = req.body.longUrl;
      body.host = `${req.protocol}://${req.headers.host}`;
      logger.info(`CreateShortUrl: Call urlShortenerService.createShortUrl`)
      const result = await this.urlShortenerService.createShortUrl(body);
      logger.info("Return shortenedURL")
      res.status(201).json({ shortenedURL: result });
    } catch (error) {
      logger.error(`Error at createShortUrl: ${JSON.stringify(error)}`)
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    logger.info("findById called");
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      const userId = Number(tokenDecoded.sub);
      const id = Number(req.params.id);
      logger.info(`FindById: called urlShortenerService.findById`)
      const result = await this.urlShortenerService.findById(
        id,
        Number(userId)
      );
      logger.info("Successfully found");
      res.json(result);
    } catch (error) {
      logger.error(`Error at findById: ${JSON.stringify(error)}`)
      res.status(404).json({ error: error.message });
    }
  }

  async findByUserId(req: Request, res: Response): Promise<void> {
    logger.info("FindByUserId called: ")
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token")
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      const userId = Number(req.params.id);
      logger.info(`FindByUserId: called urlShortenerService.findByUserId with userId: ${userId}`);
      const result = await this.urlShortenerService.findByUserId(userId);
      logger.info("Return shortner urls by user")
      res.json(result);
    } catch (error) {
      logger.error(`Error at findByUserId: ${JSON.stringify(error)}`)
      res.status(404).json({ error: error.message });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    logger.info("Update called")
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const { longUrl } = req.body;
      if (!longUrl) {
        logger.error("Error: Long URL is required")
        throw new Error("Long URL is required");
      }
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token");
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      const userId = tokenDecoded.sub;
      const id = Number(req.params.id);
      logger.info(`Update: called urlShortenerService.update`)
      const result = await this.urlShortenerService.update(
        id,
        Number(userId),
        longUrl
      );
      logger.info("Return shortenedURL")
      res.json({ shortenedURL: result });
    } catch (error) {
      logger.error(`Error at update: ${JSON.stringify(error)}`);
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    logger.info("Delete called");
    if (!req.headers.authorization) {
      logger.error("Error: Authorization Error");;
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.tokenService.tokenDecode(token);
      const tokenIsValid = await this.tokenService.tokenVerify(token);
      if (!tokenIsValid || !tokenDecoded) {
        logger.error("Error: Invalid Token");
        res.status(401).json({ error: "Invalid Token" });
        return;
      } 
      const userId = tokenDecoded.sub;
      const id = Number(req.params.id);
      logger.info("Delete: call urlShortenerService.delete")
      await this.urlShortenerService.delete(
        id,
        Number(userId)
      );
      logger.info("Successfully deleted")
      res.status(204).json();
    } catch (error) {
      logger.error(`Error at delete: ${JSON.stringify(error)}`);
      res.status(500).json({ error: error.message });
    }
  }
  async redirectToLongUrl(req: Request, res: Response) {
    logger.info("RedirectToLongUrl called");
    try {
      const hash = req.params.hash;
      logger.info("RedirectToLongUrl: call urlShortenerService.redirectToLongUrl");
      const longUrl = await this.urlShortenerService.redirectToLongUrl(hash);
      logger.info(`Redirect to url: ${longUrl}`);
      res.redirect(longUrl);
    } catch (error) {
      logger.error(`Error at redirectToLongUrl: ${JSON.stringify(error)}`)
      res.status(404).json({ error: error.message });
    }
  }
}
