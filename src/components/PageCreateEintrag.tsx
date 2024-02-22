import { ChangeEvent, useEffect, useState } from "react"
import { EintragResource } from "../Resources"
import { createEitnrag } from "../backend/api"
import { LinkContainer } from "react-router-bootstrap";
import { Button } from "react-bootstrap";
import { useLoginContext } from "./Context";
import { useParams } from "react-router-dom";

type ValidationMessages<Type> = {
    [Property in keyof Type]?: string;
};


export default function PageCreateEintrag(){

    
    const params = useParams();
    const protokollId = params.protokollId;


    const { loginInfo} = useLoginContext();
 
    const [validationErrors, setValidationErrors] = useState<ValidationMessages<EintragResource>>({}); /// zum Validieren
    const [getEintrag, setEintrag] = useState<EintragResource>({
        getraenk: "",
        menge: 0,
        kommentar: "",
        ersteller: "",
        protokoll: ""
    })

    useEffect(() => {
        if(loginInfo && protokollId){
            setEintrag(prevState => ({
                ...prevState,
                ersteller: loginInfo.userId,
                protokoll: protokollId
            }));
        }
    }, [loginInfo, protokollId]);

   

    async function create(ein: EintragResource){
       try{
        await createEitnrag(ein);
        }catch(e){

       }
    }

    function update(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>){

       return setEintrag({...getEintrag, [e.target.name]: e.target.value});
      
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
                    menge: (0 >= getEintrag?.menge! || getEintrag!.menge >= 1000)
                    ? "Es muss zwischen 0 und 1000 sein!"  : undefined
                }); 
            break;
            case "kommentar": 
            if(getEintrag.kommentar && getEintrag.kommentar?.length > 0){
                setValidationErrors({
                    ...validationErrors,
                    kommentar: 3 > getEintrag.kommentar?.length! || getEintrag.kommentar?.length! > 1000
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



    return(
        <>
        <h1>Eintrag Erstellen</h1>
        
        <form onSubmit={() => create(getEintrag)}>
            <label className="form-label">
                Getränk:
                <input type="text" name="getraenk"  value={getEintrag.getraenk}  onChange={update} onBlur={validate} className={validationErrors.getraenk ? "InputError" : "InputOK"} />
                <small className='ValidatError'>{validationErrors.getraenk}</small>
            </label>
            <label className="form-label">
                Menge:
                <input type="number" name="menge" value={getEintrag.menge}  onChange={update} onBlur={validate} className={validationErrors.menge ? "InputError" : "InputOK"}/> 
                <small className='ValidatError'>{validationErrors.menge}</small>
            </label>
            <label className="form-label">
                Kommentar:
                <input type="text" name="kommentar" value={getEintrag.kommentar}  onChange={update} onBlur={validate} className={validationErrors.kommentar ? "InputError" : "InputOK"}/> 
                <small className='ValidatError'>{validationErrors.kommentar}</small>
            </label>
           
        </form>
        <LinkContainer to={`/protokoll/${protokollId}`}>
        <Button className="But" variant="secondary" >
          Abbrechen
          </Button>
          </LinkContainer>
          
          <LinkContainer to={`/protokoll/${protokollId}`}>
          <Button variant="primary" className="But" onClick = {() => create(getEintrag!)}>Speichern</Button>
          </LinkContainer>
      
        </>
        )
    
}