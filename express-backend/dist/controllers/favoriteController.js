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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.removeFavorite = exports.addFavorite = void 0;
const server_1 = require("../server");
const pythonInterface_1 = require("../utils/pythonInterface");
const addFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { linkedinUrl } = req.body;
        // Analyze the LinkedIn profile
        const profileData = yield (0, pythonInterface_1.analyzeProfile)(linkedinUrl);
        const favorite = yield server_1.prisma.favorite.create({
            data: {
                userId,
                linkedinUrl,
                profileData: JSON.stringify(profileData),
            },
        });
        res.status(201).json(favorite);
    }
    catch (error) {
        res.status(500).json({ error: 'Error adding favorite' });
    }
});
exports.addFavorite = addFavorite;
const removeFavorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params;
        yield server_1.prisma.favorite.deleteMany({
            where: {
                id: parseInt(id),
                userId,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error removing favorite' });
    }
});
exports.removeFavorite = removeFavorite;
const getFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const favorites = yield server_1.prisma.favorite.findMany({
            where: { userId },
        });
        res.json(favorites);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching favorites' });
    }
});
exports.getFavorites = getFavorites;
