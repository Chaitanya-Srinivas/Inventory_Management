import React, { useState, useEffect } from 'react';
import classes from './Events.module.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import axios from 'axios';
import { getToken, getUserId } from '../components/Auth/AthSG';
import { useNavigate } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [isCreate, setIsCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [token, setToken] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setToken(getToken());
    }, []);

    useEffect(() => {
        fetchEvents();
    }, []);

    const viewDetailsHandler = (eventId) => {
        const selected = events.find(event => event._id === eventId);
        setSelectedEvent(selected);
    }

    const handleEventModal = () => {
        setIsCreate(!isCreate);
    }

    const modalConfirmHandler = async () => {
        if (title.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }
        const event = { title: title, price: +price, date: date, description: description };

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput: {
                        title: "${event.title}",
                        date: "${event.date}",
                        price: ${event.price},
                        description: "${event.description}"
                    }) {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `,
        };

        try {
            const response = await axios.post('http://localhost:4000/graphql', requestBody, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in request headers
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            const responseData = response.data;
            console.log(responseData);
            setIsCreate(false);
            fetchEvents(); // Fetch updated events after creating a new one
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const bookEventHandler = async () => {
        if(!token){
            setSelectedEvent(null);
        }
        const requestBody = {
            query: `
                mutation {
                    bookEvent(eventId:"${selectedEvent._id}") {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
        };

        try {
            const response = await axios.post('http://localhost:4000/graphql', requestBody, {
                headers: {
                    Authorization: `Bearer ${token}` // Include token in request headers
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            const responseData = response.data;
            console.log(responseData.data);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const modalCancelHandler = () => {
        setIsCreate(false);
        setSelectedEvent(null);
    }

    const fetchEvents = async () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `,
        };

        try {
            const response = await axios.post('http://localhost:4000/graphql', requestBody);
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            const responseData = response.data;
            console.log(responseData.data.events);
            setEvents(responseData.data.events);
            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <React.Fragment>
            {( isCreate || selectedEvent ) && <Backdrop />}
            {isCreate &&
                <Modal
                    title="Add Event"
                    canCancel
                    canConfirm
                    onCancel={modalCancelHandler}
                    onConfirm={modalConfirmHandler}
                    confirmText='Confirm'
                >
                    <form onSubmit={modalConfirmHandler} className={classes.eventForm}>
                        <div className={classes.eformControl}>
                            <label htmlFor="title">Title</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className={classes.eformControl}>
                            <label htmlFor="price">Price</label>
                            <input
                                type="number"
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className={classes.eformControl}>
                            <label htmlFor="date">Date</label>
                            <input
                                type="datetime-local"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className={classes.eformControl}>
                            <label htmlFor="description">Description</label>
                            <textarea
                                type="text"
                                id="description"
                                rows="4"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </form>
                </Modal>
            }
            {selectedEvent && (<Modal
                title={selectedEvent.title}
                canCancel
                canConfirm
                onCancel={modalCancelHandler}
                onConfirm={token ? bookEventHandler : modalCancelHandler}
                confirmText={token ? 'Book' : 'Confirm'}
            >
                <h1>{selectedEvent.title}</h1>
                <h2>{selectedEvent.price}&nbsp;&nbsp;{new Date(selectedEvent.date).toLocaleDateString()}</h2>
                <p>{selectedEvent.description}</p>
            </Modal>)}
            {token && <div className={classes.eventsControl}>
                <p>Share your own Events!</p>
                <button onClick={handleEventModal}>Create Event</button>
            </div>}
            {isLoading ? 'Loading...' : <ul className={classes.eventsList}>
                {events.map(event => (
                    <li key={event._id} className={classes.eventsListItem}>
                        <div>
                            <h1>{event.title}</h1>
                            <h2>{event.price}/-&nbsp;&nbsp;{new Date(event.date).toLocaleDateString()}</h2>
                        </div>
                        <div>
                            {event.creator._id === getUserId() ? <p>Your are the owner</p> : <button onClick={() => viewDetailsHandler(event._id)}>View Details</button>}
                        </div>
                    </li>
                ))}
            </ul>}
        </React.Fragment>
    );
}

export default Events;
