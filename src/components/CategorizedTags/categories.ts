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
import { sustainabilityCategories } from './categoryGroups/sustainability';
import { healthcareCategories } from './categoryGroups/healthcare';
import { consultingCategories } from './categoryGroups/consulting';
import { creativeCategories } from './categoryGroups/creative';
import { legalCategories } from './categoryGroups/legal';

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
  "Skills": skillsCategories,
  "Sustainability & Environment": sustainabilityCategories,
  "Healthcare & Wellness": healthcareCategories,
  "Consulting & Advisory": consultingCategories,
  "Creative & Design": creativeCategories,
  "Legal & Compliance": legalCategories
};