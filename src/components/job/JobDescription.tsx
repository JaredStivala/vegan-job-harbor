interface JobDescriptionProps {
  description: string | null;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    // First, clean up the text by adding proper spacing and fixing common issues
    let cleanedDesc = desc
      // Add space after colons that don't have one
      .replace(/(\w):(\w)/g, '$1: $2')
      // Add space after periods that don't have one
      .replace(/(\w)\.(\w)/g, '$1. $2')
      // Fix concatenated words
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Remove duplicate headings that are close to each other
      .replace(/(?:Overview|About)\s*(?:Overview|About)/gi, 'Overview')
      // Remove redundant "Full job description Job" text
      .replace(/Full job description Job/gi, '')
      // Remove duplicate newlines and spaces
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s+/g, ' ');
    
    // Split into sections while preserving common section headers
    // Only match headers at the start of a line or after two newlines
    const sectionRegex = /(?:^|\n\n)(Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us|How you will make a difference)/gi;
    let sections = cleanedDesc.split(sectionRegex);
    
    // Remove empty sections and clean up
    sections = sections.filter(section => section && section.trim());
    
    return sections.map(section => {
      // Check if this section is a header
      const isHeader = /^(Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us|How you will make a difference)$/i.test(section.trim());
      
      if (isHeader) {
        return `<h3 class="text-xl font-bold text-sage-dark mb-4">${section.trim()}</h3>`;
      }
      
      // Split content into paragraphs and format them
      const paragraphs = section
        .split(/(?:\n\n|\n(?=[•-])|\n(?=[A-Z][^a-z]{2}))/g)
        .filter(p => p.trim().length > 0)
        .map(p => {
          const trimmedP = p.trim();
          
          // Handle bullet points
          if (trimmedP.startsWith('•') || trimmedP.startsWith('-')) {
            return `<li class="mb-2">${trimmedP.substring(1).trim()}</li>`;
          }
          
          // Handle key-value pairs (like "Location:", "Salary:", etc.)
          if (trimmedP.match(/^[A-Za-z\s]+:/)) {
            const [key, ...valueParts] = trimmedP.split(':');
            const value = valueParts.join(':').trim();
            return `<p class="mb-4 leading-relaxed"><strong>${key}:</strong> ${value}</p>`;
          }
          
          // Regular paragraphs
          return `<p class="mb-4 leading-relaxed">${trimmedP}</p>`;
        });
      
      // Group bullet points into lists
      let formattedContent = '';
      let inList = false;
      
      paragraphs.forEach((p) => {
        if (p.startsWith('<li')) {
          if (!inList) {
            formattedContent += '<ul class="list-disc pl-6 space-y-1">';
            inList = true;
          }
          formattedContent += p;
        } else {
          if (inList) {
            formattedContent += '</ul>';
            inList = false;
          }
          formattedContent += p;
        }
      });
      
      if (inList) {
        formattedContent += '</ul>';
      }
      
      return formattedContent;
    }).join('\n');
  };

  return (
    <div className="prose prose-lg max-w-none">
      {description ? (
        <div 
          className="text-gray-700"
          dangerouslySetInnerHTML={{ 
            __html: formatDescription(description) 
          }} 
        />
      ) : (
        <p className="text-gray-500 italic">No description available</p>
      )}
    </div>
  );
};