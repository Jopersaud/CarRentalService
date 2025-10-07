import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import "./Home.css";

interface Booking {
  id: number;
  carName: string;
  startDate: string;
  endDate: string;
}
export default function Home() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (user) {
      const storedBookings = localStorage.getItem(`bookings_${user.id}`);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      } else {
        setBookings([
          {
            id: 1,
            carName: "Toyota Camry",
            startDate: "2025-10-05",
            endDate: "2025-10-08",
          },
        ]);
      }
    }
  }, [user]);

  return (
    <div className="home-container">
      <h1>Welcome to CarRental{user ? `, ${user.name}` : ""}!</h1>

      {!user && (
        <div className="guest-section">
          <p>
            Please <Link to="/login">log in</Link> or{" "}
            <Link to="/register">create an account</Link> to manage bookings.
          </p>
        </div>
      )}

      {user && (
        <>
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
        </>
      )}
    </div>
  );
}
