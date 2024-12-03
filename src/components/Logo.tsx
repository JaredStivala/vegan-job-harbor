import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1 bg-cream px-4 py-2 rounded-lg">
      <span className="text-2xl font-extrabold text-[#1A1F2C]">
        Work
      </span>
      <span className="text-2xl font-extrabold text-[#1A1F2C] italic">
        Veg
      </span>
    </Link>
  );
};