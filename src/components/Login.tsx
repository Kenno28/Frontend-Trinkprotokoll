import { useEffect, useState } from "react";
import { Button, Container,  Nav,  Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import '../CSS/PageIndex.css';
import LoginDialog, { Role } from "./LoginDialog";
import {  useLoginContext, useShowLoginContext } from "./Context";
import {  logout, roleOfUser } from "../backend/api";





function NavBar( ) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLogin, setLogin] = useState<boolean | undefined>(undefined);
  const [isUserAdmin, setAdmin] = useState(false); //Schauen nach, ob der Bentuzer Admin ist.
  const { loginInfo, setLoginInfo } = useLoginContext();
  const {showLogin } = useShowLoginContext();
 

  async function logOff(){
    await logout();
    setLoginInfo(false);
    setLogin(false);
  }




  useEffect(() => {
    let rol: Role = {role: 'a'};
    async function checkAdmin() {
    if(loginInfo){
        if(!roleOfUser){
          return;
        }  
        if(roleOfUser === rol.role){
              setAdmin(true);
          }else{
            setAdmin(false)
        }
      }
    } checkAdmin()
  }, [loginInfo])



  return (
      <>{ showLogin && 
        <Navbar className="navbar" data-bs-theme="dark">
          <Container className="inh">
            <LinkContainer to="/">
              <Navbar.Brand>Übersicht</Navbar.Brand>
                </LinkContainer>
                <Button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                 <img className="hamburger" src="/hmaburgermenu.png" alt="Menu" />
                </Button>

                <Nav className={`me-auto ${isOpen ? 'open' : ''}`}>
                        {(!loginInfo)  && <Nav.Link onClick={() =>  setLogin(true)}>Login</Nav.Link>} {/*Wenn man nicht eingeloggt ist, soll das hier angezeigt werden. */}
  
                        {isLogin && <LoginDialog isOpen={true} setLogin={setLogin}/>}

                        {loginInfo &&  <LinkContainer to="/">
                         <Nav.Link onClick={logOff}> Logout</Nav.Link>
                         </LinkContainer>
                        } {/*Wenn man eingeloggt ist, soll das hier angezeigt werden. */}

                        {isUserAdmin && loginInfo  && <LinkContainer to="/admin">
                                           <Nav.Link>Admin</Nav.Link>
                                       </LinkContainer> }    {/*Wenn man eingeloggt und Admin ist, soll das hier angezeigt werden. */}
                        {loginInfo && <LinkContainer to="/prefs">
                                         <Nav.Link>Prefs</Nav.Link>  
                                      </LinkContainer>}    {/*Wenn man eingeloggt ist, soll das hier angezeigt werden. */}

                  {loginInfo && <LinkContainer to="/protokoll/neu">
                          <Nav.Link>Neues Protokoll</Nav.Link> 
                        </LinkContainer>} 
                </Nav>
          </Container>
        </Navbar> }
    </>
  );
}
  
export default NavBar;