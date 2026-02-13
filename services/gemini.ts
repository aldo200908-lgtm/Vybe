import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedLook } from "../types";

// Imágenes de alta calidad de Unsplash para Streetwear/Fashion
const LOOK_IMAGES = [
  'https://images.unsplash.com/photo-1523396884775-65aa90543212?q=80&w=1000&auto=format&fit=crop', // Dark techwear
  'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop', // Urban style
  'https://images.unsplash.com/photo-1617137968427-bf3d46152d65?q=80&w=1000&auto=format&fit=crop', // Cyberpunk vibes
  'https://images.unsplash.com/photo-1529139574466-a302d2774d75?q=80&w=1000&auto=format&fit=crop'  // Neon vibes
];

const ITEM_IMAGES: Record<string, string> = {
  'Top': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
  'Bottom': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
  'Shoes': 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
  'Accessory': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
  'Outerwear': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop'
};

export const generateFashionLook = async (
  vibeResponse: string,
  contextResponse: string,
  climate: string
): Promise<GeneratedLook> => {
  // Inicializamos aquí para evitar que la app se rompa al cargar si falta la key
  // Usamos una key vacía temporalmente si no existe para que el error salte al llamar a la API, no al cargar la app
  const apiKey = process.env.API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Actúa como un psicólogo de moda y estilista de IA de élite. 
  Has recibido las siguientes respuestas de un cliente sobre su estado mental y entorno:
  
  - Frecuencia/Energía: "${vibeResponse}"
  - Misión/Contexto: "${contextResponse}"
  - Entorno Climático: "${climate}"
  
  TU MISIÓN: Interpreta estas respuestas abstractas para definir un estilo de streetwear único. 
  No uses categorías genéricas; crea una narrativa visual que combine su energía con la funcionalidad necesaria.
  
  Proporciona un objeto JSON que represente el look curado en ESPAÑOL.`;

  try {
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

    // Limpieza robusta del JSON por si el modelo incluye bloques de código Markdown
    const rawText = response.text || '{}';
    const cleanText = rawText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanText);
    
    return {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      mainImageUrl: LOOK_IMAGES[Math.floor(Math.random() * LOOK_IMAGES.length)],
      items: result.items.map((item: any) => ({
        ...item,
        // Asignamos imagen basada en categoría o una por defecto si no coincide
        imageUrl: ITEM_IMAGES[item.category] || ITEM_IMAGES['Top']
      }))
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Re-lanzar para manejarlo en la UI
  }
};