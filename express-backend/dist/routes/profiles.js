"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/analyze', auth_1.authMiddleware, profileController_1.analyzeProfile);
router.post('/favorite', auth_1.authMiddleware, profileController_1.favoriteProfile);
router.get('/favorites', auth_1.authMiddleware, profileController_1.getFavorites);
exports.default = router;
