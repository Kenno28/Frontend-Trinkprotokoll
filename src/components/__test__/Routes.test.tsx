import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';
import { LoginStatus, mockFetch } from './mockFetch';
import AlleProtokolle from '../AlleProtokolle';
import PageIndex from '../PageIndex';
import { TryCatch } from '../TryCatch';
import { fetchWithErrorHandling } from '../../backend/fetchWithErrorHandling';

// Sicherstellen, dass wir mit fetch arbeiten.
// Das fetch wird in beforeEach gemockt.
process.env.REACT_APP_REAL_FETCH = "true";

// 1000 is the default anyway
const MAX_TIMEOUT_FOR_FETCH_TESTS = Number.parseInt(process.env.MAX_TIMEOUT_FOR_FETCH_TESTS || "1000");

function waitForLonger(callback: () => void | Promise<void>) {
    return waitFor(callback, { timeout: MAX_TIMEOUT_FOR_FETCH_TESTS });
}

const orgLog = console.log;
const orgError = console.error;

beforeEach(() => {
    console.log = () => { };
    console.error = () => { };
    mockFetch();
});
afterEach(() => {
    console.log = orgLog;
    console.error = orgError;
});

test('App', async () => {
    render(<MemoryRouter initialEntries={["/"]}>
        <App />
    </MemoryRouter>);

    await waitForLonger(() => {
        const title = screen.getAllByText(/Trinkprotokolle/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
});



test('App', async () => {
    render(<MemoryRouter initialEntries={["/"]}>
        <App />
    </MemoryRouter>);

    await waitForLonger(() => {
        const title = screen.getAllByText(/Castorp/i);
        expect(title.length).toBeGreaterThanOrEqual(2);
    });
});

test('Protokoll 101', async () => {
    render(<MemoryRouter initialEntries={["/protokoll/101"]}>
        <App />
    </MemoryRouter>);
    await waitForLonger(() => {
        const title = screen.getAllByText(/Hans Castorp/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
});

test("Protokoll LoadingIndicator", async () => {
    render(<MemoryRouter initialEntries={["/protokoll/222"]}>
         <App />
        </MemoryRouter>)
    
    await waitForLonger(() => {
        const title = screen.getAllByText(/Loading.../i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
})

test("PageAdmin", async () => {
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

    
    const Admin = screen.getByText(/Admin/i);

    act(()=>{
        fireEvent.click(Admin);
    })

    await waitForLonger(() => {
        const title = screen.getAllByText(/PageAdmin/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
})

test("PagePrefs", async () => {

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

    
    const Admin = screen.getByText(/Prefs/i);

    act(()=>{
        fireEvent.click(Admin);
    })
    
    await waitForLonger(() => {
        const title = screen.getAllByText(/PagePrefs/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
})

test("TryCatch", async () => {

    render(<TryCatch error={new Error()}/>)
    
    await waitForLonger(() => {
        const title = screen.getAllByText(/ACHTUNG!/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
    });
})

test("Page Eintrag", async () => {

    render(<MemoryRouter initialEntries={["/eintrag/201"]}>
    <App />
   </MemoryRouter>)
    
    await waitForLonger(() => {
        const title = screen.getAllByText(/Tee/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
});
})

test("Page Eintrag", async () => {

    render(<MemoryRouter initialEntries={["/eintrag/201"]}>
    <App />
   </MemoryRouter>)
    
    await waitForLonger(() => {
        const title = screen.getAllByText(/Tee/i);
        expect(title.length).toBeGreaterThanOrEqual(1);
});
})

test("Page Eintrag", async () => {
    mockFetch
   await expect(fetchWithErrorHandling("api/protokoll/20a/eintraege")).rejects.toThrow();

})