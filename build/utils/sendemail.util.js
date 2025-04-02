"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.smtp_server,
    port: Number(process.env.smtp_port),
    secure: process.env.smtp_port === "465",
    auth: {
        user: process.env.smtp_email,
        pass: process.env.smtp_password,
    },
});
const sendEmail = (mailOption) => __awaiter(void 0, void 0, void 0, function* () {
    const mailOptions = {
        from: `"$(process.env.smtp_mail_from)" <$(process.env.smtp_email)`, //?send address
        to: mailOption.to,
        subject: mailOption.subject,
        html: mailOption.html,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendEmail = sendEmail;
