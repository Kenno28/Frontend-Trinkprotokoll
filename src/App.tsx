// import './App.css';
import { ErrorBoundary } from 'react-error-boundary';
import { TryCatch } from './components/TryCatch';
import {  Route, Routes } from 'react-router-dom';
import PageIndex from './components/PageIndex';
import PageAdmin from './components/PageAdmin';
import PageProtokoll from './components/PageProtokoll';
import PageEintrag from './components/PageEintrag';
import PagePrefs from './components/PagePrefs';
import Login from './components/Login';
import '../src/CSS/PageIndex.css';
import { useEffect} from 'react';
import React from 'react';
import { LoginContext, LoginInfo, ShowLogin, ProtokollContext } from './components/Context';
import { checkLoginStatus } from './backend/api';
import {  getData } from './components/LoginDialog';
import CreatePageProtokoll from './components/PageCreateProtokoll';
import { ProtokollResource } from './Resources';
import PageCreateEintrag from './components/PageCreateEintrag';
import PageEditEintrag from './components/PageEditEintrag';




/*https://react-cn.github.io/react/tips/if-else-in-JSX.html*/

function App() {

  const [loginInfo, setLoginInfo] = React.useState<LoginInfo | false | undefined>(undefined);
  const [showLogin, setShowLogin ] = React.useState<Boolean | undefined>(true);
  const [getPro, setPro ] = React.useState<ProtokollResource[] | undefined>(undefined);

  async function fetchLoginStatus() {
    try{
      const loginStatus = await checkLoginStatus();
        if (loginStatus) {
          setLoginInfo(getData(loginStatus));
         } 
    } catch{
    
    }  
  }

  useEffect(() => {
    fetchLoginStatus();
  }, []); 
 
  return (
    <>

   
      < ErrorBoundary FallbackComponent={TryCatch}> 
      <LoginContext.Provider value={{ loginInfo, setLoginInfo}}>
        <ShowLogin.Provider value={{showLogin, setShowLogin}}>
          <ProtokollContext.Provider value={{getPro, setPro}}>
            <Login/>
            <h1 className='Header'>Trinkprotokolle</h1>
            <Routes>
            <Route path="*" element={<PageIndex/>}/>
            <Route path="/admin" element={<PageAdmin/>}/>
            <Route path='/protokoll/:protokollId' element={<PageProtokoll/>}/>
            <Route path='/protokoll/neu' element={<CreatePageProtokoll/>}/>
            <Route path="/eintrag/:eintragId" element={<PageEintrag/>}/>
            <Route path="/protokoll/:protokollId/eintrag/neu" element={<PageCreateEintrag/>}/>
            <Route path="/protokoll/:protokollId/eintrag/:mongoId" element={<PageEditEintrag/>}/>
            <Route path="/prefs" element={<PagePrefs/>}/>
            </Routes>
            </ProtokollContext.Provider>
          </ShowLogin.Provider>
      </LoginContext.Provider>
     </ErrorBoundary>
    
    </>
  );

}

export default App;



