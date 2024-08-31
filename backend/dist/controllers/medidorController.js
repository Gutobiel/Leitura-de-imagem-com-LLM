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
exports.measureRouter = void 0;
const express_1 = __importDefault(require("express"));
const medidorService_1 = require("../services/medidorService");
exports.measureRouter = express_1.default.Router();
exports.measureRouter.post('/upload', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, medidorService_1.uploadMeasurement)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}));
exports.measureRouter.patch('/confirm', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, medidorService_1.confirmMeasurement)(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}));
exports.measureRouter.get('/:customer_code/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_code } = req.params;
        const measure_type = req.query.measure_type;
        const result = yield (0, medidorService_1.listMeasurements)(customer_code, measure_type);
        res.status(200).json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred." });
        }
    }
}));
