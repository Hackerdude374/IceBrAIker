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
exports.findMatches = findMatches;
const server_1 = require("../server");
const aiMatchingAnalysis_1 = require("../utils/aiMatchingAnalysis");
function findMatches(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfile = yield server_1.prisma.userProfile.findUnique({
                where: { userId: req.userId },
                include: { user: true },
            });
            if (!userProfile) {
                return res.status(404).json({ error: 'User profile not found' });
            }
            const favorites = yield server_1.prisma.favorite.findMany({
                where: { userId: req.userId },
                include: { user: true },
            });
            const matches = yield (0, aiMatchingAnalysis_1.analyzeProfiles)(userProfile, favorites);
            res.json(matches);
        }
        catch (error) {
            console.error('Error finding matches:', error);
            res.status(500).json({ error: 'Error finding matches' });
        }
    });
}
