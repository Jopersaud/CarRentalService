import { useState, useMemo } from "react";
import "./Form.css";

interface BookingFormData {
  renterName: string;
  email: string;
  phone: string;
  driverLicense: string;
}

interface BookingFormProps {
  carId: string;
  carPricePerDay: number;
  startDate: Date | null;
  endDate: Date | null;
  onSubmit: () => Promise<void>;
  isDateRangeSelected: boolean;
}

const formatDate = (date: Date | null): string => {
  return date
    ? date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";
};

const calculateRentalDays = (start: Date, end: Date): number => {
  if (!start || !end) return 0;

  const s = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  ).getTime();
  const e = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  ).getTime();
  const diffTime = Math.abs(e - s);

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

function BookingForm({
  carId,
  carPricePerDay,
  startDate,
  endDate,
}: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    renterName: "",
    email: "",
    phone: "",
    driverLicense: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { totalDays, totalPrice } = useMemo(() => {
    if (startDate && endDate) {
      const days = calculateRentalDays(startDate, endDate);
      const price = days * carPricePerDay;
      return { totalDays: days, totalPrice: price };
    }
    return { totalDays: 0, totalPrice: 0 };
  }, [startDate, endDate, carPricePerDay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const fields = Object.values(formData);
    const isValid = fields.every((field) => field.trim() !== "");

    if (!isValid) {
      console.error("Please fill in all renter details.");
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      console.error("Please select both start and end dates.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const bookingDetails = {
      carId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalPrice,
      renterDetails: formData,
    };

    console.log("Attempting to create booking:", bookingDetails);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Booking Confirmed for $${totalPrice}! (Proceed to Payment Page)`);
    }, 1500);
  };

  const isFormDisabled = !startDate || !endDate || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit}
      className={`booking-form ${isFormDisabled ? "disabled" : ""}`}
    >
      <div className="form-group">
        <label htmlFor="renterName">Full Name</label>
        <input
          type="text"
          id="renterName"
          name="renterName"
          value={formData.renterName}
          onChange={handleInputChange}
          required
          disabled={isFormDisabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={isFormDisabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          disabled={isFormDisabled}
        />
      </div>
      <div className="form-group">
        <label htmlFor="driverLicense">Driver's License #</label>
        <input
          type="text"
          id="driverLicense"
          name="driverLicense"
          value={formData.driverLicense}
          onChange={handleInputChange}
          required
          disabled={isFormDisabled}
        />
      </div>

      <div className="form-summary">
        <h4>Booking Details</h4>
        <p>Car ID: {carId}</p>
        <p>
          Period: {formatDate(startDate)} to {formatDate(endDate)}
        </p>
        <p>Days: {totalDays}</p>
      </div>

      <div className="final-total">
        <h4>Final Rental Price:</h4>
        <span className="price-amount">${totalPrice.toFixed(2)}</span>
      </div>

      <button
        type="submit"
        className="btn-primary btn-confirm"
        disabled={isFormDisabled || totalDays === 0}
      >
        {isSubmitting
          ? "Processing..."
          : "Confirm Booking & Proceed to Payment"}
      </button>

      {isFormDisabled && !isSubmitting && totalDays === 0 && (
        <p className="form-alert">Please select your rental dates first.</p>
      )}
    </form>
  );
}

export default BookingForm;
