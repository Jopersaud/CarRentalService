import { Link } from "react-router-dom";
import "./CarCard.css";

export interface Car {
  id: string;
  make: string;
  rate: number; 
  image: string;
  available: boolean;
  model: string;
  year: number;
}
interface CarCardProps {
  car: Car;
  showBookButton?: boolean;
  onBookClick?: (id: string) => void;
  compact?: boolean;
}

function CarCard({
  car,
  showBookButton = true,
  onBookClick,
  compact = false,
}: CarCardProps) {
  const handleBookClick = (e: React.MouseEvent) => {
    if (!car.available) {
      e.preventDefault();
      return;
    }
    if (onBookClick) {
      e.preventDefault();
      onBookClick(car.id);
    }
  };

  return (
    <div
      className={`car-card ${compact ? "compact" : ""} ${
        !car.available ? "unavailable" : ""
      }`}
    >
      <Link to={`/cars/${car.id}`} className="car-card-link">
        <div className="car-card-image">
          <img
            src={car.image}
            alt={`${car.make} ${car.model}`}
            loading="lazy"
          />

          {!car.available && (
            <div className="status-badge unavailable-badge">Unavailable</div>
          )}
        </div>

        <div className="car-card-content">
          <div className="car-card-header">
            <h3 className="car-name">
              {car.year ? `${car.year} ` : ""}
              {car.make}
            </h3>
          </div>
          {!compact && <p className="car-model">{car.model}</p>}
          <div className="car-card-footer">
            <div className="car-price">
              <span className="price-amount">${car.rate}</span>
              <span className="price-period">/day</span>
            </div>

            {showBookButton && (
              <button
                onClick={handleBookClick}
                className={`btn-book ${!car.available ? "btn-disabled" : ""}`}
                disabled={!car.available}
              >
                {car.available ? "Book Now" : "Not Available"}
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CarCard;
