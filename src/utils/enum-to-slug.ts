export function enumToSlug(en: string) {
  return en.replace(/_/g, '-').toLowerCase();
}
