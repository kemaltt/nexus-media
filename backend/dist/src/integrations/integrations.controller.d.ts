import { Response } from 'express';
import { YoutubeService } from './youtube/youtube.service';
import { MetaService } from './meta/meta.service';
import { TiktokService } from './tiktok/tiktok.service';
import { XService } from './x/x.service';
export declare class IntegrationsController {
    private youtubeService;
    private metaService;
    private tiktokService;
    private xService;
    constructor(youtubeService: YoutubeService, metaService: MetaService, tiktokService: TiktokService, xService: XService);
    youtubeAuth(req: any): Promise<{
        url: any;
    }>;
    youtubeCallback(code: string, userId: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    metaAuth(req: any): Promise<{
        url: string;
    }>;
    metaCallback(code: string, userId: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    tiktokAuth(req: any): Promise<{
        url: string;
    }>;
    tiktokCallback(code: string, userId: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
    xAuth(req: any): Promise<{
        url: string;
    }>;
    xCallback(code: string, state: string, res: Response): Promise<void | Response<any, Record<string, any>>>;
}
