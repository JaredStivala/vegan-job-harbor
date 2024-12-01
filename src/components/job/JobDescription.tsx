interface JobDescriptionProps {
  description: string | null;
}

export const JobDescription = ({ description }: JobDescriptionProps) => {
  const formatDescription = (desc: string) => {
    if (!desc) return '';
    
    // First, identify and format the overview section
    let sections = desc.split(/(?=Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us)/gi);
    
    return sections.map(section => {
      // Get the section title if it exists
      const titleMatch = section.match(/^(Overview|About the Role|Requirements|Key Responsibilities|What We Offer|Benefits|About Us)/i);
      const title = titleMatch ? titleMatch[0] : '';
      const content = titleMatch ? section.substring(title.length) : section;
      
      // Split content into paragraphs and format them
      const formattedContent = content
        .split(/\n\n|\n(?=[•-])|<br\s*\/?>/gi)
        .filter(p => p.trim().length > 0)
        .map(p => {
          const trimmedP = p.trim();
          
          // Handle bullet points
          if (trimmedP.startsWith('•') || trimmedP.startsWith('-')) {
            return `<li class="mb-2">${trimmedP.substring(1).trim()}</li>`;
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