"use strict";
// src/utils/profileGenerator.ts
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
exports.generateUserProfile = generateUserProfile;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateUserProfile(userId, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch user data from LinkedIn API
            const { data: userData } = yield axios_1.default.get('https://api.linkedin.com/v2/me', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            // Fetch skills data
            const { data: skillsData } = yield axios_1.default.get('https://api.linkedin.com/v2/skills', {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            // Process and extract relevant information
            const summary = userData.summary || '';
            const skills = skillsData.elements.map((skill) => skill.name);
            const interests = []; // You might need to fetch this from another endpoint or derive it
            // Generate ice breakers (you can implement your own logic here)
            const iceBreakers = generateIceBreakers(userData, skillsData);
            // Create or update UserProfile
            yield prisma.userProfile.upsert({
                where: { userId },
                update: {
                    summary,
                    skills,
                    interests,
                    iceBreakers
                },
                create: {
                    userId,
                    summary,
                    skills,
                    interests,
                    iceBreakers
                }
            });
        }
        catch (error) {
            console.error('Error generating user profile:', error);
            throw error;
        }
    });
}
function generateIceBreakers(userData, skillsData) {
    // Implement your ice breaker generation logic here
    // This is a placeholder implementation
    return [
        `${userData.firstName} has ${skillsData.elements.length} skills listed on LinkedIn.`,
        `${userData.firstName}'s most recent position is ${userData.positions.values[0].title} at ${userData.positions.values[0].company.name}.`,
        `Did you know ${userData.firstName} is skilled in ${skillsData.elements[0].name}?`
    ];
}
