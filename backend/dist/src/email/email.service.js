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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = class EmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: this.configService.get('EMAIL_SECURE') === 'true',
            auth: {
                user: this.configService.get('SMTP_EMAIL'),
                pass: this.configService.get('SMTP_PASSWORD'),
            },
        });
    }
    getHtmlTemplate(title, subtitle, code, footerText) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 40px 20px;
              background-color: #f8f9fa;
            }
            .card {
              background-color: #ffffff;
              padding: 40px;
              border-radius: 24px;
              box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
              text-align: center;
            }
            .logo {
              font-size: 28px;
              font-weight: 800;
              color: #7F3DFF;
              margin-bottom: 32px;
              letter-spacing: -1px;
            }
            .title {
              font-size: 24px;
              font-weight: 700;
              color: #171021;
              margin-bottom: 16px;
            }
            .subtitle {
              font-size: 16px;
              color: #6B7280;
              line-height: 1.5;
              margin-bottom: 32px;
            }
            .code-box {
              background-color: #f3f0ff;
              border: 2px dashed #7F3DFF;
              padding: 24px;
              text-align: center;
              font-size: 36px;
              font-weight: 800;
              letter-spacing: 8px;
              color: #7F3DFF;
              margin: 24px 0;
              border-radius: 16px;
            }
            .info {
              font-size: 14px;
              color: #9CA3AF;
              margin-top: 32px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #9CA3AF;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">
                <img src="cid:logo" alt="NEXUS Logo" style="width: 80px; height: 80px; border-radius: 16px; margin-bottom: 24px;" />
              </div>
              <h1 class="title">${title}</h1>
              <p class="subtitle">${subtitle}</p>
              <div class="code-box">${code}</div>
              <p class="info">${footerText}</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} NEXUS Team. Alle Rechte vorbehalten.
            </div>
          </div>
        </body>
      </html>
    `;
    }
    async sendVerificationEmail(to, code) {
        const from = this.configService.get('EMAIL_FROM');
        const title = 'Willkommen bei NEXUS!';
        const subtitle = 'Vielen Dank für Ihre Anmeldung. Bitte verwenden Sie den folgenden 6-stelligen Code, um Ihre Registrierung abzuschließen:';
        const footerText = 'Dieser Code ist <b>10 Minuten</b> lang gültig. Wenn Sie dieses Konto nicht erstellt haben, ignorieren Sie bitte diese E-Mail.';
        const mailOptions = {
            from,
            to,
            subject: 'NEXUS - Bestätigungscode',
            html: this.getHtmlTemplate(title, subtitle, code, footerText),
            attachments: [
                {
                    filename: 'logo.png',
                    path: '/Users/kemalnew/project/GitHub/nexus-media/mobile/assets/images/icon.png',
                    cid: 'logo',
                },
            ],
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${to}`);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
    async sendPasswordResetEmail(to, code) {
        const from = this.configService.get('EMAIL_FROM');
        const title = 'Passwort zurücksetzen';
        const subtitle = 'Sie haben eine Anforderung zum Zurücksetzen Ihres Passworts erhalten. Bitte verwenden Sie den folgenden Code:';
        const footerText = 'Dieser Code ist <b>10 Minuten</b> lang gültig. Wenn Sie keine Passwortzurücksetzung angefordert haben, ignorieren Sie bitte diese E-Mail.';
        const mailOptions = {
            from,
            to,
            subject: 'NEXUS - Passwort zurücksetzen',
            html: this.getHtmlTemplate(title, subtitle, code, footerText),
            attachments: [
                {
                    filename: 'logo.png',
                    path: '/Users/kemalnew/project/GitHub/nexus-media/mobile/assets/images/icon.png',
                    cid: 'logo',
                },
            ],
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${to}`);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
    async sendPasswordChangeEmail(to, code) {
        const from = this.configService.get('EMAIL_FROM');
        const title = 'Passwortänderung';
        const subtitle = 'Sie möchten Ihr Passwort ändern. Bitte verwenden Sie den folgenden Bestätigungscode:';
        const footerText = 'Dieser Code ist <b>10 Minuten</b> lang gültig. Wenn Sie keine Passwortänderung angefordert haben, ignorieren Sie bitte diese E-Mail.';
        const mailOptions = {
            from,
            to,
            subject: 'NEXUS - Bestätigungscode zur Passwortänderung',
            html: this.getHtmlTemplate(title, subtitle, code, footerText),
            attachments: [
                {
                    filename: 'logo.png',
                    path: '/Users/kemalnew/project/GitHub/nexus-media/mobile/assets/images/icon.png',
                    cid: 'logo',
                },
            ],
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password change code email sent to ${to}`);
        }
        catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map