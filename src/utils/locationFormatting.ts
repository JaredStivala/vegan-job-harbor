export const formatLocation = (loc: string | null) => {
  if (!loc) return '';
  
  try {
    // Handle JSON array strings
    if (loc.startsWith('[') && loc.endsWith(']')) {
      const parsed = JSON.parse(loc);
      const location = Array.isArray(parsed) ? parsed[0] : parsed;
      return standardizeLocation(location);
    }
    return standardizeLocation(loc.replace(/[\[\]"{}']/g, '').trim());
  } catch {
    return standardizeLocation(loc.replace(/[\[\]"{}']/g, '').trim());
  }
};

export const standardizeLocation = (location: string) => {
  const lowercaseLocation = location.toLowerCase();
  
  // Consolidate all remote variations into a single "Remote" option
  if (lowercaseLocation.includes('remote')) {
    return 'Remote';
  }
  
  // For non-remote locations, return the original formatted location
  return location.trim();
};