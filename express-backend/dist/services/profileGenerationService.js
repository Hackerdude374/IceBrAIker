"use strict";
// src/services/profileGenerationService.ts
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
exports.scrapeLinkedInProfile = scrapeLinkedInProfile;
const inference_1 = require("@huggingface/inference");
const openai_1 = require("langchain/chat_models/openai");
const chains_1 = require("langchain/chains");
const prompts_1 = require("langchain/prompts");
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const prisma = new client_1.PrismaClient();
const hf = new inference_1.HfInference(process.env.HUGGINGFACE_API_KEY);
const llm = new openai_1.ChatOpenAI({ temperature: 0 });
function generateUserProfile(userId, linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const summary = yield generateSummary(linkedinData);
            const facts = yield generateInterestingFacts(linkedinData);
            const iceBreakers = yield generateIceBreakers(linkedinData);
            const interests = yield generateInterests(linkedinData);
            const { personalityTraits, technicalSkills } = yield analyzeTraitsAndSkills(linkedinData);
            yield prisma.userProfile.upsert({
                where: { userId },
                update: {
                    summary,
                    skills: technicalSkills,
                    interests,
                    iceBreakers,
                },
                create: {
                    userId,
                    summary,
                    skills: technicalSkills,
                    interests,
                    iceBreakers,
                },
            });
            return {
                summary,
                facts,
                iceBreakers,
                interests,
                personalityTraits,
                technicalSkills,
            };
        }
        catch (error) {
            console.error('Error generating user profile:', error);
            throw error;
        }
    });
}
function generateSummary(linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = prompts_1.PromptTemplate.fromTemplate("Given the information about a person from LinkedIn {information}, create a comprehensive professional summary in 3-4 sentences. Focus on their current role, key skills, and major achievements.");
        const chain = new chains_1.LLMChain({ llm, prompt });
        const result = yield chain.call({ information: JSON.stringify(linkedinData) });
        return result.text;
    });
}
function generateInterestingFacts(linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = prompts_1.PromptTemplate.fromTemplate("Given the information about a person from LinkedIn {information}, create three interesting and unique facts about their professional life or achievements. These should be specific and noteworthy.");
        const chain = new chains_1.LLMChain({ llm, prompt });
        const result = yield chain.call({ information: JSON.stringify(linkedinData) });
        return result.text.split('\n').filter(Boolean);
    });
}
function generateIceBreakers(linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = prompts_1.PromptTemplate.fromTemplate("Based on the LinkedIn profile information {information}, create 3 engaging ice breakers or conversation starters. These should be questions or statements that could initiate a meaningful professional conversation with this person.");
        const chain = new chains_1.LLMChain({ llm, prompt });
        const result = yield chain.call({ information: JSON.stringify(linkedinData) });
        return result.text.split('\n').filter(Boolean);
    });
}
function generateInterests(linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = prompts_1.PromptTemplate.fromTemplate("Analyze the LinkedIn profile information {information} and identify 5 professional or personal interests this individual might have. Consider their job roles, industries, educational background, and any mentioned hobbies or volunteer work.");
        const chain = new chains_1.LLMChain({ llm, prompt });
        const result = yield chain.call({ information: JSON.stringify(linkedinData) });
        return result.text.split('\n').filter(Boolean);
    });
}
function analyzeTraitsAndSkills(linkedinData) {
    return __awaiter(this, void 0, void 0, function* () {
        const text = `${linkedinData.summary} ${linkedinData.experience.map(exp => exp.description).join(' ')} ${linkedinData.skills.join(' ')}`;
        const emotionResults = yield hf.textClassification({
            model: 'bhadresh-savani/distilbert-base-uncased-emotion',
            inputs: text.substring(0, 500), // Limit text length
        });
        const traits = emotionResults.map(result => result.label);
        const additionalTraits = ["analytical", "detail-oriented", "innovative", "adaptable", "collaborative", "decisive", "proactive", "strategic"];
        const personalityTraits = [...new Set([...traits, ...additionalTraits.slice(0, 4 - traits.length)])].slice(0, 4);
        const technicalSkills = extractSkills(linkedinData);
        return {
            personalityTraits,
            technicalSkills,
        };
    });
}
function extractSkills(linkedinData) {
    const skillKeywords = [
        'Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Analysis',
        'Java', 'C++', 'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum', 'DevOps',
        'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Big Data', 'Spark', 'Hadoop',
        'Tableau', 'Power BI', 'Excel', 'R', 'Statistical Analysis', 'Data Visualization',
        'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Test-Driven Development'
    ];
    const mentionedSkills = new Set();
    // Check skills section
    linkedinData.skills.forEach((skill) => {
        const matchedSkill = skillKeywords.find(keyword => skill.toLowerCase().includes(keyword.toLowerCase()));
        if (matchedSkill)
            mentionedSkills.add(matchedSkill);
    });
    // Check experience descriptions
    linkedinData.experience.forEach((exp) => {
        skillKeywords.forEach(skill => {
            if (exp.description.toLowerCase().includes(skill.toLowerCase())) {
                mentionedSkills.add(skill);
            }
        });
    });
    // If we don't have at least 4 skills, add some based on the profile
    if (mentionedSkills.size < 4) {
        const fullText = JSON.stringify(linkedinData).toLowerCase();
        if (fullText.includes('data') || fullText.includes('analytics')) {
            mentionedSkills.add('Data Analysis');
        }
        if (fullText.includes('software') || fullText.includes('develop')) {
            mentionedSkills.add('Software Development');
        }
        if (fullText.includes('manage') || fullText.includes('lead')) {
            mentionedSkills.add('Project Management');
        }
    }
    return Array.from(mentionedSkills).slice(0, 4);
}
function scrapeLinkedInProfile(linkedinUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`https://nubela.co/proxycurl/api/v2/linkedin`, {
            params: { url: linkedinUrl },
            headers: { 'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}` }
        });
        const data = response.data;
        // Clean and structure the data
        return {
            name: `${data.first_name} ${data.last_name}`,
            headline: data.headline,
            summary: data.summary,
            industry: data.industry,
            location: `${data.city}, ${data.country}`,
            experience: data.experiences.map((exp) => ({
                title: exp.title,
                company: exp.company,
                description: exp.description,
                startDate: exp.starts_at,
                endDate: exp.ends_at
            })),
            education: data.education.map((edu) => ({
                school: edu.school,
                degree: edu.degree_name,
                fieldOfStudy: edu.field_of_study,
                startDate: edu.starts_at,
                endDate: edu.ends_at
            })),
            skills: data.skills.map((skill) => skill.name),
            languages: data.languages,
            volunteer: data.volunteer_work,
            certifications: data.certifications
        };
    });
}
