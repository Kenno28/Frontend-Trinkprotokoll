
import PageError from "./Error";
import { useLoginContext} from "./Context";
import { roleOfUser } from "../backend/api";

export default function  PageAdmin(){
    const { loginInfo, setLoginInfo } = useLoginContext();
 

    if(loginInfo && roleOfUser !== 'a' || !loginInfo){
        return (<PageError error={403}/>)
    }

    return(
    <div>
        PageAdmin
    </div>
    )
}