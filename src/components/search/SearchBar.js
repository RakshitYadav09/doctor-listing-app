import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearch, doctors }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Hide suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Multi-field search: name, specialties, clinic, symptoms
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const searchLower = value.toLowerCase();
      const matchedDoctors = doctors
        .filter(doctor => {
          // Name search
          const nameMatch = doctor.name && doctor.name.toLowerCase().includes(searchLower);

          // Specialties search (array of strings)
          const specialtiesMatch = doctor.specialties &&
            doctor.specialties.some(s => s.toLowerCase().includes(searchLower));

          // Clinic search (string or object)
          const clinicMatch = doctor.clinic &&
            (typeof doctor.clinic === 'string'
              ? doctor.clinic.toLowerCase().includes(searchLower)
              : doctor.clinic.name && doctor.clinic.name.toLowerCase().includes(searchLower));

          // Symptoms search (array of strings)
          const symptomsMatch = doctor.symptoms &&
            Array.isArray(doctor.symptoms) &&
            doctor.symptoms.some(s => s.toLowerCase().includes(searchLower));

          return nameMatch || specialtiesMatch || clinicMatch || symptomsMatch;
        })
        .slice(0, 3);

      setSuggestions(matchedDoctors);
      setShowSuggestions(matchedDoctors.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (doctorName) => {
    setInputValue(doctorName);
    onSearch(doctorName);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    setShowSuggestions(false);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          data-testid="autocomplete-input"
          className="search-input"
          onFocus={() => inputValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button" tabIndex={-1}>
          <FaSearch className="search-icon" />
        </button>
      </form>

      {showSuggestions && (
        <div className="suggestions-dropdown" ref={suggestionRef}>
          {suggestions.map((doctor, index) => (
            <div
              key={index}
              className="suggestion-item"
              data-testid="suggestion-item"
              onClick={() => handleSuggestionClick(doctor.name)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', cursor: 'pointer' }}
            >
              <img
                src={doctor.photo || 'https://via.placeholder.com/36'}
                alt={doctor.name}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid #e0e0e0',
                  background: '#f5f5f5',
                  flexShrink: 0
                }}
              />
              <div>
                <div className="suggestion-name" style={{ fontWeight: 500 }}>{doctor.name}</div>
                <div className="suggestion-specialty" style={{ fontSize: 13, color: '#888' }}>
                  {doctor.specialties && doctor.specialties.length > 0
                    ? doctor.specialties.join(', ')
                    : 'General Physician'}
                </div>
                {doctor.clinic && (
                  <div className="suggestion-clinic" style={{ fontSize: 12, color: '#bbb' }}>
                    {typeof doctor.clinic === 'string'
                      ? doctor.clinic
                      : doctor.clinic.name}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
