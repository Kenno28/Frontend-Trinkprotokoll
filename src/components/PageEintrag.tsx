import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EintragResource } from "../Resources";
import { deleteEitnrag, getEintrag, updateEintragAPI } from "../backend/api";
import { LoadingIndicator } from "./LoadingIndicator";
import "../CSS/PageProtokoll.css";
import PageError from "./Error";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Modal } from "react-bootstrap";
import { useLoginContext } from "./Context";



type ValidationMessages<Type> = {
    [Property in keyof Type]?: string;
};

export default function PageEintrag() {
  const params = useParams();
  const eintragID = params.eintragId;

  const { loginInfo, setLoginInfo } = useLoginContext();
  const [validationErrors, setValidationErrors] = useState<ValidationMessages<EintragResource>>({}); /// zum Validieren
  const [myEntries, setMyEntries] = useState<EintragResource | null>();
  const [getMyEintrag, setEintrag] = useState<EintragResource>({
    getraenk: "",
    menge: 0,
    ersteller: "",
    protokoll: ""
});
  const [error, setError] = useState<Number | undefined>(undefined);
  const [getDelete, setDelete] = useState(false);
  const [geEdit, setEdit] = useState(false);
  const [aktuell, setAktuell] = useState(false);

  useEffect(() => {
    async function load() {

      try {
        const c = await getEintrag(eintragID!);

        setMyEntries(c);
      } catch (error) {
        if (error instanceof Error) {
          if (error instanceof Error) {
            const err = error.message.match(/\b\d{3}\b/); // \b = Postion zwischen einem Wortzeichen und Nicht-Wortzeichen, \d = nur Zahlen
            const errToNo: number = err ? Number.parseInt(err?.[0]!) : NaN;

            if (isNaN(errToNo)) {
              setError(500);
            } else {
              setError(errToNo); //Hier setzen wir den Fehler
            }
          }
        }
      }
    }
    load();
  }, []);

  


  useEffect(() => {
    async function refresh(){
        if(geEdit){
            setEintrag(prevState => ({...prevState,
                id: myEntries?.id,
                menge: myEntries!.menge,
                ersteller: myEntries!.ersteller,
                protokoll: myEntries!.protokoll}))
        }
    } refresh();
  }, [geEdit])

  if (error) {
    return <PageError error={error} />;
  }

  async function deleteEintragFunc(Id: string) {
    await deleteEitnrag(Id);
  }

   
  function update(e: ChangeEvent<HTMLInputElement>){
    setAktuell(true);
   return setEintrag({...getMyEintrag, [e.target.name]: e.target.value});
  }

  async function updateEintrag(ein: EintragResource){
    try{
        setEdit(false);
       setMyEntries(await updateEintragAPI(ein));

    } catch(e){

    }
  }

  

  function validate(e: React.FocusEvent<HTMLInputElement>) {
    switch (e.target.name) {
        case "getraenk": 
            let isValidName = e.target.value.length > 3;
            let isValidLength = e.target.value.length < 100;
            setValidationErrors({
            ...validationErrors,
                getraenk: (!isValidName || !isValidLength)
                ? "Der Name des Patients muss mindestens 3 Buchstaben sein" : undefined
          }); 
        break;
        case "menge": 
        setValidationErrors({
                ...validationErrors,
                menge: (0 >= getMyEintrag?.menge! || getMyEintrag!.menge >= 1000)
                ? "Es muss zwischen 0 und 1000 sein!"  : undefined
            }); 
        break;
        case "kommentar": 
        if(getMyEintrag.kommentar && getMyEintrag.kommentar?.length > 0){
            setValidationErrors({
                ...validationErrors,
                kommentar: 3 > getMyEintrag.kommentar?.length! || getMyEintrag.kommentar?.length! > 1000
                ? "Es muss zwischen 3 und 1000 sein!"  : undefined
            }); 
        } else{
            setValidationErrors({
                ...validationErrors,
                kommentar: ""  
            }); 
        }
        break;
    } 
}
    

  if (!myEntries) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="Background">
       {!geEdit &&<> <p>Getränk: {myEntries.getraenk}</p>
        <p>Menge: {myEntries.menge}</p>
        <p>Kommentar: {myEntries.kommentar}</p>
        <p>erstellerName: {myEntries.erstellerName}</p>
        <p>Erstellt am: {myEntries.createdAt}</p>

  
          {loginInfo && loginInfo.userId === myEntries.ersteller && <>
            <Button
        
        
            onClick={() => setDelete(true)}
          >Löschen </Button>

            <Button
          
        
            onClick={() => setEdit(true)}
          >Editieren </Button>
           </> }
        </> }

        {geEdit && <>
        
            <form onSubmit={() => updateEintrag(getMyEintrag)}>
            <label className="form-label">
                Getränk:
                <input type="text" name="getraenk" placeholder={myEntries.getraenk} value={getMyEintrag.getraenk}  onChange={update} onBlur={validate} className={validationErrors.getraenk ? "InputError" : "InputOK"} />
                <small className='ValidatError'>{validationErrors.getraenk}</small>
            </label>
            <label className="form-label">
                Menge:
                <input type="number" name="menge" value={getMyEintrag.menge}  onChange={update} onBlur={validate} className={validationErrors.menge ? "InputError" : "InputOK"}/> 
                <small className='ValidatError'>{validationErrors.menge}</small>
            </label>
            <label className="form-label">
                Kommentar:
                <input type="text" name="kommentar"placeholder={myEntries.kommentar} value={getMyEintrag.kommentar}  onChange={update} onBlur={validate} className={validationErrors.kommentar ? "InputError" : "InputOK"}/> 
                <small className='ValidatError'>{validationErrors.kommentar}</small>
            </label>

            <LinkContainer to={`/eintrag/${myEntries.id}`}>
            <Button
            onClick={() => setEdit(false)}
            > Abbrechen</Button>
            </LinkContainer>

            <Button
            onClick={() => updateEintrag(getMyEintrag)}
            > Speichern </Button>
        </form>
        
        </>}

        <Modal show={getDelete} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>
              Wollen Sie diesen Eintrag wirklich löschen?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="ModalButton">
            <Button className="ModalButton" onClick={() => setDelete(false)}>
              Abbrechen
            </Button>
            <LinkContainer to={`/protokoll/${myEntries.protokoll}`}>
              <Button
                className="ModalButton"
                onClick={() => deleteEintragFunc(myEntries.id!)}
              >
                OK
              </Button>
            </LinkContainer>
          </Modal.Body>
        </Modal>
      </div>

    );
        
  }
}
