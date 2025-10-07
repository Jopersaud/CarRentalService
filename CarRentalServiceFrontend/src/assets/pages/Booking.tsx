import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Calendar from "../components/Calendar";
import BookingForm from "../components/Form";
import CarCard, { type Car } from "../components/CarCard";
import "./Booking.css";
import "../components/Form.css";
import "../components/Calendar.css";
const API_URL = 'http://localhost:8000/api';

function Booking() {
  const { carId } = useParams<{ carId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [car, setCar] = useState<Car | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [step, setStep] = useState<"start" | "end">("start");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const carRes = await fetch(`${API_URL}/cars/${carId}`);
        if (!carRes.ok) throw new Error("Could not find car details.");
        const carData: Car = await carRes.json();
        setCar(carData);

        const bookingScheduleUrl = `${API_URL}/bookings?carId=${carId}`;
        console.log("Requesting booking schedule from:", bookingScheduleUrl); 
        const bookingsRes = await fetch(bookingScheduleUrl);
        if (!bookingsRes.ok) throw new Error("Could not fetch booking schedule.");
        const bookingsData = await bookingsRes.json();

        const disabledDates: Date[] = [];
        bookingsData.forEach((booking: { startDate: string; endDate: string }) => {
          let currentDate = new Date(new Date(booking.startDate).setUTCHours(0,0,0,0));
          const lastDate = new Date(new Date(booking.endDate).setUTCHours(0,0,0,0));
          while (currentDate <= lastDate) {
            disabledDates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });
        setUnavailableDates(disabledDates);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [carId]);

  const handleDateSelect = (date: Date) => {
    const selected = new Date(date.setHours(0, 0, 0, 0));
    const normalizedToday = new Date(new Date().setHours(0, 0, 0, 0));

    if (selected < normalizedToday) return;

    if (step === "start") {
      setStartDate(selected);
      setEndDate(null);
      setStep("end");
    } else {
      if (startDate && selected < startDate) {
        setStartDate(selected);
        setEndDate(null);
        setStep("end");
        return;
      }
      setEndDate(selected);
    }
  };

  const { totalDays, totalPrice } = useMemo(() => {
    if (!startDate || !endDate || !car) return { totalDays: 0, totalPrice: 0 };
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return { totalDays: days, totalPrice: (car.rate || 0) * days };
  }, [startDate, endDate, car]);

  const handleResetDates = () => {
    setStep("start");
    setStartDate(null);
    setEndDate(null);
  };
  
  const handleBookingSubmit = async () => {
      if (!car || !user || !startDate || !endDate) {
          setError("Missing booking information. Please select dates.");
          return;
      }

      try {
          const response = await fetch(`${API_URL}/bookings`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  carId: car.id,
                  userId: user.id,
                  startDate: startDate.toISOString().split('T')[0], 
                  endDate: endDate.toISOString().split('T')[0],
              }),
          });

          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.message || "This car is unavailable for the selected dates.");
          }

          navigate('/confirmation');

      } catch (err: any) {
          setError(err.message);
      }
  };


  if (loading) {
    return <div className="booking-page">Loading booking details...</div>;
  }
  
  if (error) {
    return <div className="booking-page">Error: {error}</div>;
  }

  if (!car) {
    return <div className="booking-page">Car not found.</div>;
  }

  return (
    <div className="booking-page">
      <h2>Complete Your Booking for {car.make} {car.model}</h2>
      <div className="booking-content-container">
        <div className="summary-and-form-container">
          <div className="booking-summary-card">
            <h3>Rental Summary:</h3>
            <CarCard car={car} compact={true} showBookButton={false} />
            <div className="booking-dates-display">
                <p><strong>Start Date:</strong> <span className="date-highlight">{startDate ? startDate.toDateString() : "Select Start Date"}</span></p>
                <p><strong>End Date:</strong> <span className="date-highlight">{endDate ? endDate.toDateString() : "Select End Date"}</span></p>
                {totalDays > 0 && (
                    <div className="booking-price-summary">
                        <p><strong>Rental Period:</strong> <strong>{totalDays} day{totalDays > 1 ? "s" : ""}</strong></p>
                        <h3 className="final-total-text"><strong>Estimated Total:</strong> ${totalPrice.toFixed(2)}</h3>
                    </div>
                )}
                <button className="btn-change-dates" onClick={handleResetDates}>Change Dates</button>
            </div>
          </div>
          <div className="booking-form-section">
            <h3 className="form-step-header">Step 2: Renter Details & Confirmation</h3>
            <BookingForm
              carId ={carId || ""}
              carPricePerDay={car.rate}
              startDate={startDate}
              endDate={endDate}
              onSubmit={handleBookingSubmit}
              isDateRangeSelected={!!(startDate && endDate)}
            />
          </div>
        </div>
        <div className="booking-calendar-section">
          <h3 className="calendar-step-header">Step 1: Select Your {step === "start" ? "Start" : "End"} Date</h3>
          <Calendar
            selectedDate={step === "start" ? startDate : endDate}
            onDateSelect={handleDateSelect}
            minDate={new Date()}
            disabledDates={unavailableDates}
          />
        </div>
      </div>
    </div>
  );
}

export default Booking;

