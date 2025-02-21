import HeyGenAdapter from '@/adapters/HeygenAdapter';
import GenerateVideoUseCase from './GenerateVideoUseCase';

const heyGenAdapter = new HeyGenAdapter();
const generateVideoUseCase = new GenerateVideoUseCase(heyGenAdapter);

export { generateVideoUseCase };
