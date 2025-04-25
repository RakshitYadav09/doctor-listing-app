export const transformDoctorData = (doctors) => {
    if (!doctors || !Array.isArray(doctors)) return [];
  
    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.name || 'Unknown Doctor',
      photo: doctor.photo || '',
      specialties: doctor.specialities ? doctor.specialities.map(s => s.name) : [],
      fees: doctor.fees?.replace('₹ ', '') || '0',
      feesWithSymbol: doctor.fees || '₹ 0',
      experienceYears: getExperienceYears(doctor.experience),
      experienceText: doctor.experience || '0 Years of experience',
      languages: doctor.languages || [],
      clinic: doctor.clinic?.name || '',
      location: doctor.clinic?.address?.locality || '',
      city: doctor.clinic?.address?.city || '',
      videoConsult: doctor.video_consult || false,
      inClinic: doctor.in_clinic || false,
      qualification: doctor.doctor_introduction || ''
    }));
  };
  
  const getExperienceYears = (experienceStr) => {
    if (!experienceStr) return 0;
    const match = experienceStr.match(/(\d+)\s*Years?/i);
    return match ? parseInt(match[1]) : 0;
  };
  

  export const getAllSpecialties = (doctors) => {
    const specialtiesSet = new Set();
    
    doctors.forEach(doctor => {
      if (doctor.specialities && Array.isArray(doctor.specialities)) {
        doctor.specialities.forEach(specialty => {
          if (specialty.name) {
            specialtiesSet.add(specialty.name);
          }
        });
      }
    });
    
    return Array.from(specialtiesSet).sort();
  };

  export const getSpecialtyTestId = (specialty) => {
    return specialty.replace(/\//g, '-');
  };
  