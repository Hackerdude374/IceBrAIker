"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedinConfig = void 0;
exports.linkedinConfig = {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile']
};
