import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1">
      <span className="text-2xl font-extrabold text-accent">
        Work
      </span>
      <span className="text-2xl font-extrabold text-accent italic">
        Veg
      </span>
    </Link>
  );
};