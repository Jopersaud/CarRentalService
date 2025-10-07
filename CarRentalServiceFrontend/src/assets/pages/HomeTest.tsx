import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeTest.css";

interface Booking {
  id: number;
  carName: string;
  startDate: string;
  endDate: string;
}

export default function HomeTest() {
  const [user] = useState({
    id: 1,
    name: "Test User",
    email: "test@example.com",
  });

  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const sampleBookings: Booking[] = [
      {
        id: 1,
        carName: "Toyota Camry",
        startDate: "2025-10-05",
        endDate: "2025-10-08",
      },
      {
        id: 2,
        carName: "Honda CR-V",
        startDate: "2025-11-02",
        endDate: "2025-11-05",
      },
    ];

    setBookings(sampleBookings);
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to CarRental, {user.name}!</h1>

      <section className="bookings-section">
        <h2>Your Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="booking-list">
            {bookings.map((b) => (
              <li key={b.id} className="booking-card">
                <strong>{b.carName}</strong>
                <p>
                  {b.startDate} → {b.endDate}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have any bookings yet.</p>
        )}
      </section>

      <section className="book-now-section">
        <h2>Ready for your next trip?</h2>
        <p>Browse available cars and book your next ride in minutes!</p>
        <Link to="/cars" className="book-now-btn">
          Book a Car
        </Link>
      </section>
    </div>
  );
}
