import React from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor }) => {
  if (!doctor) {
    return <div className="doctor-card-loading">Loading...</div>;
  }

  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-info">
        <div className="doctor-avatar">
          <img 
            src={doctor.photo || 'https://via.placeholder.com/80'} 
            alt={doctor.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
        </div>
        <div className="doctor-details">
          <h2 data-testid="doctor-name">{doctor.name}</h2>
          <p className="doctor-qualification">{doctor.qualification || doctor.doctor_introduction || ''}</p>
          <p data-testid="doctor-specialty">
            {doctor.specialties && doctor.specialties.length > 0 
              ? doctor.specialties.join(', ') 
              : (doctor.specialities && doctor.specialities.length > 0
                ? doctor.specialities.map(s => s.name).join(', ')
                : 'General Physician')}
          </p>
          <p data-testid="doctor-experience">{doctor.experienceText || doctor.experience || '0 yrs exp.'}</p>
          <p className="doctor-location">{doctor.location || (doctor.clinic && doctor.clinic.address && doctor.clinic.address.locality) || ''}</p>
          <p className="doctor-clinic">{doctor.clinic?.name || ''}</p>
        </div>
      </div>
      <div className="doctor-action">
        <div className="doctor-fee" data-testid="doctor-fee">{doctor.fees}</div>
        <button className="book-button">Book Appointment</button>
      </div>
    </div>
  );
};

export default DoctorCard;