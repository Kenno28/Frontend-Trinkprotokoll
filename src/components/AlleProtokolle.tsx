import { useEffect, useState } from "react";
import '../CSS/PageIndex.css';
import { getAlleProtokolle } from "../backend/api";
import { ProtokollResource } from "../Resources";
import { LoadingIndicator } from "./LoadingIndicator";
import { Button, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useLoginContext, useProtokollContext } from "./Context";

export default function AlleProtokolle() {
    const [myEntries, setMyEntries] = useState<ProtokollResource[] | null>([]);
    const {loginInfo} = useLoginContext();
    const {getPro, setPro} = useProtokollContext(); 

    async function load() {
     try{
        let c = await getAlleProtokolle();
        setMyEntries(c);
        setPro(c);
     } catch(e){

     }
        console.log("WURDE AUSGELÖST")
    }

    useEffect(() => {
    load(); }, [loginInfo]);

    if (!myEntries) {
        return <LoadingIndicator />
    } else {
        return (
            <ListGroup className="Liste">
            {myEntries.map(myEntry => ( 
                    <ListGroup.Item className="Items" key={myEntry.id}>
                    <h3>{myEntry.patient}</h3>
                    <p>Datum: {myEntry.datum}</p>
                    <p>Public: {myEntry.public ? "true" : "false"}</p>
                    <p>Closed: {myEntry.closed ? "true" : "false"}</p>
                    <p>Ersteller: {myEntry.erstellerName}</p>
                    <p>Zuletzt Bearbeitet: {myEntry.updatedAt}</p>
                    <p>Gesamt Menge: {myEntry.gesamtMenge}</p>

                    <LinkContainer to={`protokoll/${myEntry.id}`}> 
                    <Button size="sm" as="input" type="button" value="Anschauen" className="Butt"/>
                    </LinkContainer>
                    </ListGroup.Item>
            ))}
              </ListGroup> 
        );
    }
}
