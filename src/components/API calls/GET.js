import { useState } from 'react';
import { toast } from 'react-toastify';

export const GET = (url) => {
    const [data,setData] = useState()
    const options = {
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        },
        credentials: "include",
        mode: "cors",
    }
    fetch(url, options)
    .then((res) =>  {
          if(!res.ok){
            throw Error(res.statusText)
          }
          return res.json()
    })
    .then((res) => {
        // console.log(res)
        setData(res)
    })
    .catch((err) => {
        if (err.name === "AbortError") {
            console.log("successfully aborted");
        } else {
            toast.error('Error: Failed to insert data', {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              });
          }
    });
    return data
}


    
    
  
