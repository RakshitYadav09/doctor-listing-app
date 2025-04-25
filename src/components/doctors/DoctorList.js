import React from 'react';
import DoctorCard from './DoctorCard';
import './DoctorList.css';

const DoctorList = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return <div className="no-results">No doctors found matching your criteria</div>;
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor, index) => (
        <DoctorCard key={doctor.id || index} doctor={doctor} />
      ))}
    </div>
  );
};

export default DoctorList;
