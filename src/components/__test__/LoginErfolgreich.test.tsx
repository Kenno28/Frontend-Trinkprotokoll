import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { LoginStatus, mockFetch } from './mockFetch';


test('Login-Dialog erfolgreich', async () => {
    const loginStatus = new LoginStatus(false, true); // noch nicht eingeloggt, Nutzer kann sich einloggen
    mockFetch(loginStatus); // fetch wird gemockt
    const orgError = console.error;
    try {
        console.error = () => { }

        render(<MemoryRouter initialEntries={["/"]}>
            <App />
        </MemoryRouter>);
    } finally {
        console.error = orgError;
    }

    // Initiale Protokolle sollte geladen sein
    await waitFor(() => { 
        const title = screen.getAllByText(/Castorp/i);
        expect(title.length).toBeGreaterThanOrEqual(2);
    });

    // Login-Button im Menü sollte vorhanden sein
    const loginMenu = await screen.findAllByText(/Login/i);
    expect(loginMenu.length).toBe(1);
    act(()=>{
        loginMenu[0].click();

    })
    
    // Login-Dialog sollte jetzt sichtbar sein
    await waitFor(() => { 
        screen.getByLabelText(/Name/i);
        screen.getByLabelText(/Passwort/i);
        screen.getByText("Abbrechen");
        screen.getByText("OK");
    });
    
    // Login-Dialog ausfüllen und OK klicken
    const name = screen.getByLabelText(/Name/i);
    const password = screen.getByLabelText(/Passwort/i);
    const ok = screen.getByText("OK");
    act(()=>{
        // Mock ignoriert Name und Password
        fireEvent.change(name, { target: { value: "Behrens" } });
        fireEvent.change(password, { target: { value: "12abcAB!" } });
        fireEvent.click(ok);
    })

    expect(loginStatus.isLoggedIn).toBe(true); // Login-Status sollte jetzt eingeloggt sein

    await waitFor(() => { // Login-Dialog sollte jetzt geschlossen sein
        const emailFields = screen.queryAllByLabelText(/Passwort/i);
        expect(emailFields.length).toBe(0);
    });

});
