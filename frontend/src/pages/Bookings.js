import React, { useEffect, useState } from 'react';
import { getToken } from '../components/Auth/AthSG';
import axios from 'axios';
import classes from './Bookings.module.css';

const Bookings = () => {
    const [tokenB, setTokenB] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [bookingsB, setBookingsB] = useState([]);

    useEffect(() => {
        const fetchedToken = getToken();
        setTokenB(fetchedToken);
        console.log(fetchedToken)
    }, [bookingsB]);
    

    useEffect(() => {
        fetchBookings();
    }, []);

    const deleteBookingHandler = async (bookingId) => {
        setIsLoading(true);
        const requestBody = {
            query: `
                mutation {
                    cancelBooking(bookingId: "${bookingId}") {
                        _id
                        title
                    }
                }
            `,
        };
    
        try {
            const response = await axios.post('http://localhost:4000/graphql', requestBody, {
                headers: {
                    Authorization: `Bearer ${tokenB}` // Include token in request headers
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            // const responseData = response.data;
            // console.log(responseData.data);
            // Remove cancelled booking from bookingsB state
            setBookingsB(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
            setIsLoading(false);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            setIsLoading(false);
        }
    }
    
    
    const fetchBookings = async () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                        }
                    }
                }
            `,
        };

        try {
            const response = await axios.post('http://localhost:4000/graphql', requestBody, {
                headers: {
                    Authorization: `Bearer ${tokenB}` // Include token in request headers
                }
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error('Failed!');
            }
            const responseData = response.data;
            console.log(responseData.data);
            setBookingsB(responseData.data.bookings); // Update bookings state with fetched data
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setIsLoading(false);
        }
    }

    return (
        <React.Fragment>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className={classes.bookingsList}>
                    {bookingsB.map(booking => (
                        
                        <li key={booking._id} className={classes.bookingsListItem}>
                            <div>{booking.event.title}</div>
                            <div>
                            <button onClick={() => deleteBookingHandler(booking._id)}>Cancel</button>
                        </div>
                        </li>
                    ))}
                </ul>
            )}
        </React.Fragment>
    );
}

export default Bookings;
