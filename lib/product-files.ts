// Maps product/bundle IDs to their file paths in Supabase Storage
// Files will be uploaded to the 'products' bucket

export const productFileMap: Record<string, string[]> = {
  // Daglig
  'daglig-gjennomgang': ['planners/daglig-gjennomgang.pdf'],
  'daglig-helseplan': ['planners/daglig-helseplan.pdf'],
  'daglig-planlegger': ['planners/daglig-planlegger.pdf'],
  'daglig-produktivitetsplan': ['planners/daglig-produktivitetsplan.pdf'],
  'daglig-timeplan': ['planners/daglig-timeplan.pdf'],

  // Ukentlig
  'ukentlig-gjennomgang': ['planners/ukentlig-gjennomgang.pdf'],
  'ukentlig-gjoremaal': ['planners/ukentlig-gjoremaal.pdf'],
  'ukentlig-matplan': ['planners/ukentlig-matplan.pdf'],
  'ukentlig-plan': ['planners/ukentlig-plan.pdf'],
  'ukentlig-planlegger': ['planners/ukentlig-planlegger.pdf'],

  // Månedlig
  'maanedlig-budsjett': ['planners/maanedlig-budsjett.pdf'],
  'maanedlig-gjennomgang': ['planners/maanedlig-gjennomgang.pdf'],
  'maanedlig-planlegger': ['planners/maanedlig-planlegger.pdf'],

  // Årlig
  'aarlig-planlegger': ['planners/aarlig-planlegger.pdf'],

  // Produktivitet
  'pomodoro-planlegger': ['planners/pomodoro-planlegger.pdf'],
  'prosjekt-planlegger': ['planners/prosjekt-planlegger.pdf'],
  'gjoremaal-liste': ['planners/gjoremaal-liste.pdf'],
  'handlingsplan': ['planners/handlingsplan.pdf'],
  'maal-planlegger': ['planners/maal-planlegger.pdf'],

  // Helse og livsstil
  'helse-planlegger': ['planners/helse-planlegger.pdf'],
  'hjemmeplanlegger': ['planners/hjemmeplanlegger.pdf'],
  'reise-planlegger': ['planners/reise-planlegger.pdf'],

  // Sporing
  'personlig-finans-tracker': ['planners/personlig-finans-tracker.pdf'],
  'vane-tracker': ['planners/vane-tracker.pdf'],
  '30-dagers-utfordring': ['planners/30-dagers-utfordring.pdf'],
};

// Bundle mappings — returns all files for a bundle
export const bundleFileMap: Record<string, string[]> = {
  'komplett': Object.values(productFileMap).flat(),
  'daglig-pakke': [
    ...productFileMap['daglig-gjennomgang'],
    ...productFileMap['daglig-helseplan'],
    ...productFileMap['daglig-planlegger'],
    ...productFileMap['daglig-produktivitetsplan'],
    ...productFileMap['daglig-timeplan'],
  ],
  'ukentlig-pakke': [
    ...productFileMap['ukentlig-gjennomgang'],
    ...productFileMap['ukentlig-gjoremaal'],
    ...productFileMap['ukentlig-matplan'],
    ...productFileMap['ukentlig-plan'],
    ...productFileMap['ukentlig-planlegger'],
  ],
  'produktivitetspakken': [
    ...productFileMap['pomodoro-planlegger'],
    ...productFileMap['prosjekt-planlegger'],
    ...productFileMap['gjoremaal-liste'],
    ...productFileMap['handlingsplan'],
    ...productFileMap['maal-planlegger'],
  ],
};

export function getFilesForItems(items: { id: string; type: string }[]): string[] {
  const files: string[] = [];
  for (const item of items) {
    if (item.type === 'bundle') {
      const bundleFiles = bundleFileMap[item.id];
      if (bundleFiles) files.push(...bundleFiles);
    } else {
      const productFiles = productFileMap[item.id];
      if (productFiles) files.push(...productFiles);
    }
  }
  return [...new Set(files)];
}
