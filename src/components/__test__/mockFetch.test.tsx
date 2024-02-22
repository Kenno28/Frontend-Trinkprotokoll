import { getProtokoll } from "../../backend/api";
import { fetchWithErrorHandling } from "../../backend/fetchWithErrorHandling";
import { protokolle } from "../../backend/testdata";
import { mockFetch } from "./mockFetch";

beforeEach(() => {
    mockFetch();
  });

test("Mock Fetch Test Validation Error (Protokolle/Einträge)", async () => {
    const url =  `/api/protokoll/102/eintraege`;
    const response = await fetch(url);
    expect(response.status).toBe(404)
})

/*
test('mockFetch keine richtige id (protokoll)', async () => {
    const a = {};
    const url =  `/api/protokoll/${a}`;
    const response = await fetch(url);
    expect(response.status).toBe(404)
});*/

test('mockFetch keine richtige id (eintrag)', async () => {
    const url =  `/api/eintrag/aaa`;
    const response = await fetch(url);
    expect(response.status).toBe(400)
});
