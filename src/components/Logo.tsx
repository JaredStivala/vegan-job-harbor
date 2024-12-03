import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-0.5 bg-cream px-3 py-1.5 rounded-md">
      <span className="text-2xl font-extrabold text-[#1A1F2C]">
        Work
      </span>
      <span className="text-2xl font-extrabold text-[#1A1F2C] italic">
        Veg
      </span>
    </Link>
  );
};