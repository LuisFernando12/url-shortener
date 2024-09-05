import { jwtDecode } from "jwt-decode";
import UrlShortnerService from "../service/urlShortener.service.js";
import { Request, Response } from "express";
import { CreateShortUrlDTO } from "../dto/createShortUrl.dto.js";
export default class UrlShortnerController {
  constructor(private readonly urlShortenerService: UrlShortnerService) {}
  private JwtDecoded(token: string) {
    const tokenDecoded = jwtDecode(token);
    return tokenDecoded;
  }
  async createShortUrl(req: Request, res: Response): Promise<void> {
    const body: CreateShortUrlDTO = {
      longUrl: "",
      host: "",
    };
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const tokenDecoded = this.JwtDecoded(token);
      body.userId = Number(tokenDecoded.sub);
    }
    try {
      body.longUrl = req.body.longUrl;
      body.host = `${req.protocol}://${req.headers.host}`;
      const result = await this.urlShortenerService.createShortUrl(body);
      res.status(201).json({ shortenedURL: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userId = this.JwtDecoded(token).sub;
      const id = Number(req.params.id);
      const result = await this.urlShortenerService.findById(id, Number(userId));
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async findByUserId(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const userId = Number(req.params.id);
      const result = await this.urlShortenerService.findByUserId(userId);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  async update(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const token = req.headers.authorization.split(" ")[1];
      const userId = this.JwtDecoded(token).sub;
      const id = Number(req.params.id);
      const { longUrl } = req.body;
      if (!longUrl) {
        throw new Error("Long URL is required");
      }
      const result = await this.urlShortenerService.update(id, Number(userId), longUrl);
      res.json({ shortenedURL: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    if (!req.headers.authorization) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        const userId = this.JwtDecoded(token).sub;
      const id = Number(req.params.id);
      const urlDeleted = await this.urlShortenerService.delete(id, Number(userId));
      res.json({ message: urlDeleted });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async redirectToLongUrl(req: Request, res: Response) {
    try {
      const hash = req.params.hash;
      const longUrl = await this.urlShortenerService.redirectToLongUrl(hash);
      res.redirect(longUrl);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}
