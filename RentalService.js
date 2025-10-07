const express = require('express');
const cors = require('cors');
const {initializeApp, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp} = require('firebase-admin/firestore');
const {getAuth} = require('firebase-admin/auth');
const Account = require('./car-rental-service-56181-firebase-adminsdk-fbsvc-7bef1b2453.json');
initializeApp({
    credential: cert(Account)
});
const database = getFirestore();
const authentication = getAuth();
const RS = express();
const PORT = 8000;
RS.use(cors());
RS.use(express.json());

RS.post('/api/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const userRecord = await authentication.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`,
    });
    await database.collection('users').doc(userRecord.uid).set({
        firstName,
        lastName,
        email,
        createdAt: Timestamp.now(),
    });
    res.status(201).json({ message: "User registered successfully!", uid: userRecord.uid });
});

RS.get('/api/cars', async (req, res) => {
    const carsQuery = database.collection('cars');
    const carsSnapshot = await carsQuery.get();
    const cars = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cars);

});

RS.post('/api/cars/bookings', async (req, res) => {
    const { carId, userId, startDate, endDate } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const bookingsRef = database.collection('bookings');
    const querySnapshot = await bookingsRef.where('carId', '==', carId).get();
    
    let isConflict = false;
    querySnapshot.forEach(doc => {
        const booking = doc.data();
        const bookingstart = booking.startDate.toDate();
        const bookingend = booking.endDate.toDate();
        const isOverlapping = (start < bookingend) && (bookingstart < end);
        if (isOverlapping) conflict = true;
    });
    
    if (conflict) {
        return res.status(409).json({ message: "Car is not available for the selected dates." });
    }
    
    const newBooking = { 
        carId, 
        userId, 
        startDate: Timestamp.fromDate(start), 
        endDate: Timestamp.fromDate(end), 
        createdAt: Timestamp.now(), 
        status: "confirmed" 
    };

    const docRef = await database.collection('bookings').add(newBooking);
    res.status(201).json({ message: "Booking successful!", bookingId: docRef.id });
});






// admin


RS.post('/api/cars', async (req, res) => {
    const { make, model, year, rate, image, available } = req.body;
    const newCar = { make, model, year, rate, image, available};
    const docRef = await database.collection('cars').add(newCar);
    res.status(201).json({ id: docRef.id, ...newCar });
});

RS.put('/api/cars/:id', async (req, res) => {
    const { id } = req.params;
    const carData = req.body;
    const carRef = database.collection('cars').doc(id);
    await carRef.update(carData);
    res.status(200).json({ message: `Car ${id} updated successfully.` });
});
RS.delete('/api/cars/:id', async (req, res) => {
    const { id } = req.params;
    await database.collection('cars').doc(id).delete();
    res.status(200).json({ message: `Car ${id} deleted successfully.` });
});

// server
RS.listen(PORT, () => {
  console.log(`Server is running on Port 8000`);
});

