export type ProductDescription = {
  category: string;
  brand: string;
  color: string;
  season: string;
  country: string;
  upperMaterial: string;
  liningMaterial: string;
};

export function parseProductDescription(
  description: string
): ProductDescription {
  const productDescription: ProductDescription = {
    category: "",
    brand: "",
    color: "",
    season: "",
    country: "",
    upperMaterial: "",
    liningMaterial: "",
  };

  // Регулярні вирази для пошуку ключових слів і їх значень
  const regexCategory = /Категорія:\s*(.*?)(?=\n|Бренд|$)/;
  const regexBrand = /Бренд:\s*(.*?)(?=\n|Колір|$)/;
  const regexColor = /Колір:\s*(.*?)(?=\n|Сезон|$)/;
  const regexSeason = /Сезон:\s*(.*?)(?=\n|Країна виробник|$)/;
  const regexCountry = /Країна виробник:\s*(.*?)(?=\n|Матеріал верху|$)/;
  const regexUpperMaterial =
    /Матеріал верху:\s*(.*?)(?=\n|Матеріал підкладки|$)/;
  const regexLiningMaterial = /Матеріал підкладки:\s*(.*?)(?=\n|$)/;

  // Використовуємо регулярні вирази для пошуку значень
  const categoryMatch = description.match(regexCategory);
  const brandMatch = description.match(regexBrand);
  const colorMatch = description.match(regexColor);
  const seasonMatch = description.match(regexSeason);
  const countryMatch = description.match(regexCountry);
  const upperMaterialMatch = description.match(regexUpperMaterial);
  const liningMaterialMatch = description.match(regexLiningMaterial);

  // Записуємо знайдені значення в об'єкт
  if (categoryMatch) productDescription.category = categoryMatch[1].trim();
  if (brandMatch) productDescription.brand = brandMatch[1].trim();
  if (colorMatch) productDescription.color = colorMatch[1].trim();
  if (seasonMatch) productDescription.season = seasonMatch[1].trim();
  if (countryMatch) productDescription.country = countryMatch[1].trim();
  if (upperMaterialMatch)
    productDescription.upperMaterial = upperMaterialMatch[1].trim();
  if (liningMaterialMatch)
    productDescription.liningMaterial = liningMaterialMatch[1].trim();

  return productDescription;
}
