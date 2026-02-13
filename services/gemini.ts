import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLook } from "../types";

// The API key must be obtained exclusively from process.env.API_KEY
// and assumed to be pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFashionLook = async (
  vibeResponse: string,
  contextResponse: string,
  climate: string
): Promise<GeneratedLook> => {
  const prompt = `Actúa como un psicólogo de moda y estilista de IA de élite. 
  Has recibido las siguientes respuestas de un cliente sobre su estado mental y entorno:
  
  - Frecuencia/Energía: "${vibeResponse}"
  - Misión/Contexto: "${contextResponse}"
  - Entorno Climático: "${climate}"
  
  TU MISIÓN: Interpreta estas respuestas abstractas para definir un estilo de streetwear único. 
  No uses categorías genéricas; crea una narrativa visual que combine su energía con la funcionalidad necesaria.
  
  Proporciona un objeto JSON que represente el look curado en ESPAÑOL.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Un nombre evocador para el atuendo." },
          description: { type: Type.STRING, description: "Explicación de cómo este atuendo refleja la psicología del cliente." },
          vibeTag: { type: Type.STRING, description: "El arquetipo de estilo resultante (ej. 'Nómada Tecnológico', 'Sombra Minimalista')" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                detail: { type: Type.STRING }
              },
              required: ["name", "category", "detail"]
            }
          }
        },
        required: ["name", "description", "vibeTag", "items"]
      }
    }
  });

  // Clean JSON response in case of Markdown formatting
  const rawText = response.text || '{}';
  const cleanText = rawText.replace(/```json\n?|\n?```/g, '').trim();
  const result = JSON.parse(cleanText);
  
  const lookImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCzGVdv5IDTla-J_mcyt6cgT9UsjQ8Jzy_t6Y3NkppYRijpp2aa9U3kmQ8WQke-6m8QRj1k-ZqiLOJbuFnaqElsDP_4q89CpSnyAPNb-mGWXHxxxmRCtoC7MGRaiMdrzIj3RGiEPP-GM69VfWDx-vIsxVhBTW53FlFhP3_AeIkOkud3IouYnez7rCavVykmT7YxsBldic5R42vHyYR-KQzuteDeDgtH3DuSEKuAhlgctBOAbbAl4rNJ55-ZjITypbnpnduV-ErZy64',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDHVv-OCVZQjpQFlqEgBji12adhKYIgsNIFciNx-V4f6ZR2xd4JLVvIEQ3KVFExeowfgTbLObem4XJxl6No0rpkTQQ4mxljUU77kxy-ncdIgLCt1McoZbBO-jN6eaIsb9bUW3NEtXAheuElq5XOea5kQfMUgpviEzdRWVg4OPWO1x4a9Iklkdmx3yI1lFL_hJkg-3Xaag4CsaIVTR_k8oa3c3bzOXxmP4zQ_BUOCT023IxgV-339lx-gjYukIets9MkuQBgxDiiWkE'
  ];

  const itemImages: Record<string, string> = {
    'Top': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbuJ-34h1QmTyFrISz55z_NZgF3VUdlPmEtoeEAAp7etx0PeqMSSHnHqGJzdmevLE4XJapzvRulQef_rEySWRiFTFG1RB76HjMNEwwzFfgXjJwkClnKW2humBZ6vXNaPNBtOikYcrGSg3MMN0xZ__NLkUqaNjIT9HJk_E5A034dXrgafVDkCCqo9wuhK0yLTkA6kBgMxhuaxivsxvsM8PRxyMWR4Q84OgRCBUsj0gWQvsdC7itvGZvbnLyTi2MXJC8TDB-1I0Hzb0',
    'Bottom': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfn_lw1OdlpB9hWkZLKpcc3prruN31G_3GxcivxU3VAh3H6F575aX9TrI-5OpJQ2Fb0dZ84ylMEmaDnUuODxwPFKPPoL0UW82z_UpEkFuxDTycZAzpovcWk-iDZz0dzERkLO3XXdflQUPj4is4bIcJVg_HI7VJ1_42P8DsY63AaxFtdr2FnCwaLNa4ISkIru1Jbio0owxuBdquKTKEMTxI4Z0JRbmGnl0Y7QkI9d4_BYjTUM4jTj-870SZCMmt1BJRQlvYOB7qrp0',
    'Shoes': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPq6X2BYAeNjkK9rfw3EPKSeilPD72Ew8DJwVkfkx1uTC53bWBDSq7eu1hZdPzb3HrlLoMNYjX2URuO2-vFoh5fs9yX4UpzHYj-w_ur92oF2LkTSZS6qzcvKOsTy_x7jBSilGEaCoCz_c2bsWdbYNZwAlCNe2GbtSFQFMf9SSPAUh_pMdm9OhLJkxcv8cQrgaf7ceP4MVvCq5wG-N3YW8A8R3J7xI6BF5xw6EyNZmhcocWhiV6LlYU-1cNk33JqjwZ69rOKYr-1N4',
    'Accessory': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZiq-Lpfz7DwrdEX_swXQu4h2LUqzT0QHwfKoq_O57gH5fhQxhhLxPVKpUTGRY6BELOZqIsFp7JNJWTUZJiriwiAy1scaKRg_akd22CWMXZf9aC6HuOZp-mjMg3_-hmr_RvHz6OADCO_GkiYl_vfswezSRfmFnkjT4M9kdS-XQLbqPHxEVCmRYK4xIY69-SmV_6J-bgmUiNGqIUoP9EYgWht_NvbBOvplUykVbxxqyCSKsMY3BKm1JNFN44Xh2IuP3jaJ_UpjK9Wo'
  };

  return {
    ...result,
    id: Math.random().toString(36).substr(2, 9),
    mainImageUrl: lookImages[Math.floor(Math.random() * lookImages.length)],
    items: result.items.map((item: any) => ({
      ...item,
      imageUrl: itemImages[item.category] || 'https://picsum.photos/400/400'
    }))
  };
};