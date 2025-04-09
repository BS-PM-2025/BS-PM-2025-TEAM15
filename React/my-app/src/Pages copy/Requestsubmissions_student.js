//Requests Site from students.
import { useEffect, useState } from "react"
import styles from '../App.css';
import Progress from "../Components/Progress";

function Requestsubmissions_student(){
    
    const [quote, setQuote] = useState("");
    const[Subject,setSubject] = useState("");
    const [request_type,setRequest_type] = useState("Medical");
    //to see or not to see the progess bar.
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false); // state to control progress bar visibility

    const handleSubmit = (event) => {
        event.preventDefault();//stops the web from refreshing the page and data automatically.
        alert(request_type);
        console.log(quote);
        setProgress(0);
        setShowProgress(true);
       
    }
   //ProgressBar.
   //useEffect ->
    useEffect (() => {
        
        let interval; //will keep track of the progress bar %.
        if(showProgress){            
            interval = setInterval(() => {
                setProgress(prev =>{
                    if(prev === 100){
                        clearInterval(interval);
                        setTimeout(() =>{                           
                            setShowProgress(false); 
                            setProgress(0);    
                        },500);
                        return 100;
                        
                    }
                    return prev + 5;
                })
            },300);
        }    
    });
    //When the progress is done. 
    useEffect(() => {
        // When progress hits 100, and we haven't shown alert yet
        if (progress === 100 ) {
            setTimeout(() => {
                alert("Request Has been send succesfully!");
                setShowProgress(false);
                setProgress(0);
            }, 300);
        }
    });
  
    return(
    
        
        <div className=".main-content form"  >
        {/* <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </div> */}
        <div className="form-card">
            <form onSubmit={handleSubmit} > 
            <h1 >Personal Requests</h1>
            <br/>
            <br/>
                <h2>Enter a Request Type.
                    <br/>
                <select value={request_type} onChange={e => setRequest_type(e.target.value)}  >
                    <option value="Medical ">Medical Request</option>
                    <option value="financial">financial Request</option>
                </select>
                </h2> 
                <br/>
                <br/>
                <h1>Subject</h1>
                <textarea 
                    placeholder="Your Subject"
                    rows="10" cols="30"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    required
                    />
                <br/>
                <br/>
                <label>Textarea:
                    <br/>
                    <textarea 
                    placeholder="Your Quote"
                    rows="10" cols="30"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    required
                    />
                </label>
                    <br/>
                    <br/>
                    <input type="submit" />
                    <br/>
                    <br/>
                    {showProgress && <Progress progress={progress}  />}

                </form>
            </div>
        </div>
       

    )
}



export default Requestsubmissions_student;
