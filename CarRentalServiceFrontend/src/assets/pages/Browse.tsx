import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import CarCard from "../components/CarCard";
import "../components/List.css"; 

export interface Car {
  id: string; 
  make: string;
  model: string;
  year: number;
  rate: number;
  image: string;
  available: boolean; 
}

export default function Browse() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 
  const handleBookClick = (carId: string) => {
    navigate(`/booking/${carId}`);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:8000/api/cars");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: Car[] = await response.json();
        setCars(data);

      } catch (e) {
        if (e instanceof Error) {
            setError(`Failed to fetch cars: ${e.message}. Please make sure your backend server is running.`);
        } else {
            setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []); 



  if (loading) {
    return (
      <div className="car-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading available cars...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="car-list-empty">
            <h3>Oops! Something went wrong.</h3>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="car-list-container">
      <div className="car-list-header">
        <h2>Available Cars</h2>
        <span className="car-count">{cars.length} cars found</span>
      </div>

      {cars.length > 0 ? (
        <div className="car-list">
          {cars.map((car) => (
            <CarCard 
              key={car.id} 
              car={car}
              onBookClick={handleBookClick} 
            />
          ))}
        </div>
      ) : (
        <div className="car-list-empty">
          <h3>No Cars Found</h3>
          <p>There are currently no cars available. Please check back later.</p>
        </div>
      )}
    </div>
  );
}