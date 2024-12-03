import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-0.5">
      <span className="text-2xl font-extrabold text-sage-dark hover:text-sage transition-colors">
        Work
      </span>
      <span className="text-2xl font-extrabold text-sage-dark hover:text-sage transition-colors italic">
        Veg
      </span>
    </Link>
  );
};