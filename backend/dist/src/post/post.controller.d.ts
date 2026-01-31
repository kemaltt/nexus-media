import { PostService } from './post.service';
export declare class PostController {
    private postService;
    constructor(postService: PostService);
    createPost(req: any, body: any): Promise<any>;
    getHistory(req: any): Promise<any>;
}
