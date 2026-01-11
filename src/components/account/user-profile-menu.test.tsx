import { render, screen } from '@testing-library/react';
import { UserProfileMenu } from './user-profile-menu';
import React from 'react';

describe('UserProfileMenu', () => {
  it('renders login link when not authenticated', () => {
    render(<UserProfileMenu isAuthenticated={false} />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('renders profile and logout links when authenticated', () => {
    render(<UserProfileMenu isAuthenticated={true} userName="Sudha Reddy" />);
    expect(screen.getByText(/Sudha Reddy/i)).toBeInTheDocument();
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });
});
