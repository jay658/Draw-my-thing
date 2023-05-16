// Imports
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, screen } from '@testing-library/react';

import App from '../App';
import { renderWithProviders } from './mocks/renderWithProviders';
import userEvent  from '@testing-library/user-event';

// Tests
describe('Renders main page correctly', () => {
    /**
     * Resets all renders after each test
     */
    afterEach(() => {
        cleanup();
    });

    /**
     * Passes - shows title correctly
     */
    it('Should render the page correctly', () => {
        // Setup
        renderWithProviders(<App />);
        const h1 = screen.queryByText('Vite + React');

        // Post Expectations
        expect(h1).toBeInTheDocument();
    });

    /**
     * Passes - shows the button count correctly present
     */
    it('Should show the button count set to 0', () => {
        // Setup
        renderWithProviders(<App />);
        const button = screen.queryByText('count is 0');

        // Expectations
        expect(button).toBeInTheDocument();
    });

    /**
     * Passes - clicks the button 3 times and shows the correct count
     */
    it('Should show the button count set to 3', async () => {
        // Setup
        const user = userEvent.setup();
        renderWithProviders(<App />);
        const button = screen.queryByText('count is 0');
        
        // Pre Expectations
        expect(button).toBeInTheDocument();

        // Actions
        await user.click(button as HTMLElement);
        await user.click(button as HTMLElement);
        await user.click(button as HTMLElement);
        
        // Post Expectations
        expect(button?.innerHTML).toBe('count is 3');
    });

    it('renders the <Test/> component', () => {
      renderWithProviders(<App />);
      const testComponentText = screen.queryByText(/store count/i)
      expect(testComponentText).toBeInTheDocument()
    })
});