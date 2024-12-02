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
    <div className="space-y-6 pt-4">
      <div className="flex items-center space-x-3 p-4 bg-sage/5 rounded-lg border border-sage/20 hover:bg-sage/10 transition-colors">
        <Checkbox
          id="verified"
          checked={isVerified}
          onCheckedChange={(checked) => {
            setIsVerified(checked as boolean);
            if (!checked) setVerificationPeriod("");
          }}
          className="h-5 w-5"
        />
        <Label htmlFor="verified" className="text-lg font-medium cursor-pointer">
          Verify this job posting (only verified listings will be colored and have a verified badge)
        </Label>
      </div>

      {isVerified && (
        <div className="ml-6 space-y-4 p-4 bg-cream rounded-lg border border-sage/20">
          <p className="text-lg font-medium text-sage-dark mb-4">Select verification period:</p>
          <RadioGroup
            value={verificationPeriod}
            onValueChange={setVerificationPeriod}
            className="space-y-3"
          >
            <div className="flex items-center justify-between space-x-2 p-3 bg-white rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="24h" id="24h" className="h-5 w-5" />
                <Label htmlFor="24h" className="text-base">24 Hours</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['24h'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 bg-white rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="3d" id="3d" className="h-5 w-5" />
                <Label htmlFor="3d" className="text-base">3 Days</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['3d'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 bg-white rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1w" id="1w" className="h-5 w-5" />
                <Label htmlFor="1w" className="text-base">1 Week</Label>
              </div>
              <span className="text-base font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['1w'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-3 bg-white rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1m" id="1m" className="h-5 w-5" />
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