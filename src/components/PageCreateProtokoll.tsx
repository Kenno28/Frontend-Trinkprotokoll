import { ChangeEvent, useEffect, useState } from 'react';
import '../CSS/PageCreateProtokoll.css';
import { ProtokollResource } from '../Resources';
import { Button } from 'react-bootstrap';
import { useLoginContext, useProtokollContext } from './Context';
import { createProtokollAPI } from '../backend/api';
import { BackToSite } from './Error';
import { LinkContainer } from 'react-router-bootstrap';

type ValidationMessages<Type> = {
    [Property in keyof Type]?: string;
};

export default function CreatePageProtokoll(){
    const { loginInfo, setLoginInfo } = useLoginContext();

    const [validationErrors, setValidationErrors] = useState<ValidationMessages<ProtokollResource>>({}); /// zum Validieren
    const [isThrow, setThrow] = useState<Boolean>(false); // Nutzen es, um nachzuschauen, ob wir den Fehler in if(getPro) werfen können

    const [boo, setBoolean] = useState<Boolean>(false); /// wenn validieren fehlschlägt dann soll boolean auf false sein
    const {getPro, setPro} = useProtokollContext(); //Zum validieren, ob so ein Protokoll schon gibt

    const [protokoll, setProtokoll] = useState<ProtokollResource>({
        patient: '',
        datum: '',
        public: false,
        closed: false,
        ersteller: '',
        gesamtMenge: 0,
    });



    function update(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        let finalValue;

        if(e.target.name === "datum"){

           const dateValue = new Date(e.target.value);
            setProtokoll({...protokoll, [e.target.name]: dateValue.toString()});
        }

        if(e.target.value === "true"){
            finalValue = true;
        }else if(e.target.value === "false"){
            finalValue = false;
        }

        if(finalValue){
            setProtokoll({...protokoll, [e.target.name]: finalValue});
        }

        setProtokoll({...protokoll, [e.target.name]: e.target.value});
      
    }

    async function createProtokoll(id: String, pro: ProtokollResource){
        try{
           const a = await createProtokollAPI(pro, id);
           if(getPro){
             setPro([...getPro, a])
           }
           
        } catch(e){
            return setValidationErrors({
                ...validationErrors,
                patient: true
                ? "Protokoll für den Patienten existiert schon oder ein anderer Fehler"  : undefined,
                datum: true
                ? "Protokoll für den Patienten existiert schon oder ein anderer Fehler"  : undefined
            }); 
        }
    }

    function validate(e: React.FocusEvent<HTMLInputElement>) {
        switch (e.target.name) {
            case "patient": 
                let isValidName = e.target.value.length > 3;
                setValidationErrors({
                ...validationErrors,
                    patient: (!isValidName)
                    ? "Der Name des Patients muss mindestens 3 Buchstaben sein" : undefined
              }); 
                setBoolean(isValidName);
            break;
            case "datum": 
            let isDate = Date.parse(e.target.value);
            const isNotValidDate = isNaN(isDate);
            setValidationErrors({
                    ...validationErrors,
                    datum: (isNotValidDate)
                    ? "Kein gültiges Datum"  : undefined
                }); 
                console.log(isNotValidDate)
            setBoolean(!isNotValidDate);
            break;
        } 


        if(getPro){

            for (let index = 0; index < getPro!.length; index++) {
                const element = getPro![index];
                let isDate = Date.parse(e.target.value);
                const isNotValidDate = isNaN(isDate);
                let throwError: boolean = false;

                if( (e.target.name === "patient" && e.target.value === element.patient)){
                    setThrow(true);
                } 

                if((e.target.name === "datum" && (!isNotValidDate && (isDate.toString() && element.datum)))){
                    throwError = true
                }

                if(isThrow && throwError){
                    setBoolean(false);
                    return setValidationErrors({
                        ...validationErrors,
                        patient: true
                        ? "Protokoll für den Patienten mit dem Datum existiert schon"  : undefined,
                        datum: true
                        ? "Protokoll für den Patienten mit dem Datum existiert schon"  : undefined
                    }); 
                }
            }

        }
    }
    
    if(loginInfo){
    return(
        <>
        <h1>Protokoll Erstellen</h1>
        
        <form  onSubmit={() => createProtokoll(loginInfo.userId, protokoll)}>
            <label className="form-label">
                Patient
                <input type="text" name="patient" value={protokoll.patient}  onChange={update} onBlur={validate} className={validationErrors.patient ? "InputError" : "InputOK"} />
                <small className='ValidatError'>{validationErrors.patient}</small>
            </label>
            <label className="form-label">
                Datum
                <input type="date" name="datum" value={protokoll.datum}  onChange={update} onBlur={validate} className={validationErrors.datum ? "InputError" : "InputOK"}/> 
                <small className='ValidatError'>{validationErrors.datum}</small>
            </label>
            <label className="form-label">
                    öffentlich
                    <select name="public"  onChange={update}>
                        <option value="-" disabled selected>-</option>
                        <option value="true">Ja</option>
                        <option value="false">Nein</option>
                   </select>

            </label>
            <label className="form-label"  >
                    geschlossen
                    <select name="closed"  onChange={update} > 
                        <option value="-" disabled selected>-</option>
                        <option value="true">Ja</option>
                        <option value="false">Nein</option>
                   </select>
            </label>
        </form>
        <LinkContainer to={"/"}>
        <Button className="But" variant="secondary" >
          Abbrechen
          </Button>
          </LinkContainer>
          <Button variant="primary" className="But" onClick = {() => boo ? createProtokoll(loginInfo.userId, protokoll) : null}>Speichern</Button>
      
        </>
    )
    }   
    

    return <BackToSite/>;
}
