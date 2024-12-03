import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-0.5">
      <span className="text-2xl font-extrabold text-cream">
        Work
      </span>
      <span className="text-2xl font-extrabold text-cream italic">
        Veg
      </span>
    </Link>
  );
};