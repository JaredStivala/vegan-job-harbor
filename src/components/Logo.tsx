import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1">
      <span className="text-2xl font-extrabold bg-gradient-to-r from-sage to-sage-dark bg-clip-text text-transparent">
        Work
      </span>
      <span className="text-2xl font-extrabold text-accent">
        Veg
      </span>
    </Link>
  );
};