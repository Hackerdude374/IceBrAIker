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
function findMatches(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfile = yield server_1.prisma.userProfile.findUnique({
                where: { userId: req.userId },
            });
            if (!userProfile) {
                return res.status(404).json({ error: 'User profile not found' });
            }
            const matches = yield server_1.prisma.userProfile.findMany({
                where: {
                    userId: { not: req.userId },
                    skills: { hasSome: userProfile.skills },
                    interests: { hasSome: userProfile.interests },
                },
            });
            res.json(matches);
        }
        catch (error) {
            res.status(500).json({ error: 'Error finding matches' });
        }
    });
}
