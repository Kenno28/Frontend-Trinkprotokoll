import { useParams } from "react-router-dom"
import PageError from "./Error";
import { useLoginContext } from "./Context";

export default function  PagePrefs(){
    const { loginInfo} = useLoginContext();


    if(!loginInfo){
        return (<PageError error={403}/>)
    }

    return(
    <div>
        PagePrefs
    </div>
    )
}