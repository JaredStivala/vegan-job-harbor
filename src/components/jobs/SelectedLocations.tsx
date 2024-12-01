interface SelectedLocationsProps {
  locations: string[];
  onLocationRemove: (location: string) => void;
}

export const SelectedLocations = ({ locations, onLocationRemove }: SelectedLocationsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {locations.map(location => (
        <button
          key={location}
          onClick={() => onLocationRemove(location)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-sage/10 text-sage-dark rounded-full text-sm hover:bg-sage/20"
        >
          {location}
          <span>×</span>
        </button>
      ))}
    </div>
  );
};