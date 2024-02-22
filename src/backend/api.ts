// istanbul ignore file -- no coverage, since we would need a running backend for that

import { EintragResource, LoginResource, ProtokollResource } from "../Resources";
import { fetchWithErrorHandling } from "./fetchWithErrorHandling";


export let roleOfUser: String ; //Rolle von User


export async function getAlleProtokolle(): Promise<ProtokollResource[]> {

        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/alle`;
        const response = await fetchWithErrorHandling(url,{
        credentials: 'include' as RequestCredentials,
        headers:{
                Accept: "application/json",
                "Content-Type": "application/json"
        } })
        return await response.json();
    
}

export async function getAlleEintraege(protokollId: string): Promise<EintragResource[]> {
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/${protokollId}/eintraege`;
        const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
        return await response.json();
    
}

export async function getProtokoll(protokollId: string): Promise<ProtokollResource> {
   
  
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/${protokollId}`;
        const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
        return await response.json();
    
}

export async function getEintrag(eintragID: string): Promise<EintragResource> {
   

        const url = process.env.REACT_APP_API_SERVER_URL + `/api/eintrag/${eintragID}`;
        const response = await fetchWithErrorHandling(url,{credentials: 'include' as RequestCredentials})
        
        return await response.json();
}

export async function getLogin(name:String, password:String): Promise<LoginResource | false>{
   
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/login/`;
        const response = await fetchWithErrorHandling(url,{
                method: "POST",
                body: JSON.stringify({name, password}),
                credentials: "include" as RequestCredentials,
                headers:{
                        Accept: "application/json",
                        "Content-Type": "application/json"
                } 
        })
        const responseData = await response.json();
        
        if(responseData){
                roleOfUser = responseData.role;
        }
   
        return responseData;
}

export async function checkLoginStatus(): Promise<LoginResource | false> {
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/login/`;
        const response = await fetchWithErrorHandling(url, {
            credentials: 'include' as RequestCredentials,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        const responseData = await response.json();

        if(responseData){
                roleOfUser = responseData.role;
        }
       
        return responseData;
}

export async function logout() {
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/login/`;

        await fetchWithErrorHandling(url, {
             method: "DELETE",
            credentials: 'include' as RequestCredentials
        });
}


export async function createProtokollAPI(protokoll: ProtokollResource, id: String): Promise<ProtokollResource>{
    
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/`;
        const response = await fetchWithErrorHandling(url, {
                method: "POST",
            credentials: 'include' as RequestCredentials,
            body:JSON.stringify({patient: protokoll.patient, datum: protokoll.datum, ersteller: id, public: protokoll.public, closed: protokoll.closed}),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });
        const responseData = await response.json();

       
        return responseData;
}

export async function deleteProtokollAPI(protokollID:string){

        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/${protokollID}`;
        const response = await fetchWithErrorHandling(url, {
                method: "DELETE",
            credentials: 'include' as RequestCredentials
        })
        
        return response.status;
}


export async function updateProtokollAPI(pro:ProtokollResource): Promise<ProtokollResource>{
        
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/protokoll/${pro.id}`;
        const response = await fetchWithErrorHandling(url, {
                method: "PUT",
                body: JSON.stringify({id: pro.id, patient: pro.patient, datum: pro.datum, public: pro.public, closed: pro.closed, ersteller: pro.ersteller}),
                credentials: 'include' as RequestCredentials,
                headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                }
        })
        
        return await response.json();
}

export async function createEitnrag(ein: EintragResource): Promise<EintragResource>{
        
    
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/eintrag/`;
        const response = await fetchWithErrorHandling(url, {
                method: "POST",
                body: JSON.stringify(ein),
                credentials: 'include' as RequestCredentials,
                headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                }
        })
        
        return await response.json();
}

export async function deleteEitnrag(eintragString: String){
        
    
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/eintrag/${eintragString}`;
        const response = await fetchWithErrorHandling(url, {
                method: "DELETE",
                credentials: 'include' as RequestCredentials,
        })
        
        return response.status;
}

export async function updateEintragAPI(ein:EintragResource): Promise<EintragResource>{
        
      
        const url = process.env.REACT_APP_API_SERVER_URL + `/api/eintrag/${ein.id}`;
        const response = await fetchWithErrorHandling(url, {
                method: "PUT",
                body: JSON.stringify(ein),
                credentials: 'include' as RequestCredentials,
                headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                }
        })
        
        return await response.json();
}