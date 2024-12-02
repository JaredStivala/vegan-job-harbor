import { CollapsibleContent as RadixCollapsibleContent } from "@/components/ui/collapsible";
import { JobDescription } from "./JobDescription";

interface CollapsibleContentProps {
  description: string | null;
}

export const CollapsibleContent = ({ description }: CollapsibleContentProps) => {
  return (
    <RadixCollapsibleContent className="px-8 py-6 bg-white border-x border-b rounded-b-lg">
      <JobDescription description={description} />
    </RadixCollapsibleContent>
  );
};