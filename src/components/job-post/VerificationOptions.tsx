import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PRICING, formatPrice } from "@/config/pricing";

interface VerificationOptionsProps {
  isVerified: boolean;
  verificationPeriod: string;
  setIsVerified: (checked: boolean) => void;
  setVerificationPeriod: (value: string) => void;
}

export const VerificationOptions = ({
  isVerified,
  verificationPeriod,
  setIsVerified,
  setVerificationPeriod
}: VerificationOptionsProps) => {
  return (
    <div className="space-y-6 border rounded-lg p-6 bg-white shadow-sm">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="verified"
          checked={isVerified}
          onCheckedChange={(checked) => {
            setIsVerified(checked as boolean);
            if (!checked) setVerificationPeriod("");
          }}
          className="mt-1"
        />
        <Label 
          htmlFor="verified" 
          className="text-base font-medium text-sage-dark cursor-pointer leading-relaxed"
        >
          Verify this job posting
          <p className="text-sm font-normal text-gray-600 mt-1">
            Verified listings are highlighted and display a verified badge, increasing visibility and trust
          </p>
        </Label>
      </div>

      {isVerified && (
        <div className="ml-7 space-y-4">
          <Label className="text-base font-medium text-sage-dark block mb-3">Select verification period:</Label>
          <RadioGroup
            value={verificationPeriod}
            onValueChange={setVerificationPeriod}
            className="space-y-3"
          >
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-sage/20 hover:border-sage/40 hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="text-base">24 Hours</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['24h'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-sage/20 hover:border-sage/40 hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="3d" id="3d" />
                <Label htmlFor="3d" className="text-base">3 Days</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['3d'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-sage/20 hover:border-sage/40 hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1w" id="1w" />
                <Label htmlFor="1w" className="text-base">1 Week</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['1w'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 rounded-md border border-sage/20 hover:border-sage/40 hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1m" id="1m" />
                <Label htmlFor="1m" className="text-base">1 Month</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['1m'])}</span>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};