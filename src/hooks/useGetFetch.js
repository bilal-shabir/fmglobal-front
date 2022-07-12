import { useEffect, useState } from "react";
import { toast } from 'react-toastify';


export const  useGetFetch =  (controller, url) => {
    const signal = controller.signal;
    const [data, setData] = useState([]);
    const [shouldRefetch, refetch] = useState({});
    
    useEffect(() => {
      const fetchData = async() => {
        const options = {
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
          mode: "cors",
          signal
        }
        fetch(url, options)
        .then((res) =>  {
          if(!res.ok){
            throw Error(res.statusText)
          }
          return res.json()
        })
        .then((res) => {
          for (let index = 0; index < res.length; index++) {
            res[index]['data'] = res[index]
            
          }
          setData(res)
        })
        .catch((err) => {
          if (err.name === "AbortError") {
            console.log("successfully aborted");
          } else {
            toast.error('Error: Failed to fetch data', {
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
      fetchData();
      return () => controller.abort();
    }, [url,shouldRefetch]);
    
    return [data, refetch ];
  }
