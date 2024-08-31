export interface Medidor {
    measure_uuid: string;
    measure_datetime: string;
    measure_type: 'AGUA' | 'GAS';
    image_url: string;
    has_confirmed: boolean;
    customer_code: string;
    measure_value: number;
  }
  