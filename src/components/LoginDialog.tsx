import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import {  getLogin } from "../backend/api";
import { LoginResource } from "../Resources";
import { LoginInfo, useLoginContext } from "./Context";


export function getData(data : (LoginResource | false)): LoginInfo | false{
  
  if(data === false){
    return false;
  }
  return{ userId: data.id };
}
export interface Role{
  role: "a" | "u";
}



export default function LoginDialog(props: {isOpen:boolean, setLogin:(value: boolean) => void}){

    const [show, setShow] = useState(props.isOpen); //Für das login dialog
    const [alert, setAlert] = useState({ show: false, message: "" }); //Wenn Benutzername oder so falsch ist soll man das machen
    const handleClose = () => props.setLogin(false);
    const [name, setName] = useState( "" ); // UseState für Name
    const [password, setPassword] = useState( "" ); //UseState für Password
    const { loginInfo, setLoginInfo } = useLoginContext();



    async function load(name:string, password:string) {
      try{
  
        const loginRes = await getLogin(name, password);
        const a = getData(loginRes);
        setLoginInfo(a)
        setShow(false);
      } catch(err){
        setAlert({
          show: true,
          message: "Fehler beim Login. Bitte überprüfen Sie Ihre Anmeldedaten."
        });
      }
    } 

    return(
        <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        >
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
              <form >
                <div className="SimpleFormDemo">
                  <label>
                         Name:
                        <input type="text" name="Name" value={name} onChange={e => setName(e.target.value)} />
                  </label>
                  <label>
                         Passwort:
                        <input type="password" name="Passwort" value={password} onChange={e => setPassword(e.target.value)}/>
                  </label>
                </div>
                </form>
        </Modal.Body>
        {alert.show && <Alert variant="danger">{alert.message}</Alert>}
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
          Abbrechen
          </Button>
          <Button variant="primary" onClick = {() => load(name, password)}>OK</Button>
        </Modal.Footer>
    
      </Modal>
    )
}