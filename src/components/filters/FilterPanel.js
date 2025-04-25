import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './FilterPanel.css';

const SPECIALTIES = [
  "General Physician", "Dentist", "Dermatologist", "Paediatrician",
  "Gynaecologist and Obstetrician", "ENT", "Diabetologist", "Cardiologist",
  "Physiotherapist", "Endocrinologist", "Orthopaedic", "Ophthalmologist",
  "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist",
  "Dietitian/Nutritionist", "Psychologist", "Sexologist", "Nephrologist",
  "Neurologist", "Oncologist", "Ayurveda", "Homeopath"
];

const specialtyTestIdMap = {
  "General Physician": "General-Physician",
  "Dentist": "Dentist",
  "Dermatologist": "Dermatologist",
  "Paediatrician": "Paediatrician",
  "Gynaecologist and Obstetrician": "Gynaecologist and Obstetrician",
  "ENT": "ENT",
  "Diabetologist": "Diabetologist",
  "Cardiologist": "Cardiologist",
  "Physiotherapist": "Physiotherapist",
  "Endocrinologist": "Endocrinologist",
  "Orthopaedic": "Orthopaedic",
  "Ophthalmologist": "Ophthalmologist",
  "Gastroenterologist": "Gastroenterologist",
  "Pulmonologist": "Pulmonologist",
  "Psychiatrist": "Psychiatrist",
  "Urologist": "Urologist",
  "Dietitian/Nutritionist": "Dietitian-Nutritionist",
  "Psychologist": "Psychologist",
  "Sexologist": "Sexologist",
  "Nephrologist": "Nephrologist",
  "Neurologist": "Neurologist",
  "Oncologist": "Oncologist",
  "Ayurveda": "Ayurveda",
  "Homeopath": "Homeopath"
};

const FilterPanel = ({
  filters,
  onChange,
  specialtySearch,
  setSpecialtySearch
}) => {
  const filteredSpecialties = SPECIALTIES.filter(s =>
    s.toLowerCase().includes((specialtySearch || '').toLowerCase())
  );

  const handleConsultationChange = (type) => {
    onChange({
      ...filters,
      consultationType: type
    });
  };

  const handleSpecialtyChange = (specialty) => {
    let updatedSpecialties = [...filters.specialties];
    if (updatedSpecialties.includes(specialty)) {
      updatedSpecialties = updatedSpecialties.filter(s => s !== specialty);
    } else {
      updatedSpecialties.push(specialty);
    }
    onChange({
      ...filters,
      specialties: updatedSpecialties
    });
  };

  const handleSortChange = (sortOption) => {
    onChange({
      ...filters,
      sortBy: sortOption
    });
  };

  return (
    <div>
      <div className="filter-card">
        <h3 className="filter-section-title" data-testid="filter-header-sort">Sort by</h3>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'fees'}
              onChange={() => handleSortChange('fees')}
              data-testid="sort-fees"
            />
            Price: Low-High
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'experience'}
              onChange={() => handleSortChange('experience')}
              data-testid="sort-experience"
            />
            Experience- Most Experience first
          </label>
        </div>
      </div>

      <div className="filter-card">
        <h3 className="filter-panel-main-title">Filters</h3>

        <div>
          <div className="filter-section-row">
            <h4 className="filter-section-title" data-testid="filter-header-speciality">Specialities</h4>
          </div>
          <div className="specialty-search-bar">
            <FaSearch className="specialty-search-icon" color="black" /> 
            <input
              type="text"
              placeholder="Search"
              className="specialty-search-input"
              value={specialtySearch}
              onChange={e => setSpecialtySearch(e.target.value)}
              tabIndex={0}
            />
          </div>
          <div className="specialty-options" tabIndex={0}>
            {filteredSpecialties.map(specialty => (
              <label key={specialty} className="filter-option">
                <input
                  type="checkbox"
                  checked={filters.specialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                  data-testid={`filter-specialty-${specialtyTestIdMap[specialty]}`}
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="filter-section-row">
            <h4 className="filter-section-title" data-testid="filter-header-moc">Mode of consultation</h4>
          </div>
          <div className="filter-options">
            <label className="filter-option">
              <input
                type="radio"
                name="consultation"
                checked={filters.consultationType === 'video'}
                onChange={() => handleConsultationChange('video')}
                data-testid="filter-video-consult"
              />
              Video Consultation
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="consultation"
                checked={filters.consultationType === 'clinic'}
                onChange={() => handleConsultationChange('clinic')}
                data-testid="filter-in-clinic"
              />
              In-clinic Consultation
            </label>
            <label className="filter-option">
              <input
                type="radio"
                name="consultation"
                checked={filters.consultationType === ''}
                onChange={() => handleConsultationChange('')}
              />
              All
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
