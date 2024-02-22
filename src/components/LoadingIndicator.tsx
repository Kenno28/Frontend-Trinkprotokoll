import { Spinner } from "react-bootstrap";
import '../CSS/PageIndex.css';
export function LoadingIndicator() {
  
  return <div className="Bor">
   <Spinner animation="border" role="status" className="Loading">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
  </div>

}