import {  useParams } from "react-router-dom"
import { EintragResource, ProtokollResource } from "../Resources";
import { ChangeEvent, useEffect, useState } from "react";
import { deleteProtokollAPI, getAlleEintraege,  getProtokoll, updateProtokollAPI } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import { Alert, Button, Card, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../CSS/PageProtokoll.css';
import  PageError, { BackToSite } from "./Error";
import { useLoginContext, useProtokollContext } from "./Context";
import PageCreateEintrag from "./PageCreateEintrag";
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions (Regex)
export let isPublic: boolean = false; // Diesen Wert übergeben wir PageEintrag, damit wir wissen, ob das dazueghörige Protokoll öffentlich ist.

type ValidationMessages<Type> = {
    [Property in keyof Type]?: string;
};

export default function PageProtokoll(){

    const params = useParams();
    const protokollId = params.protokollId;
   
    const [myEntries, setMyEntries] =  useState<EintragResource[]| null>([]);   
    const [myProtokoll, setMyPro] =  useState<ProtokollResource| null>();   
    const [error, setError] =  useState<Number | undefined>(undefined);//Falls der Bentuzer nicht berechtigt ist, dann soll ein Fehler geworfen werden
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [ showCard, setShowCard] = useState(true);
    const [protokoll, setProtokoll] = useState<ProtokollResource>({
        patient: '',
        datum: '',
        public: false,
        closed: false,
        ersteller: '',
        gesamtMenge: 0,
    });
    const [ isDelete, setIsDelete] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationMessages<ProtokollResource>>({});
    const [ refresh, setRefresh] = useState(false);

    async function deleteProtokoll(id: string){
        try{
            await deleteProtokollAPI(id);

        } catch(e){

        }
    }

    async function edit(){
        if(loginInfo){
        setShowCard(false);
        setProtokoll({...protokoll, id: myProtokoll!.id, ersteller: loginInfo.userId});
        if(!showCard){
            try{
                const a = await updateProtokollAPI(protokoll);

                if(a){
                    setMyPro(a);
                }
                setShowCard(true)
            }catch{

            }
        }

        }
      
    }
    
    useEffect(() => { async function load() {
        try{   
        
        const a = await getProtokoll(protokollId!);
        setMyPro(a);
        if(a.public){
         isPublic = a.public;
        }
        const c = await getAlleEintraege(protokollId!);
        if(!refresh){
            setRefresh(true);
        } 
        
        setMyEntries(c);
        setProtokoll(a);
        } 
        catch(error){
            
            if (error instanceof Error){ 
                
                const err = error.message.match(/\b\d{3}\b/)// \b = Postion zwischen einem Wortzeichen und Nicht-Wortzeichen, \d = nur Zahlen
                const errToNo: number = err ? Number.parseInt(err?.[0]!): NaN;

                if(isNaN(errToNo)){
                    setError(500);
                }else{
                    setError(errToNo); //Hier setzen wir den Fehler
                }
                
               

            }
        }
   
    } load()}, [refresh]);

    function validate(e: React.FocusEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case "patient": 
                let isValidName = e.target.value.length > 3;
                setValidationErrors({
                ...validationErrors,
                    patient: (!isValidName)
                    ? "Der Name des Patients muss mindestens 3 Buchstaben haben." : undefined
              }); 
            break;
        }


        
    }

    

    
    function update(e: ChangeEvent<HTMLInputElement>){
        if(e.target.name === "datum"){
           const dateValue = new Date(e.target.value);
           return setProtokoll({...protokoll, [e.target.name]: dateValue.toString()});
        }

        if(e.target.type === "text" && e.target.value === ""){
            return setProtokoll({ ...protokoll, [e.target.name]: e.target.placeholder})
        }

        if(e.target.type === "checkbox"){
            console.log("CHECKBOX: ", e.target.checked)
        
           return setProtokoll({ ...protokoll, [e.target.name]: e.target.checked});
        }
    
   
       return setProtokoll({...protokoll, [e.target.name]: e.target.value});
    }

    if(error){//Hier wird der Fehler geworfen
        return <PageError error={error}/>
    }

    if (!myProtokoll || !myEntries) {
        return <LoadingIndicator/>
    } else{

        let isOwner;
        if(loginInfo){
            isOwner = loginInfo.userId === myProtokoll.ersteller;
        }

        return (
            (   
                <div className="Page">
                    <div className="pro">
                     <Card style={{ width: '18rem' }}> 
                            <Card.Img variant="top" src="/pp.jpg" />
                                <Card.Body>
                                <Card.Title>{myProtokoll?.patient}</Card.Title>
                                  {showCard &&  <Card.Text>
                                      <li> Datum: {myProtokoll?.datum}</li>
                                      <li>  Öffentlich: {myProtokoll?.public ? "Ja" : "Nein"} </li>
                                       <li> Abgeschlossen: {myProtokoll?.closed ? "Ja" : "Nein"} </li>
                                       <li>  Protokoll Ersteller: {myProtokoll?.erstellerName}</li>
                                       <li> zuletzt geändert: {myProtokoll?.updatedAt}</li>
                                       <li>die gesamte Menge: {myProtokoll?.gesamtMenge}</li>
                                     
                                        { loginInfo && isOwner  && ( <>
                                       
                                        <Button className="PageButton" onClick={() => setIsDelete(true)}>Löschen</Button>  
                                  
                                        <Button className="PageButton" onClick={() => edit()}>Editieren</Button>
                                        
                                        <LinkContainer to={`/protokoll/${protokollId}/eintrag/neu`}>
                                        <Button className="PageButton" >Neuer Eintrag</Button> 
                                        </LinkContainer> </>)}
                                        
                                    </Card.Text>}

                                            <Modal
                                            show={isDelete}
                                            backdrop="static"
                                            keyboard={false}
                                            > 
                                            <Modal.Header>
                                                <Modal.Title>Wollen Sie das Protokoll wirklich löschen?</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="ModalButton">
                                            <Button className="ModalButton" onClick={() => setIsDelete(false)}>Abbrechen</Button>
                                            <LinkContainer to={`/`}>
                                            <Button className="ModalButton" onClick={() => deleteProtokoll(myProtokoll.id!)}>OK</Button>
                                            </LinkContainer>
                                            </Modal.Body>
                                          </Modal>

                                    {!showCard && <Card.Text>
                                                                
                                    <form >
                                        <div className="SimpleFormDemo">
                                        <label>
                                                Name:
                                                <input type="text" name="patient"  placeholder={myProtokoll.patient}  onBlur={validate}  onChange={update}/>
                                                <small className="ValError">{validationErrors.patient}</small>
                                        </label>
                                        <label>
                                                Datum:
                                                <input type="date" name="datum" placeholder={myProtokoll.datum} onChange={update}/>
                                        </label>
                                        <label>
                                            öffentlich 
                                            <input type="checkbox" name="public" defaultChecked={myProtokoll.public ? true : false}  onChange={update} />
                                        </label>

                                        <label>
                                            geschlossen 
                                            <input type="checkbox" name="closed" defaultChecked={myProtokoll.closed ? true : false} onChange={update}/>
                                        </label>
                                        </div>

                                    </form>
                                    <Button className="PageButton" onClick={() =>setShowCard(true)}>Abbrechen</Button> 
                                    <Button className="PageButton" onClick={() => edit()}>Speichern</Button> 
                                        </Card.Text>}
                                </Card.Body>
                        </Card> 
                    </div>

                    <div className="entries">    
                        {
                            
                        myEntries.map((myEntry, index) => 
                            <div className="Te" key={myEntry.id}>
                                <p>Eintrag {index + 1}</p>
                                 
                                        <p>Getränk: {myEntry.getraenk}</p>
                                        <p>Menge: {myEntry.menge}</p>
                                        <p>Kommentar: {myEntry.kommentar}</p>
                                        <p>erstellerName: {myEntry.erstellerName}</p>
                                        <p>Erstellt am: {myEntry.createdAt}</p>
                                            <LinkContainer to={`/eintrag/${myEntry.id}`}>
                                                <Button size="sm" as="input" type="button" value="Details" />
                                            </LinkContainer>
                            </div>
                        )
                        }
                    </div>
                </div>
            )
        )
    }
    
}