import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Fuse from 'fuse.js';
import Select from 'react-select';

import interests from './interests';

const InterestsForm = () => {
  const { isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fuseOptions = {
    includeScore: true,
    threshold: 0.3,
    keys: ['label'],
  };

  const fuse = new Fuse(interests.map((interest) => ({ label: interest })), fuseOptions);

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);

    const results = fuse.search(newValue);
    const options = results.map((result) => result.item.label);
    setSearchOptions(options);
  };

  const handleInterestSelection = (selectedOptions) => {
    setSelectedInterests(selectedOptions);
  };

  const handleSubmit = async () => {
    if (isAuthenticated) {
      try {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch('https://xyz.com/interests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ interests: selectedInterests.map((option) => option.value) }),
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          console.error('Error submitting interests.');
        }
      } catch (error) {
        console.error('Error submitting interests:', error);
      }
    }
  };

  const selectOptions = searchOptions.map((option) => ({ value: option, label: option }));

  if (isSubmitted) {
    return (
      <div className="container">
        <header className="header">
          <h1 className="title">Newsletter Website</h1>
          <p className="subtitle">Stay up-to-date with the latest news and trends</p>
        </header>
        <div className="content">
          <p className="success-message">You will receive your weekly newsletter on the weekend.</p>
          <button onClick={() => setIsSubmitted(false)} className="update-button">
            Update Interests
          </button>
        </div>
        <footer className="footer">
          <p>&copy; 2023 Newsletter Website. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Newsletter Website</h1>
        <p className="subtitle">Stay up-to-date with the latest news and trends</p>
      </header>
      <div className="content">
        <p className="description">Select your interests to receive personalized newsletters:</p>
        {isAuthenticated ? (
          <div>
            <Select
              isMulti
              options={selectOptions}
              value={selectedInterests}
              onChange={handleInterestSelection}
              onInputChange={handleSearchChange}
              inputValue={searchValue}
              placeholder="Search interests..."
              className="select-input"
              classNamePrefix="select"
            />
            <button onClick={handleSubmit} className="submit-button">
              Subscribe
            </button>
          </div>
        ) : (
          <button onClick={loginWithRedirect} className="login-button">
            Login with Google
          </button>
        )}
      </div>
      <footer className="footer">
        <p>&copy; 2023 Newsletter Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InterestsForm;
