import UrlShortnerService from "../service/urlShortener.service.js";
import {Request, Response} from 'express'
export default class UrlShortnerController {
    constructor(private readonly urlShortenerService: UrlShortnerService) {}
     async createShortUrl(req: Request, res: Response): Promise<void>{
        try {
            const longUrl = req.body.longUrl;
            const host  = `${req.protocol}://${req.headers.host}`;
            const result = await this.urlShortenerService.createShortUrl(longUrl, host);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async findById(req: Request, res: Response) :Promise<void> {
        try {
            const id = Number(req.params.id);
            const url = await this.urlShortenerService.findById(id);
            res.json(url);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async findByUserId(req: Request, res: Response):Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const urls = await this.urlShortenerService.findByUserId(userId);
            res.json(urls);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
    async update(req: Request, res: Response):Promise<void> {
        try{
            const id = Number(req.params.id);
            const { longUrl } = req.body;
            if(!longUrl){
                throw new Error('Long URL is required');
            }
            const url  = await this.urlShortenerService.update(id, longUrl)
            res.json(url);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async delete (req: Request, res: Response):Promise<void>{        
        try{
            const id = Number(req.params.id);
            const urlDeleted = await this.urlShortenerService.delete(id);
            res.json(urlDeleted)
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async redirectToLongUrl(req: Request, res: Response) {
        try {
            const hash = req.params.hash;
            const longUrl = await this.urlShortenerService.redirectToLongUrl(hash);
            res.redirect(longUrl)
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}