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

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enhanced multi-field search functionality
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      const searchLower = value.toLowerCase();
      
      // Search across multiple fields
      const matchedDoctors = doctors
        .filter(doctor => {
          // Search in doctor name
          const nameMatch = doctor.name && 
            doctor.name.toLowerCase().includes(searchLower);
          
          // Search in specialties
          const specialtiesMatch = doctor.specialties && 
            doctor.specialties.some(s => s.toLowerCase().includes(searchLower));
          
          // Search in clinic name
          const clinicMatch = doctor.clinic && 
            (typeof doctor.clinic === 'string' 
              ? doctor.clinic.toLowerCase().includes(searchLower)
              : doctor.clinic.name && doctor.clinic.name.toLowerCase().includes(searchLower));
          
          // Search in symptoms (if available)
          const symptomsMatch = doctor.symptoms && 
            Array.isArray(doctor.symptoms) && 
            doctor.symptoms.some(s => s.toLowerCase().includes(searchLower));
          
          return nameMatch || specialtiesMatch || clinicMatch || symptomsMatch;
        })
        .slice(0, 3); // Limit to 3 suggestions
      
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search Symptoms, Doctors, Specialists, Clinics"
          data-testid="autocomplete-input"
          className="search-input"
          onFocus={() => inputValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-button">
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
            >
              <div className="suggestion-item-content">
                <img
                  src={doctor.photo || 'https://via.placeholder.com/36'}
                  alt={doctor.name}
                  className="suggestion-image"
                />
                <div className="suggestion-details">
                  <div className="suggestion-name">{doctor.name}</div>
                  <div className="suggestion-specialty">
                    {doctor.specialties && doctor.specialties.length > 0 
                      ? doctor.specialties.join(', ') 
                      : 'General Physician'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
