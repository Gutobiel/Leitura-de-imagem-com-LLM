import axios from 'axios';
import * as dotenv from 'dotenv';
import { Medidor } from '../models/medidor';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = 'https://api.gemini.com/vision';  // URL da API Gemini

// Simulação de um banco de dados em memória
const measurements: Medidor[] = [];

export const uploadMeasurement = async (data: any) => {
  // Validação dos parâmetros
  if (!data.image || !data.customer_code || !data.measure_datetime || !data.measure_type) {
    throw { statusCode: 400, error_code: 'INVALID_DATA', error_description: 'Dados inválidos' };
  }

  // Verificar se já existe uma leitura para o tipo no mês atual
  const existing = measurements.find(measure =>
    measure.customer_code === data.customer_code &&
    measure.measure_type === data.measure_type &&
    new Date(measure.measure_datetime).getMonth() === new Date().getMonth()
  );

  if (existing) {
    throw { statusCode: 409, error_code: 'DOUBLE_REPORT', error_description: 'Leitura do mês já realizada' };
  }

  // Chamada para a API Gemini
  const response = await axios.post(GEMINI_URL, {
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
};

export const confirmMeasurement = async (data: any) => {
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
};

export const listMeasurements = (customer_code: string, measure_type?: string) => {
  if (measure_type && !['AGUA', 'GAS'].includes(measure_type.toUpperCase())) {
    throw { statusCode: 400, error_code: 'INVALID_TYPE', error_description: 'Tipo de medição não permitida' };
  }

  const filteredMeasurements = measurements.filter(m =>
    m.customer_code === customer_code &&
    (!measure_type || m.measure_type.toUpperCase() === measure_type.toUpperCase())
  );

  if (filteredMeasurements.length === 0) {
    throw { statusCode: 404, error_code: 'MEASURES_NOT_FOUND', error_description: 'Nenhuma leitura encontrada' };
  }

  return {
    customer_code,
    measures: filteredMeasurements
  };
};
