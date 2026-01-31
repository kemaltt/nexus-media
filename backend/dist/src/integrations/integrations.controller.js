"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const youtube_service_1 = require("./youtube/youtube.service");
const meta_service_1 = require("./meta/meta.service");
const tiktok_service_1 = require("./tiktok/tiktok.service");
const x_service_1 = require("./x/x.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let IntegrationsController = class IntegrationsController {
    youtubeService;
    metaService;
    tiktokService;
    xService;
    constructor(youtubeService, metaService, tiktokService, xService) {
        this.youtubeService = youtubeService;
        this.metaService = metaService;
        this.tiktokService = tiktokService;
        this.xService = xService;
    }
    async youtubeAuth(req) {
        return { url: this.youtubeService.getAuthUrl(req.user.id) };
    }
    async youtubeCallback(code, userId, res) {
        if (!code || !userId) {
            return res.redirect('/error?message=missing_data');
        }
        await this.youtubeService.handleCallback(code, userId);
        return res.send(`
      <html>
        <body>
          <h2>YouTube Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
    }
    async metaAuth(req) {
        return { url: this.metaService.getAuthUrl(req.user.id) };
    }
    async metaCallback(code, userId, res) {
        if (!code || !userId) {
            return res.redirect('/error?message=missing_data');
        }
        await this.metaService.handleCallback(code, userId);
        return res.send(`
      <html>
        <body>
          <h2>Facebook/Instagram Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
    }
    async tiktokAuth(req) {
        return { url: this.tiktokService.getAuthUrl(req.user.id) };
    }
    async tiktokCallback(code, userId, res) {
        if (!code || !userId) {
            return res.redirect('/error?message=missing_data');
        }
        await this.tiktokService.handleCallback(code, userId);
        return res.send(`
      <html>
        <body>
          <h2>TikTok Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
    }
    async xAuth(req) {
        return { url: this.xService.getAuthUrl(req.user.id) };
    }
    async xCallback(code, state, res) {
        if (!code || !state) {
            return res.redirect('/error?message=missing_data');
        }
        await this.xService.handleCallback(code, state);
        return res.send(`
      <html>
        <body>
          <h2>X (Twitter) Connected Successfully!</h2>
          <p>You can close this window now.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Get)('youtube/auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "youtubeAuth", null);
__decorate([
    (0, common_1.Get)('youtube/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "youtubeCallback", null);
__decorate([
    (0, common_1.Get)('meta/auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "metaAuth", null);
__decorate([
    (0, common_1.Get)('meta/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "metaCallback", null);
__decorate([
    (0, common_1.Get)('tiktok/auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "tiktokAuth", null);
__decorate([
    (0, common_1.Get)('tiktok/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "tiktokCallback", null);
__decorate([
    (0, common_1.Get)('x/auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "xAuth", null);
__decorate([
    (0, common_1.Get)('x/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], IntegrationsController.prototype, "xCallback", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [youtube_service_1.YoutubeService,
        meta_service_1.MetaService,
        tiktok_service_1.TiktokService,
        x_service_1.XService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map