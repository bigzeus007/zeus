import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { db } from '@/firebase';
import { collection, getDocs } from "firebase/firestore";   

/
// define a function to fetch the cars data from firestore database
const fetchCarsData = async (setCarsData) => {
  const carsCollection = await getDocs(collection(db, "cars"));
  carsCollection.forEach((snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCarsData(data);
  });
};

// define the CarCard component
const CarCard = ({ car }) => {
  const [availability, setAvailability] = useState(car.availability);

  const handleAvailabilityChange = (event) => {
    const newAvailability = event.target.value;
    setAvailability(newAvailability);
    const carsCollection = firebase.firestore().collection('cars');
    carsCollection.doc(car.id).update({ availability: newAvailability });
  };

  return (
    <div className="car-card">
      <img src={car.image} alt={car.id} />
      <p>
        Availability:
        <select value={availability} onChange={handleAvailabilityChange}>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </p>
    </div>
  );
};

// define the ParcSav component
const ParcSav = () => {
  const [carsData, setCarsData] = useState([]);

  useEffect(() => {
    fetchCarsData(setCarsData);
  }, []);

  const handleAddCar = async () => {
    const carsCollection = await getDocs(collection(db, "cars"));
    await carsCollection.add({ image: 'car-image-url', availability: 'available' });
  };

  return (
    <div className="home-page">
      <h1>Car Inventory</h1>
      <div className="car-cards">
        {carsData.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      <button onClick={handleAddCar}>Add New Car</button>
    </div>
  );
};

export default ParcSav;