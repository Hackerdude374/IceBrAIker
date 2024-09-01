"use strict";
// src/config/passport.ts
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
const passport_1 = __importDefault(require("passport"));
const passport_linkedin_oauth2_1 = require("passport-linkedin-oauth2");
const client_1 = require("@prisma/client");
const linkedin_1 = require("./linkedin");
const profileGenerationService_1 = require("../services/profileGenerationService");
const prisma = new client_1.PrismaClient();
passport_1.default.use(new passport_linkedin_oauth2_1.Strategy({
    clientID: linkedin_1.linkedinConfig.clientID,
    clientSecret: linkedin_1.linkedinConfig.clientSecret,
    callbackURL: linkedin_1.linkedinConfig.callbackURL,
    scope: linkedin_1.linkedinConfig.scope
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield prisma.user.findUnique({ where: { linkedinId: profile.id } });
        if (!user) {
            user = yield prisma.user.create({
                data: {
                    linkedinId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    linkedinUrl: profile._json.publicProfileUrl,
                    profilePictureUrl: profile.photos[0].value,
                    accessToken,
                    refreshToken
                }
            });
            // Scrape LinkedIn profile and generate user profile data
            const linkedinData = yield (0, profileGenerationService_1.scrapeLinkedInProfile)(profile._json.publicProfileUrl);
            yield (0, profileGenerationService_1.generateUserProfile)(user.id, linkedinData);
        }
        else {
            // Update existing user data
            yield prisma.user.update({
                where: { id: user.id },
                data: { accessToken, refreshToken }
            });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
exports.default = passport_1.default;
