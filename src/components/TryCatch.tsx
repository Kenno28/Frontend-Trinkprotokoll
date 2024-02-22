"use client";

export function TryCatch({error}: {error: Error}){


      return(
        <div>
            <p>ACHTUNG!</p>
            <pre>{error.stack}</pre>
        </div>
        )  
   
}