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
exports.analyzeProfile = analyzeProfile;
exports.favoriteProfile = favoriteProfile;
exports.getFavorites = getFavorites;
const server_1 = require("../server");
const pythonInterface_1 = require("../utils/pythonInterface");
function analyzeProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { linkedinUrl } = req.body;
            const analysis = yield (0, pythonInterface_1.analyzeProfile)(linkedinUrl);
            res.json(analysis);
        }
        catch (error) {
            res.status(500).json({ error: 'Error analyzing profile' });
        }
    });
}
function favoriteProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { linkedinUrl } = req.body;
            const favorite = yield server_1.prisma.favorite.create({
                data: {
                    userId: req.userId,
                    linkedinUrl,
                },
            });
            res.json(favorite);
        }
        catch (error) {
            res.status(500).json({ error: 'Error favoriting profile' });
        }
    });
}
function getFavorites(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const favorites = yield server_1.prisma.favorite.findMany({
                where: { userId: req.userId },
            });
            res.json(favorites);
        }
        catch (error) {
            res.status(500).json({ error: 'Error fetching favorites' });
        }
    });
}
