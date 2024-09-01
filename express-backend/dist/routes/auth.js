"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
    optionsSuccessStatus: 200
};
router.use((0, cors_1.default)(corsOptions));
router.options('*', authController_1.handleOptions);
router.post('/login', authController_1.login);
router.post('/register', authController_1.register);
router.get('/linkedin', passport_1.default.authenticate('linkedin'));
router.get('/linkedin/callback', passport_1.default.authenticate('linkedin', { failureRedirect: '/login' }), authController_1.linkedinCallback);
exports.default = router;
