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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const matches_1 = __importDefault(require("./routes/matches"));
const errorHandler_1 = require("./middleware/errorHandler");
const database_1 = __importDefault(require("./config/database"));
exports.prisma = database_1.default;
const passport_1 = __importDefault(require("./config/passport"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/profiles', profiles_1.default);
app.use('/matches', matches_1.default);
app.use(errorHandler_1.errorHandler);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const PORT = process.env.PORT || 3000;
function testDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.$connect();
            console.log('Successfully connected to the database');
            // Test query
            const userCount = yield database_1.default.user.count();
            console.log(`Number of users in the database: ${userCount}`);
            yield database_1.default.$disconnect();
        }
        catch (error) {
            console.error('Error connecting to the database:', error);
        }
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield testDatabaseConnection();
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error('Failed to start the server:', error);
            process.exit(1);
        }
    });
}
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
startServer();
