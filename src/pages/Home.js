import React, { useState, useEffect } from 'react';
import axios from '../api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    date: ''
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await axios.get('/api/events');
    setEvents(res.data);
  };

  const handleChange = (e) =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get('/api/events/search', { params: filters });
    setEvents(res.data);
  };

  const handleBook = async (eventId) => {
    const tickets = prompt('How many tickets?');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) return alert('Please log in first.');

    try {
      const res = await axios.post('/api/bookings', {
        user_id: user.id,
        event_id: eventId,
        tickets: parseInt(tickets),
      });

      alert(res.data.message);
      loadEvents(); // refresh ticket count
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <h2>Search Events</h2>
      <form onSubmit={handleSearch}>
        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          onChange={handleChange}
        />
        <button type="submit">Search</button>
      </form>

      <h2>Upcoming Events</h2>
      <div>
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}
          >
            <h3>{evt.title}</h3>
            <p><strong>Date:</strong> {evt.date} @ {evt.time}</p>
            <p><strong>Location:</strong> {evt.location}</p>
            <p><strong>Category:</strong> {evt.category}</p>
            <p>{evt.description}</p>
            <p>Tickets Available: {evt.available_tickets}</p>
            <button onClick={() => handleBook(evt.id)}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
