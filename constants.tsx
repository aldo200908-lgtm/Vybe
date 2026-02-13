
import { StyleQuestionOption, ClimateChoice, UserProfile } from './types';

export const VIBE_QUESTIONS: StyleQuestionOption[] = [
  { 
    id: 'tension', 
    label: 'Alta Tensión', 
    description: 'Energía cruda, materiales técnicos y presencia imponente.',
    icon: 'bolt'
  },
  { 
    id: 'silence', 
    label: 'Silencio Absoluto', 
    description: 'Minimalismo radical, tonos neutros y cortes arquitectónicos.',
    icon: 'visibility_off'
  },
  { 
    id: 'chaos', 
    label: 'Caos Controlado', 
    description: 'Mezcla de texturas, capas asimétricas y espíritu rebelde.',
    icon: 'Grain'
  },
  { 
    id: 'future', 
    label: 'Código Abierto', 
    description: 'Inspiración retro-futurista, neones sutiles y fluidez.',
    icon: 'terminal'
  },
];

export const CONTEXT_QUESTIONS: StyleQuestionOption[] = [
  { 
    id: 'conquer', 
    label: 'Conquistar el Asfalto', 
    description: 'Movimiento constante, durabilidad y funcionalidad urbana.',
    icon: 'speed'
  },
  { 
    id: 'shadows', 
    label: 'Crear en las Sombras', 
    description: 'Introspección, confort premium y detalles ocultos.',
    icon: 'nights_stay'
  },
  { 
    id: 'ghost', 
    label: 'Desaparecer en la Multitud', 
    description: 'Estética "incógnito", siluetas amplias y misterio.',
    icon: 'masks'
  },
  { 
    id: 'spotlight', 
    label: 'Ser el Pulso de la Ciudad', 
    description: 'Diseños vanguardistas que dictan el ritmo visual.',
    icon: 'sensors'
  },
];

export const CLIMATE_CHOICES: ClimateChoice[] = [
  { id: 'artico', name: 'Ártico', icon: 'ac_unit' },
  { id: 'invierno', name: 'Invierno Urbano', icon: 'cloud' },
  { id: 'primavera', name: 'Primavera / Otoño', icon: 'filter_drama' },
  { id: 'calor', name: 'Ola de Calor', icon: 'wb_sunny' },
  { id: 'monzon', name: 'Monzón', icon: 'umbrella' },
];

export const MOCK_USER: UserProfile = {
  username: "lexi.virtual",
  handle: "@lexi.virtual",
  bio: "Archivista Digital y Curadora de Streetwear",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlIFsxedtaD_r6_SAwGBltvDbYVmmpHs8FRNHkYp8opRZX84QuE-U__mxcgaCmDoUmuyQ6JdcrXwqe1YteyJhiGaQ3xbCjTbpqhFE99YPCk5M14GN7kn3vCdvsn9fxmDliFwWP6pUDenfkjClqNmew5_QkTgEedeQphteicC-7sb1MyOyW0E_xIAW5H38NWEs8ae4emVXSiwRHD9Q5EwLmvhcBDcj6ak13vWmlceYaPBS_syQ55dCZurJCdciSYCwaZ7Y5fXOJECg",
  fitsGenerated: 124,
  views: "8.2k"
};
