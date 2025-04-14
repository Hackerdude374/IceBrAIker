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
exports.analyzeProfiles = void 0;
// src/utils/aiMatchingAnalysis.ts
const inference_1 = require("@huggingface/inference");
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
const analyzeProfiles = (userProfile, favorites) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    for (const favorite of favorites) {
        const favoriteData = JSON.parse(favorite.profileData);
        const similarity = yield hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: [userProfile.summary, favoriteData.summary],
        });
        results.push({
            favoriteId: favorite.id,
            similarity: similarity[0][1],
            profileData: favoriteData,
        });
    }
    return results.sort((a, b) => b.similarity - a.similarity);
});
exports.analyzeProfiles = analyzeProfiles;
