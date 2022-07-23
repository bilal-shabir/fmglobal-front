import { useEffect, useState } from "react";
import { toast } from 'react-toastify';


export const  useGetFetch =  (controller, url, errorMessage, successMessage) => {
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
            (res[index]['downpayment']) && (res[index]['downpayment'] = (+res[index]['downpayment']));
            (res[index]['cost']) && (res[index]['cost'] = (+res[index]['cost']));
            if(res[index].contracts){
              res[index]['membership'] = res[index].contracts.length > 0 ? res[index].contracts[0].membership ?  res[index].contracts[0].membership.name : null : null
            }
            if(res[index].contract){
              res[index]['customer'] = res[index].contract.customer  ?   res[index].contract.customer.name : null
              res[index]['customer_cpr'] = res[index].contract.customer  ?   res[index].contract.customer.CPR : null
            }
            res[index]['data'] = res[index]
          }
          setData(res)
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
            else{
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
            
          }
        });
      }
      fetchData();
      return () => controller.abort();
    }, [url,shouldRefetch]);
    
    return [data, refetch ];
  }
