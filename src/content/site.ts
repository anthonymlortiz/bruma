/**
 * Every piece of copy and every outbound link lives here.
 *
 * Spanish is the default and is served at `/`; English is served at `/en/`.
 * Both routes render the same components — only this dictionary changes — so a
 * new section needs its wording added once per language and nowhere else.
 */

export type Lang = 'es' | 'en';

export const LANGS = ['es', 'en'] as const satisfies readonly Lang[];

export const DEFAULT_LANG: Lang = 'es';

/** Route for a language. Spanish owns the root; the .do domain is Dominican. */
export function pathFor(lang: Lang): string {
  return lang === DEFAULT_LANG ? '/' : `/${lang}/`;
}

/** Locale-independent facts. */
export const site = {
  name: 'BRUMA JARABACOA',
  shortName: 'BRUMA',
  url: 'https://bruma.do',
  place: {
    locality: 'Jarabacoa',
    region: 'La Vega',
    countryCode: 'DO',
  },
  instagram: {
    handle: '@brumajarabacoa',
    url: 'https://www.instagram.com/brumajarabacoa/',
  },
  ogImage: '/og-bruma-jarabacoa.jpg',
} as const;

interface Copy {
  /** BCP 47 tag for <html lang>. */
  htmlLang: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** Name of this language, written in this language, for the switcher. */
  endonym: string;
  meta: { title: string; description: string; ogImageAlt: string };
  ui: { skip: string; langLabel: string };
  hero: { statement: string; tagline: string; cue: string; imageAlt: string };
  intro: { eyebrow: string; heading: string; body: string };
  sequence: {
    air: string;
    unhurried: string;
    rooted: string;
    airAlt: string;
    valleyAlt: string;
    pinarAlt: string;
  };
  closing: { heading: string; status: string; instagram: string; imageAlt: string };
  footer: { country: string };
}

export const copy: Record<Lang, Copy> = {
  es: {
    htmlLang: 'es',
    ogLocale: 'es_DO',
    endonym: 'Español',
    meta: {
      title: 'BRUMA JARABACOA — Desde las montañas',
      description:
        'Una visión de lugares para vivir, descansar y compartir, inspirados en la naturaleza y el espíritu de Jarabacoa.',
      ogImageAlt: 'El emblema de BRUMA JARABACOA sobre las montañas de Jarabacoa',
    },
    ui: {
      skip: 'Ir al contenido',
      langLabel: 'Idioma',
    },
    hero: {
      statement: 'Desde las montañas.',
      tagline:
        'Bruma es una visión de lugares para vivir, descansar y compartir, concebidos en armonía con la naturaleza y el espíritu de Jarabacoa.',
      cue: 'Descubrir',
      imageAlt: 'Luz de media tarde sobre las lomas verdes y escalonadas de Jarabacoa',
    },
    intro: {
      eyebrow: 'Jarabacoa, República Dominicana',
      heading: 'Una forma más serena de vivir.',
      body: 'En Bruma, la arquitectura acompaña el paisaje y la vida sigue el ritmo de la montaña: mañanas sin prisa, encuentros memorables y una conexión más profunda con la naturaleza.',
    },
    sequence: {
      air: 'Aire de montaña',
      unhurried: 'Vivir sin prisa',
      rooted: 'Desde Jarabacoa',
      airAlt:
        'Gotas de rocío suspendidas en una telaraña al amanecer, con la bruma tendida sobre el valle y las cordilleras de Jarabacoa detrás',
      valleyAlt:
        'Un río de niebla al amanecer atravesando el valle de Jarabacoa, con una palma real en primer plano y cordilleras superpuestas detrás',
      pinarAlt:
        'Pinos en primer plano enmarcando las lomas de Jarabacoa, que se pierden en la bruma azul del horizonte',
    },
    closing: {
      heading: 'Algo está tomando forma en las montañas.',
      status: 'Muy pronto',
      instagram: 'Instagram',
      imageAlt: 'La cordillera de cumbre dentada, con niebla prendida en su ladera, que dio origen a la marca Bruma, sobre el valle de Jarabacoa',
    },
    footer: {
      country: 'República Dominicana',
    },
  },

  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    endonym: 'English',
    meta: {
      title: 'BRUMA JARABACOA — Born in the Mountains',
      description:
        'A vision for places to live, stay, and gather, inspired by nature and the spirit of Jarabacoa.',
      ogImageAlt: 'The BRUMA JARABACOA mark over the mountains of Jarabacoa',
    },
    ui: {
      skip: 'Skip to content',
      langLabel: 'Language',
    },
    hero: {
      statement: 'Born in the mountains.',
      tagline:
        'Bruma is a vision for places to live, stay, and gather, designed in harmony with nature and the spirit of Jarabacoa.',
      cue: 'Discover',
      imageAlt: 'Late afternoon light across the layered green ridges of the Jarabacoa highlands',
    },
    intro: {
      eyebrow: 'Jarabacoa, Dominican Republic',
      heading: 'A quieter way of being.',
      body: 'At Bruma, architecture follows the landscape and life moves at the rhythm of the mountains: slower mornings, meaningful gatherings, and a deeper connection with nature.',
    },
    sequence: {
      air: 'Mountain air',
      unhurried: 'Unhurried living',
      rooted: 'Rooted in Jarabacoa',
      airAlt:
        'Dew held on a spider’s web at dawn, with mist lying over the valley and the ridges of Jarabacoa behind it',
      valleyAlt:
        'A river of mist at dawn running through the Jarabacoa valley, a royal palm in the foreground and layered ridges beyond',
      pinarAlt:
        'Pines in the foreground framing the hills of Jarabacoa as they fade into blue haze on the horizon',
    },
    closing: {
      heading: 'Something is taking shape in the mountains.',
      status: 'Coming soon',
      instagram: 'Instagram',
      imageAlt: 'The jagged ridgeline that the Bruma mark was drawn from, mist caught along its flank, above the Jarabacoa valley',
    },
    footer: {
      country: 'Dominican Republic',
    },
  },
};
