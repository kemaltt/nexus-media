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
exports.SocialAccountController = void 0;
const common_1 = require("@nestjs/common");
const social_account_service_1 = require("./social-account.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let SocialAccountController = class SocialAccountController {
    socialAccountService;
    constructor(socialAccountService) {
        this.socialAccountService = socialAccountService;
    }
    async addAccount(req, body) {
        return this.socialAccountService.addAccount(req.user.id, body);
    }
    async getAccounts(req) {
        return this.socialAccountService.getAccounts(req.user.id);
    }
    async removeAccount(req, id) {
        return this.socialAccountService.removeAccount(req.user.id, id);
    }
};
exports.SocialAccountController = SocialAccountController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SocialAccountController.prototype, "addAccount", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocialAccountController.prototype, "getAccounts", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SocialAccountController.prototype, "removeAccount", null);
exports.SocialAccountController = SocialAccountController = __decorate([
    (0, common_1.Controller)('social-accounts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [social_account_service_1.SocialAccountService])
], SocialAccountController);
//# sourceMappingURL=social-account.controller.js.map