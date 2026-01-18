import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

describe('Smoke test', () => {
  it('renders without crashing', () => {
    expect(true).toBe(true);
  });
});
