import CarCard, { type Car } from "./CarCard";
import "./List.css";

interface CarListProps {
  cars: Car[];
  loading?: boolean;
  onCarClick?: (carId: string) => void; 
}

function List({ cars, loading = false, onCarClick }: CarListProps) {
  if (loading) {
    return (
      <div className="car-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="car-list-container">
      <div className="car-list-header">
        <h2>Available Cars</h2>
        <span className="car-count">
          {cars.length} {cars.length === 1 ? "car" : "cars"} available
        </span>
      </div>

      <div className="car-list">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            showBookButton={true}
            onBookClick = {onCarClick}
          />
        ))}
      </div>
    </div>
  );
}

export default List;
