import { Alert } from "react-bootstrap";
import { useLoginContext, useShowLoginContext} from "./Context";
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import {useEffect } from "react";
import { logout } from "../backend/api";
import '../CSS/Error.css';

interface PageErrorProps {
    error: Number;
}


export function BackToSite(){
    const {  setLoginInfo } = useLoginContext();
    const { setShowLogin } = useShowLoginContext();

    function setLog() {
       setShowLogin(true);
       setLoginInfo(false);
    }
   
    useEffect(() => {
        async function logOut(){
            setLoginInfo(false);
        } logOut()
    }, [])

    return(<>
    <p>Sie wurden abgemeldet. Bitte Erneut anmelden.</p>
    <LinkContainer to={"/"} >
         <Button onClick={() => { setLog()}}> Zurück auf die Überischt </Button>
         </LinkContainer>
    </> )
}

export default function PageError({ error }: PageErrorProps){

    const {setShowLogin } = useShowLoginContext();
   
    useEffect(() => {
        async function setLog() {
            setShowLogin(false);
            await logout();
        }
       setLog()
    }, [])

    switch(error){
        case 404: return (<>
                         <Alert className="Alert"  variant={'info'}>
                             Seite wurde nicht gefunden (404)
                             <BackToSite/>
                         </Alert> 
                         </>)
        case 403: return (<>
                        <Alert  className="Alert" variant={'info'}>
                                Keine Berechtigung (403)
                            <BackToSite/>
                        </Alert>  </>)
        case 401: return (<><Alert   className="Alert" variant={'info'}>
                             Nicht Autorisiert (401)
                            <BackToSite/>
                         </Alert> </>)
        case 400: return (<><Alert   className="Alert" variant={'info'}>
                          Anfrage war fehlerhaft (400)
                         <BackToSite/>
                         </Alert> </>)
        default: return (<><Alert   className="Alert" variant={'info'}>
                    	    Unbekannter Fehler
                                <BackToSite/>
                         </Alert>
                        </>)
    }
}

