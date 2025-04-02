"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongodb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongodb = (url) => {
    //?named export
    mongoose_1.default
        .connect(url)
        .then(() => console.log("database connected"))
        .catch((err) => console.log("error", err));
};
exports.connectMongodb = connectMongodb;
