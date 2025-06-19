import React, { useEffect, useState } from 'react';
import axios from '../api';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    location: '', category: '', available_tickets: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get('/api/events');
    setEvents(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('/api/events', form);
    alert('Event added!');
    setForm({ title: '', description: '', date: '', time: '', location: '', category: '', available_tickets: '' });
    fetchEvents();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    }
  };

  return (
    <div>
      <h2>Admin Panel - Manage Events</h2>
      <form onSubmit={handleAdd}>
        <input name="title" placeholder="Title" onChange={handleChange} value={form.title} required />
        <input name="description" placeholder="Description" onChange={handleChange} value={form.description} required />
        <input type="date" name="date" onChange={handleChange} value={form.date} required />
        <input type="time" name="time" onChange={handleChange} value={form.time} required />
        <input name="location" placeholder="Location" onChange={handleChange} value={form.location} required />
        <input name="category" placeholder="Category" onChange={handleChange} value={form.category} required />
        <input name="available_tickets" placeholder="Tickets" type="number" onChange={handleChange} value={form.available_tickets} required />
        <button type="submit">Add Event</button>
      </form>

      <h3>Existing Events</h3>
      {events.map(event => (
        <div key={event.id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
          <h4>{event.title}</h4>
          <p>{event.description}</p>
          <p>{event.date} at {event.time} | {event.location}</p>
          <p>Category: {event.category}</p>
          <p>Tickets: {event.available_tickets}</p>
          <button onClick={() => handleDelete(event.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
