import { toast } from 'react-toastify';

export const PUT =  (url, body) => {
    const options = {
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        },
        credentials: "include",
        mode: "cors",
        method: "PUT",
        body: JSON.stringify(body)
    }
    fetch(url, options)
    .then((res) =>  {
          if(!res.ok){
            throw Error(res.statusText)
          }
          return res.json()
    })
    .then((res) => {
        toast.success('Details updated successfully', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    })
    .catch((err) => {
        if (err.name === "AbortError") {
            console.log("successfully aborted");
        } else {
            toast.error('Error: Failed to Update Details', {
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
}


    
    
  
