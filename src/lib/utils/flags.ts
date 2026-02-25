// Mapeamento de nomes de países (como retornados pela API) para código ISO alpha-2
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'Brazil': 'br',
  'Brasil': 'br',
  'Argentina': 'ar',
  'USA': 'us',
  'United States': 'us',
  'Italy': 'it',
  'Itália': 'it',
  'Poland': 'pl',
  'Polônia': 'pl',
  'France': 'fr',
  'França': 'fr',
  'Japan': 'jp',
  'Japão': 'jp',
  'Serbia': 'rs',
  'Sérvia': 'rs',
  'Turkey': 'tr',
  'Turquia': 'tr',
  'Russia': 'ru',
  'Rússia': 'ru',
  'Germany': 'de',
  'Alemanha': 'de',
  'Netherlands': 'nl',
  'Holanda': 'nl',
  'China': 'cn',
  'South Korea': 'kr',
  'Coreia do Sul': 'kr',
  'Cuba': 'cu',
  'Dominican Republic': 'do',
  'República Dominicana': 'do',
  'Puerto Rico': 'pr',
  'Canada': 'ca',
  'Canadá': 'ca',
  'Mexico': 'mx',
  'México': 'mx',
  'Slovenia': 'si',
  'Eslovênia': 'si',
  'Bulgaria': 'bg',
  'Bulgária': 'bg',
  'Ukraine': 'ua',
  'Ucrânia': 'ua',
  'Belgium': 'be',
  'Bélgica': 'be',
  'Iran': 'ir',
  'Irã': 'ir',
  'Australia': 'au',
  'Austrália': 'au',
  'Egypt': 'eg',
  'Egito': 'eg',
  'Cameroon': 'cm',
  'Camarões': 'cm',
  'Kenya': 'ke',
  'Quênia': 'ke',
  'Czechia': 'cz',
  'Czech Republic': 'cz',
  'República Tcheca': 'cz',
  'Slovakia': 'sk',
  'Eslováquia': 'sk',
  'Finland': 'fi',
  'Finlândia': 'fi',
  'Portugal': 'pt',
  'Spain': 'es',
  'Espanha': 'es',
  'Peru': 'pe',
  'Colombia': 'co',
  'Colômbia': 'co',
  'Chile': 'cl',
  'Venezuela': 've',
}

export function getFlagUrl(countryCodeOrName: string, size: 20 | 40 | 80 = 40): string {
  const lower = countryCodeOrName.toLowerCase()

  // Se já é um código de 2 letras
  if (countryCodeOrName.length === 2) {
    return `https://flagcdn.com/w${size}/${lower}.png`
  }

  // Tenta mapear nome → código
  const code = COUNTRY_NAME_TO_CODE[countryCodeOrName]
  if (code) {
    return `https://flagcdn.com/w${size}/${code}.png`
  }

  // Fallback: tenta com as primeiras 2 letras em minúsculo
  return `https://flagcdn.com/w${size}/${lower.slice(0, 2)}.png`
}

export function getCountryCode(countryName: string): string | null {
  return COUNTRY_NAME_TO_CODE[countryName] ?? null
}

// Emojis de bandeiras como fallback
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase()
  return code
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')
}
