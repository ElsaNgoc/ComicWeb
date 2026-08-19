export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return base || "truyen";
}

export async function uniqueSlug(
  title: string,
  exists: (slug: string) => Promise<boolean>,
  currentSlug?: string,
) {
  const base = slugify(title);
  if (currentSlug && base === currentSlug) return currentSlug;

  let slug = base;
  let i = 2;
  while (await exists(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}
