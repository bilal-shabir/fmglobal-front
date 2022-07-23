import { toast } from 'react-toastify';

export const POST =  async (url, body, errorMessage, successMessage) => {
    let data = null;
    const options = {
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        },
        credentials: "include",
        mode: "cors",
        method: "POST",
        body: JSON.stringify(body)
    }
    await fetch(url, options)
    .then((res) =>  {
          if(!res.ok && res.status!==404){
            throw Error(res.statusText)
          }
          return res.json()
    })
    .then((res) => {
        if(res.statusCode === 404){
            toast.error(res.message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            return null
        }
        if(successMessage){
            toast.success(successMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
        }
        data = res
    })
    .catch((err) => {
        if (err.name === "AbortError") {
            console.log("successfully aborted");
        } else {
            if(errorMessage){
                toast.error(errorMessage, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                });
            }
          }
    });
    return data
}


    
    
  
