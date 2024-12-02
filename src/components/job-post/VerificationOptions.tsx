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
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Checkbox
          id="verified"
          checked={isVerified}
          onCheckedChange={(checked) => {
            setIsVerified(checked as boolean);
            if (!checked) setVerificationPeriod("");
          }}
        />
        <Label htmlFor="verified" className="text-sm font-medium text-gray-700 cursor-pointer">
          Verify this job posting (only verified listings will be colored and have a verified badge)
        </Label>
      </div>

      {isVerified && (
        <div className="ml-6 space-y-3">
          <Label className="text-sm font-medium text-gray-700">Select verification period:</Label>
          <RadioGroup
            value={verificationPeriod}
            onValueChange={setVerificationPeriod}
            className="space-y-2"
          >
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="text-sm">24 Hours</Label>
              </div>
              <span className="text-sm font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['24h'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3d" id="3d" />
                <Label htmlFor="3d" className="text-sm">3 Days</Label>
              </div>
              <span className="text-sm font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['3d'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1w" id="1w" />
                <Label htmlFor="1w" className="text-sm">1 Week</Label>
              </div>
              <span className="text-sm font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['1w'])}</span>
            </div>
            <div className="flex items-center justify-between space-x-2 p-2 rounded-md hover:bg-sage/5 transition-colors">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1m" id="1m" />
                <Label htmlFor="1m" className="text-sm">1 Month</Label>
              </div>
              <span className="text-sm font-medium text-sage-dark">{formatPrice(PRICING.VERIFICATION['1m'])}</span>
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
};