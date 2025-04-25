import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { fetchDoctors } from './services/apiService';
import { transformDoctorData, getAllSpecialties } from './utils/dataTransformer';
import SearchBar from './components/search/SearchBar';
import FilterPanel from './components/filters/FilterPanel';
import DoctorList from './components/doctors/DoctorList';
import './App.css';


function App() {

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    consultationType: '',
    specialties: [],
    sortBy: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [specialtySearch, setSpecialtySearch] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const getDoctors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDoctors();
        if (data && Array.isArray(data)) {
          const allSpecialties = getAllSpecialties(data);
          setSpecialties(allSpecialties);

          const transformedData = transformDoctorData(data);
          setDoctors(transformedData);
          setFilteredDoctors(transformedData);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDoctors();
  }, []);

  useEffect(() => {
    if (doctors.length === 0) return;

    const params = queryString.parse(location.search);

    const updatedFilters = {
      consultationType: params.consultationType || '',
      specialties: params.specialties ?
        (Array.isArray(params.specialties) ? params.specialties : [params.specialties]) :
        [],
      sortBy: params.sortBy || ''
    };

    setFilters(updatedFilters);
    setSearchTerm(params.search || '');

    applyFilters(updatedFilters, params.search || '', doctors);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, doctors]);

  const applyFilters = (currentFilters, search, doctorsList) => {
    let result = [...doctorsList];

    if (search) {
      result = result.filter(doctor =>
        doctor.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (currentFilters.consultationType) {
      result = result.filter(doctor => {
        if (currentFilters.consultationType === 'video') {
          return doctor.videoConsult;
        } else if (currentFilters.consultationType === 'clinic') {
          return doctor.inClinic;
        }
        return true;
      });
    }

    if (currentFilters.specialties.length > 0) {
      result = result.filter(doctor =>
        currentFilters.specialties.some(specialty =>
          doctor.specialties.includes(specialty)
        )
      );
    }

    if (currentFilters.sortBy) {
      if (currentFilters.sortBy === 'fees') {
        result.sort((a, b) => parseInt(a.fees) - parseInt(b.fees));
      } else if (currentFilters.sortBy === 'experience') {
        result.sort((a, b) => b.experienceYears - a.experienceYears);
      }
    }

    setFilteredDoctors(result);
  };

  const updateUrlParams = (newFilters, search) => {
    const params = { ...newFilters };

    if (search) {
      params.search = search;
    }

    Object.keys(params).forEach(key => {
      if (params[key] === '' ||
        (Array.isArray(params[key]) && params[key].length === 0)) {
        delete params[key];
      }
    });

    navigate({
      pathname: '/',
      search: queryString.stringify(params)
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    updateUrlParams(filters, term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    updateUrlParams(newFilters, searchTerm);
  };

  return (
    <div className="app">
      <header className="app-header">
        <SearchBar
          searchTerm={searchTerm}
          onSearch={handleSearch}
          doctors={doctors}
        />
      </header>
      <main className="app-main">
        <aside className="filter-panel-container">
        <FilterPanel
        filters={filters}
        onChange={handleFilterChange}
        specialties={specialties}
        specialtySearch={specialtySearch}
        setSpecialtySearch={setSpecialtySearch}
      />
        </aside>
        <section className="doctor-list-container">
          {isLoading ? (
            <div className="loading">Loading doctors...</div>
          ) : (
            <DoctorList doctors={filteredDoctors} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
