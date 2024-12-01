interface JobDescriptionProps {
  description: string | null;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    // First, clean up the text by adding proper spacing
    let cleanedDesc = desc
      // Add space after colons that don't have one
      .replace(/(\w):(\w)/g, '$1: $2')
      // Add space after periods that don't have one
      .replace(/(\w)\.(\w)/g, '$1. $2')
      // Fix concatenated words
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Normalize multiple spaces
      .replace(/\s+/g, ' ');
    
    // Split into sections while preserving common section headers
    let sections = cleanedDesc.split(/(?=Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us|How you will make a difference)/gi);
    
    return sections.map(section => {
      // Get the section title if it exists
      const titleMatch = section.match(/^(Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us|How you will make a difference)/i);
      const title = titleMatch ? titleMatch[0] : '';
      const content = titleMatch ? section.substring(title.length) : section;
      
      // Split content into paragraphs and format them
      const formattedContent = content
        .split(/\n\n|\n(?=[•-])|(?<=\.)(?=[A-Z])|<br\s*\/?>/gi)
        .filter(p => p.trim().length > 0)
        .map(p => {
          const trimmedP = p.trim();
          
          // Handle bullet points
          if (trimmedP.startsWith('•') || trimmedP.startsWith('-')) {
            return `<li class="mb-2">${trimmedP.substring(1).trim()}</li>`;
          }
          
          // Handle key-value pairs (like "Location:", "Salary:", etc.)
          if (trimmedP.match(/^[A-Za-z\s]+:/)) {
            return `<p class="mb-4 leading-relaxed"><strong>${trimmedP.split(':')[0]}:</strong>${trimmedP.split(':').slice(1).join(':')}</p>`;
          }
          
          // Regular paragraphs
          return `<p class="mb-4 leading-relaxed">${trimmedP}</p>`;
        })
        .join('\n');

      // If this is a section with a title, wrap it in a section with heading
      if (title) {
        return `
          <section class="mb-8">
            <h3 class="text-xl font-bold text-sage-dark mb-4">${title}</h3>
            ${content.trim().startsWith('•') || content.trim().startsWith('-') 
              ? `<ul class="list-disc pl-6 space-y-1">${formattedContent}</ul>`
              : formattedContent}
          </section>
        `;
      }
      
      // If no title, just return the formatted content
      return `<div class="mb-6">${formattedContent}</div>`;
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