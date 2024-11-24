// Split categories into separate files by domain
import { restaurantCategories } from './categoryGroups/restaurant';
import { foodIndustryCategories } from './categoryGroups/foodIndustry';
import { businessCategories } from './categoryGroups/business';
import { technologyCategories } from './categoryGroups/technology';
import { retailCategories } from './categoryGroups/retail';
import { marketingCategories } from './categoryGroups/marketing';
import { nonProfitCategories } from './categoryGroups/nonProfit';
import { educationCategories } from './categoryGroups/education';
import { employmentCategories } from './categoryGroups/employment';
import { experienceCategories } from './categoryGroups/experience';
import { skillsCategories } from './categoryGroups/skills';

export const categories = {
  "Restaurant & Hospitality": restaurantCategories,
  "Food Industry": foodIndustryCategories,
  "Business & Operations": businessCategories,
  "Technology": technologyCategories,
  "Retail & Service": retailCategories,
  "Marketing & Communications": marketingCategories,
  "Non-Profit & Advocacy": nonProfitCategories,
  "Education & Research": educationCategories,
  "Employment Type": employmentCategories,
  "Experience Level": experienceCategories,
  "Other Skills": skillsCategories
};