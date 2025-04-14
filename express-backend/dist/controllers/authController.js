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
exports.register = register;
exports.login = login;
exports.linkedinCallback = linkedinCallback;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const profileGenerationService_1 = require("../services/profileGenerationService");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield server_1.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            res.json({ message: 'User created successfully', userId: user.id });
        }
        catch (error) {
            res.status(500).json({ error: 'Error creating user' });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield server_1.prisma.user.findUnique({ where: { email } });
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
            res.json({ token });
        }
        catch (error) {
            res.status(500).json({ error: 'Error logging in' });
        }
    });
}
function linkedinCallback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req;
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        try {
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
            // If it's a new user, generate their profile
            if (user.createdAt === user.updatedAt) {
                const linkedinData = yield (0, profileGenerationService_1.scrapeLinkedInProfile)(user.linkedinUrl);
                yield (0, profileGenerationService_1.generateUserProfile)(user.id, linkedinData);
            }
            res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
        }
        catch (error) {
            console.error('Error in LinkedIn callback:', error);
            res.status(500).json({ error: 'Error processing LinkedIn login' });
        }
    });
}
