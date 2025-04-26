export const PLAN_NAME_SUGGESTIONS = [
  'Weekend Adventure',
  'Hidden Gems Tour',
  'Local Foodie Journey',
  'Cultural Discovery Route',
  'Photography Spots Trail',
  'Sunset Chase Itinerary',
  'Historical Landmarks Tour',
  "Urban Explorer's Path",
  'Nature Escape Route',
  'Architectural Wonders Tour',
  'Street Art Safari',
  'Romantic City Walk',
  'Coffee Shop Hopping',
  'Vintage Store Trail',
  'Garden & Parks Tour',
  'Night Life Adventure',
  'Local Markets Route',
  'Sacred Places Journey',
  'Scenic Viewpoints Tour',
  'Art Gallery Expedition',
];

export function getRandomPlanName(): string {
  return PLAN_NAME_SUGGESTIONS[
    Math.floor(Math.random() * PLAN_NAME_SUGGESTIONS.length)
  ];
}
