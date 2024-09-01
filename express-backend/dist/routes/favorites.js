"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/favorites.ts
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authMiddleware, favoriteController_1.addFavorite);
router.delete('/:id', auth_1.authMiddleware, favoriteController_1.removeFavorite);
router.get('/', auth_1.authMiddleware, favoriteController_1.getFavorites);
exports.default = router;
