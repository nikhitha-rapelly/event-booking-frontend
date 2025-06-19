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
        <button onClick={() => handleBook(event.id)}>Book</button>

        <button type="submit">Search</button>
      </form>
    
        
      <h2>Upcoming Events</h2>
      <div>
        {events.map((event) => (
          <div key={event.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
            <h3>{event.title}</h3>
            <p><strong>Date:</strong> {event.date} @ {event.time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p>{event.description}</p>
            <p>Tickets Available: {event.available_tickets}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
