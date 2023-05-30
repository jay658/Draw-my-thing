import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { cleanup, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from '../Routes/Home';
import { renderWithProviders } from './mocks/renderWithProviders';
import userEvent  from '@testing-library/user-event';

// Tests
describe('Renders main page correctly', () => {

    // let axiosSpy:SpyInstance

    const HomeWithRouter = () => 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
        </Routes>
      </BrowserRouter>

    // beforeEach(() => {
    //   axiosSpy = vi.spyOn(axios, 'get').mockImplementation(() => {
    //     return act(async():Promise<{data:string}> => {
    //       return new Promise((resolve) => {
    //         return resolve({
    //           data:'Hello'
    //         });
    //       });
    //     })
    //   })
    // })

    afterEach(() => {
      cleanup();
      // axiosSpy.mockReset()
    });

    it('Should render the page correctly', () => {
        renderWithProviders(<HomeWithRouter />);
        const h1 = screen.queryByText('Vite + React');

        expect(h1).toBeInTheDocument();
    });

    it('Should show the button count set to 0', () => {
        renderWithProviders(<HomeWithRouter />);
        const button = screen.queryByText('count is 0');

        expect(button).toBeInTheDocument();
    });

    it('Should show the button count set to 3', async () => {
        const user = userEvent.setup();
        renderWithProviders(<HomeWithRouter />);
        const button = screen.queryByText('count is 0');
        
        expect(button).toBeInTheDocument();

        await user.click(button as HTMLElement);
        await user.click(button as HTMLElement);
        await user.click(button as HTMLElement);
        
        expect(button?.innerHTML).toBe('count is 3');
    });

    it('renders the <Test/> component', async() => {
      renderWithProviders(<HomeWithRouter />);
      const serverDataRegex = new RegExp(`test data for test component`, 'i');
      const testComponentText = await screen.findByText(serverDataRegex)
      expect(testComponentText).toBeInTheDocument()
    })

    it('sets the auth user', async () => {
      renderWithProviders(<HomeWithRouter />);

      const serverDataRegex = new RegExp(`test auth user`, 'i');
      
      const serverData = await screen.findByText(serverDataRegex)
      
      expect(serverData).toBeInTheDocument()
    })
});