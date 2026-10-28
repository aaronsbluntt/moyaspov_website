/**
 * MOYA'S POV — Centralized Content & CMS Data Store
 * Diseñado para que toda la información y fotografías de la página
 * sean dinámicas y editables desde el Panel de Administración.
 */

const STORAGE_KEY = 'moyaspov_cms_data_v1';

const DEFAULT_SITE_DATA = {
  brand: {
    name: "MOYA'S POV",
    tagline: "Fotografía de Autor & Dirección Visual",
    instagram: "@moyaspov",
    email: "hola@moyaspov.com",
    whatsapp: "+5215500000000",
    location: "Disponible en estudio y locación"
  },
  theme: {
    bgPrimary: "#0d0d0d",
    bgSecondary: "#181420",
    accent: "#D85082",
    heroAnimationStyle: "cinematic-drift" // 'cinematic-drift' | 'crossfade'
  },
  hero: {
    eyebrow: "PORTAFOLIO SELECCIONADO · MOYA'S POV",
    quote: "Cada fotografía es un fragmento de la memoria",
    quoteAuthor: "Robert Frank",
    subtitle: "Capturando la estética del instante con una mirada íntima, atemporal y honesta.",
    ctaPrimary: "Explorar Portafolio",
    ctaSecondary: "Reservar Sesión",
    // Fotografías seleccionadas que pasan animadas detrás del inicio
    backgroundPhotos: [
      {
        id: "hero-1",
        title: "Luz de Medianoche",
        category: "Editorial",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
        meta: "50mm · f/1.4 · ISO 400"
      },
      {
        id: "hero-2",
        title: "Silencio en Movimiento",
        category: "Retrato",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
        meta: "35mm · f/1.8 · ISO 200"
      },
      {
        id: "hero-3",
        title: "Fragmentos Urbanos",
        category: "Lifestyle",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=85",
        meta: "85mm · f/1.4 · ISO 100"
      },
      {
        id: "hero-4",
        title: "Nostalgia Contemporánea",
        category: "Editorial",
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85",
        meta: "35mm · f/2.0 · ISO 320"
      },
      {
        id: "hero-5",
        title: "Geometría de la Sombra",
        category: "Autor",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1400&q=85",
        meta: "50mm · f/1.2 · ISO 160"
      },
      {
        id: "hero-6",
        title: "Mirada Interior",
        category: "Retrato",
        url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=85",
        meta: "85mm · f/1.8 · ISO 100"
      }
    ]
  },
  about: {
    eyebrow: "01 / SOBRE MÍ",
    title: "Detrás del lente: una búsqueda constante de lo auténtico.",
    lead: "Hola, soy Moya. Mi trabajo nace en el punto donde el minimalismo visual se encuentra con la emoción cruda.",
    paragraph1: "No busco poses rígidas ni sonrisas prefabricadas. Mi perspectiva (Moya's POV) consiste en observar la luz, los silencios y los gestos sutiles que cuentan quién eres realmente cuando olvidas que hay una cámara enfrente.",
    paragraph2: "Cada sesión se diseña como una pieza editorial personalizada: cuidamos la atmósfera, la paleta de color y la dirección artística para crear fotografías que no solo se vean modernas hoy, sino que conserven su fuerza con el paso de los años.",
    portraitUrl: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&q=85",
    portraitCaption: "Moya — Dirección creativa & Fotografía",
    stats: [
      { value: "+150", label: "Sesiones realizadas" },
      { value: "100%", label: "Edición de autor" },
      { value: "48h", label: "Avance de galería" }
    ],
    pillars: [
      {
        title: "Dirección Natural",
        description: "Te guío en todo momento para que te sientas cómodo/a frente a la cámara, logrando expresiones orgánicas."
      },
      {
        title: "Estética Editorial",
        description: "Tratamiento de color propio con contrastes profundos, pieles reales y una atmósfera cinematográfica."
      },
      {
        title: "Experiencia a Medida",
        description: "Desde el moodboard inicial hasta la selección final, cada sesión se adapta a tu esencia o marca."
      }
    ]
  },
  portfolio: {
    eyebrow: "02 / PORTAFOLIO",
    title: "Archivo Visual Seleccionado",
    subtitle: "Una curaduría de retratos, editoriales e historias capturadas bajo mi punto de vista.",
    categories: ["Todo", "Retrato", "Editorial", "Parejas", "Urbano"],
    items: [
      {
        id: "port-1",
        title: "Estudio en Claroscuro",
        category: "Retrato",
        year: "2026",
        meta: "50mm · f/1.4",
        size: "tall", // 'normal' | 'tall' | 'wide'
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
      },
      {
        id: "port-2",
        title: "Vogue Nocturno",
        category: "Editorial",
        year: "2026",
        meta: "35mm · f/1.8",
        size: "wide",
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85"
      },
      {
        id: "port-3",
        title: "Cómplices al Atardecer",
        category: "Parejas",
        year: "2026",
        meta: "85mm · f/1.4",
        size: "normal",
        url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85"
      },
      {
        id: "port-4",
        title: "Pulso de la Ciudad",
        category: "Urbano",
        year: "2026",
        meta: "28mm · f/2.0",
        size: "normal",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
      },
      {
        id: "port-5",
        title: "Rosa & Obsidiana",
        category: "Editorial",
        year: "2026",
        meta: "50mm · f/1.2",
        size: "tall",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85"
      },
      {
        id: "port-6",
        title: "Esencia Minimal",
        category: "Retrato",
        year: "2026",
        meta: "85mm · f/1.8",
        size: "normal",
        url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85"
      },
      {
        id: "port-7",
        title: "Arquitectura del Movimiento",
        category: "Urbano",
        year: "2026",
        meta: "35mm · f/2.0",
        size: "wide",
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1400&q=85"
      },
      {
        id: "port-8",
        title: "Memoria Compartida",
        category: "Parejas",
        year: "2026",
        meta: "50mm · f/1.4",
        size: "normal",
        url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=85"
      }
    ]
  },
  packages: {
    eyebrow: "03 / PAQUETES",
    title: "Inversión & Experiencias",
    subtitle: "Sesiones diseñadas con claridad y cuidado en cada etapa. Elige la experiencia que mejor se adapte a tu proyecto.",
    note: "¿Necesitas una producción comercial o cobertura a medida? Podemos armar un paquete personalizado.",
    items: [
      {
        id: "pkg-esencial",
        name: "POV Esencial",
        badge: "Retrato Individual / Express",
        price: "$120",
        currency: "USD",
        duration: "1 Hora de sesión",
        description: "Ideal para actualizar tu retrato personal, portafolio o contenido con estética limpia y profesional.",
        featured: false,
        features: [
          "1 hora de sesión en locación exterior o estudio",
          "15 fotografías editadas en alta resolución",
          "Asesoría previa de vestuario y concepto",
          "Hasta 2 cambios de outfit",
          "Galería digital privada de entrega en 5 días"
        ]
      },
      {
        id: "pkg-editorial",
        name: "POV Editorial",
        badge: "Más Solicitado",
        price: "$220",
        currency: "USD",
        duration: "2 Horas de sesión",
        description: "La experiencia completa de Moya's POV. Dirección artística profunda para crear una serie visual inolvidable.",
        featured: true,
        features: [
          "2 horas de sesión (locación + estudio opcional)",
          "30 fotografías con edición fine-art de autor",
          "Moodboard creativo personalizado antes de la sesión",
          "Cambios de outfit ilimitados dentro del tiempo",
          "Avance de 5 fotos en menos de 48 horas",
          "Galería digital interactiva + versión lista para redes"
        ]
      },
      {
        id: "pkg-signature",
        name: "POV Signature / Parejas & Marcas",
        badge: "Producción Completa",
        price: "$360",
        currency: "USD",
        duration: "3.5 Horas de sesión",
        description: "Pensado para campañas de marca, lookbooks, parejas o proyectos creativos que requieren narrativa extendida.",
        featured: false,
        features: [
          "Hasta 3.5 horas de cobertura en múltiples locaciones",
          "50+ fotografías editadas en máxima resolución",
          "Dirección creativa integral y planeación de producción",
          "2 clips cortos verticales (B-Roll / Behind the scenes)",
          "Entrega prioritaria en galería privada",
          "Licencia de uso comercial o álbum digital incluido"
        ]
      }
    ]
  },
  booking: {
    eyebrow: "04 / RESERVA TU SESIÓN",
    title: "Creemos tu próximo fragmento de memoria.",
    subtitle: "Completa los detalles básicos de la sesión que tienes en mente y te responderé en menos de 24 horas para confirmar disponibilidad y crear tu moodboard."
  }
};

/**
 * Obtiene los datos actuales (desde localStorage o por defecto)
 */
function getSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_SITE_DATA);
    const parsed = JSON.parse(raw);
    return deepMerge(structuredClone(DEFAULT_SITE_DATA), parsed);
  } catch (err) {
    console.warn("Error leyendo datos locales, usando configuración por defecto:", err);
    return structuredClone(DEFAULT_SITE_DATA);
  }
}

/**
 * Guarda los datos actualizados en localStorage
 */
function saveSiteData(newData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    return true;
  } catch (err) {
    console.error("Error guardando datos en localStorage:", err);
    return false;
  }
}

/**
 * Restaura los datos originales de fábrica
 */
function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_SITE_DATA);
}

/**
 * Combina objetos recursivamente para mantener compatibilidad si se agregan campos
 */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) {
      target[key] = source[key];
    } else if (source[key] && typeof source[key] === 'object' && key in target) {
      target[key] = deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

window.MoyaCMS = {
  getSiteData,
  saveSiteData,
  resetSiteData,
  DEFAULT_SITE_DATA
};

