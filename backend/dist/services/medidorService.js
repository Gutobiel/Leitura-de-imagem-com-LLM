"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.listMeasurements = exports.confirmMeasurement = exports.uploadMeasurement = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://api.gemini.com/vision'; // URL da API Gemini
// Simulação de um banco de dados em memória
const measurements = [];
const uploadMeasurement = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validação dos parâmetros
    if (!data.image || !data.customer_code || !data.measure_datetime || !data.measure_type) {
        throw { statusCode: 400, error_code: 'INVALID_DATA', error_description: 'Dados inválidos' };
    }
    // Verificar se já existe uma leitura para o tipo no mês atual
    const existing = measurements.find(measure => measure.customer_code === data.customer_code &&
        measure.measure_type === data.measure_type &&
        new Date(measure.measure_datetime).getMonth() === new Date().getMonth());
    if (existing) {
        throw { statusCode: 409, error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' };
    }
    // Chamada para a API Gemini
    const response = yield axios_1.default.post(GEMINI_URL, {
        image: data.image
    }, {
        headers: { 'Authorization': `Bearer ${GEMINI_API_KEY}` }
    });
    const { image_url, measure_uuid, measure_value } = response.data;
    // Salvar a nova leitura
    const newMedidor = {
        measure_uuid,
        measure_datetime: data.measure_datetime,
        measure_type: data.measure_type,
        image_url,
        has_confirmed: false,
        customer_code: data.customer_code,
        measure_value
    };
    measurements.push(newMedidor);
    measurements.push(newMedidor);
    return {
        image_url,
        measure_value,
        measure_uuid
    };
});
exports.uploadMeasurement = uploadMeasurement;
const confirmMeasurement = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.measure_uuid || !data.confirmed_value) {
        throw { statusCode: 400, error_code: 'INVALID_DATA', error_description: 'Dados inválidos' };
    }
    const measure = measurements.find(m => m.measure_uuid === data.measure_uuid);
    if (!measure) {
        throw { statusCode: 404, error_code: 'MEASURE_NOT_FOUND', error_description: 'Leitura não encontrada' };
    }
    if (measure.has_confirmed) {
        throw { statusCode: 409, error_code: 'CONFIRMATION_DUPLICATE', error_description: 'Leitura já confirmada' };
    }
    measure.has_confirmed = true;
    measure.measure_value = data.confirmed_value;
    return { success: true };
});
exports.confirmMeasurement = confirmMeasurement;
const listMeasurements = (customer_code, measure_type) => {
    if (measure_type && !['AGUA', 'GAS'].includes(measure_type.toUpperCase())) {
        throw { statusCode: 400, error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' };
    }
    const filteredMeasurements = measurements.filter(m => m.customer_code === customer_code &&
        (!measure_type || m.measure_type.toUpperCase() === measure_type.toUpperCase()));
    if (filteredMeasurements.length === 0) {
        throw { statusCode: 404, error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' };
    }
    return {
        customer_code,
        measures: filteredMeasurements
    };
};
exports.listMeasurements = listMeasurements;
