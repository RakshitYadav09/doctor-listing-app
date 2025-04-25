import React from 'react';
import { FaMapMarkerAlt, FaHospitalAlt } from "react-icons/fa";
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  if (!doctor) {
    return <div className="doctor-card-loading">Loading...</div>;
  }

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-card-left">
        <div className="doctor-avatar">
          <img
            src={doctor.photo || 'https://via.placeholder.com/80'}
            alt={doctor.name}
            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/80'; }}
          />
        </div>
        <div className="doctor-details">
          <h2 data-testid="doctor-name">{doctor.name}</h2>
          <div data-testid="doctor-specialty" className="doctor-specialty">
            {doctor.specialties && doctor.specialties.length > 0
              ? doctor.specialties.join(', ')
              : 'General Physician'}
          </div>
          <div data-testid="doctor-experience" className="doctor-experience">{doctor.experienceText || doctor.experience || '0 yrs exp.'}</div>
          <div className="doctor-clinic-row">
            <span className="doctor-clinic-icon"><FaHospitalAlt size={15} /></span>
            <span className="doctor-clinic">{doctor.clinic || doctor.clinic?.name || ''}</span>
          </div>
          <div className="doctor-location-row">
            <span className="doctor-location-icon"><FaMapMarkerAlt size={15} /></span>
            <span className="doctor-location">{doctor.location || doctor.clinic?.address?.locality || ''}</span>
          </div>
        </div>
      </div>
      <div className="doctor-card-right">
        <div className="doctor-fee" data-testid="doctor-fee">₹ {doctor.fees}</div>
        <button className="book-button">Book Appointment</button>
      </div>
    </div>
  );
};

export default DoctorCard;
