"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matchController_1 = require("../controllers/matchController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/find', auth_1.authMiddleware, matchController_1.findMatches);
exports.default = router;
