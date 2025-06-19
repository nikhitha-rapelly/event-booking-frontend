import React, { useEffect, useState } from 'react';
import axios from '../api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const res = await axios.get(`/api/bookings/${user.id}`);
        setBookings(res.data);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <h3>{booking.title}</h3>
            <p>{booking.date} — {booking.location}</p>
            <p>Tickets Booked: {booking.tickets}</p>
            <p>Booked on: {new Date(booking.booking_date).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
