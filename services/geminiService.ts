
import { GoogleGenAI } from "@google/genai";
import { Property } from '../types';
import { formatCurrency, calculateProjectedProfit, calculateProjectedROI } from '../utils/calculations';

// IMPORTANT: This key is managed externally and will be provided by the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePropertyAnalysis = async (property: Property): Promise<string> => {
  if (!API_KEY) {
    return "API Key do Gemini não configurada. A análise de IA está desativada.";
  }
  
  const model = 'gemini-2.5-flash';
  
  const prompt = `
    Você é um especialista em análise de investimentos imobiliários de leilão.
    Analise o seguinte imóvel e forneça um parecer conciso sobre seu potencial de investimento.
    
    **Dados do Imóvel:**
    - Título: ${property.title}
    - Tipo: ${property.type}
    - Localização: ${property.address}
    - Situação: ${property.situation}
    - Valor de Avaliação: ${formatCurrency(property.evaluationValue)}
    - Valor de Compra (Leilão): ${formatCurrency(property.purchaseValue)}
    - Preço de Venda Estimado: ${formatCurrency(property.estimatedSalePrice)}
    
    **Cálculos Financeiros Preliminares:**
    - Lucro Projetado: ${formatCurrency(calculateProjectedProfit(property))}
    - ROI Projetado: ${calculateProjectedROI(property).toFixed(2)}%
    
    **Seu Parecer:**
    (Seja direto e objetivo. Destaque os pontos fortes, os riscos e dê uma recomendação. Use markdown para formatação).
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao tentar gerar a análise de IA. Por favor, tente novamente mais tarde.";
  }
};
