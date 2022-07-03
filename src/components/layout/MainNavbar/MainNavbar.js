import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Container, Navbar } from "shards-react";
import { URL2, DKEY } from "../../../constants";
import NavbarSearch from "./NavbarSearch";
import NavbarNav from "./NavbarNav/NavbarNav";
import NavbarToggle from "./NavbarToggle";
import icon from '../../../images/made_in_bahrain.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import renewables from '../../../images/PavilionLogo.png';
import energy from '../../../images/pavilionenergylogo.png';
import agr from '../../../images/pavilionagrlogo.png';
import water from '../../../images/pavilionwaterlogo.png';
import Select from 'react-select';
import '../../../assets/style.css';
import Cookies from "universal-cookie";
import { useTranslation } from "react-i18next";
import i18next from "i18next";

const GlobeIcon = ({width = 20, height = 20}) =>(
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
</svg>
)

const MainNavbar = ({ layout, stickyTop }) => {
  const classes = classNames(
    "main-navbar",
    stickyTop && "sticky-top"
  );
  const {t} = useTranslation()
  const languages = [
    {
      code: 'en',
      name: 'English',
      country_code: 'en'
    },
    {
      code: 'ar',
      name: 'العربية',
      country_code: 'bh',
      dir: 'rtl'
    }
  ]
  const cookies = new Cookies();
  const currentLanguageCode = cookies.get('i18next') || 'en'
  const currentLanguage = languages.find(l => l.code === currentLanguageCode)

  useEffect(() => {
    document.body.dir = currentLanguage.dir || 'ltr'
  },[currentLanguage])

//   const findDefault  = (value) => {
//       var a = company.find(b=>
//         b.value == company_id)
//       return a
//   }
 
 
//  async function changeCompany (event) {
//     console.log(event.value)
//     const c_id = event.value
//     await fetch(URL2+'change-company',{
//       headers : { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',

//        },
//        credentials: 'include',
//        method: 'POST',
//        mode: 'cors',
//        body: JSON.stringify({ company_id: event.value})

//     }).then(response => response.json())
//     .then((json)=>{
//       if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 400 || json.statusCode == 403 ) { 
//         throw Error(json.statusText)        
//       }
//       else{
//         fetch(URL2+'getPermissions',{
//           headers : { 
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',

//            },
//            credentials: 'include'
//         }).then(response => response.json())
//         .then((json)=>{
//           if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 400 || json.statusCode == 403 ) { 
//             throw Error(json.statusText)        
//           }
//           else{
//             // toast.success('company changed succesfully', {
//             //   position: "top-center",
//             //   autoClose: 3000,
//             //   hideProgressBar: false,
//             //   closeOnClick: true,
//             //   pauseOnHover: false,
//             //   draggable: true,
//             //   progress: undefined,
//             //   });
//             console.log(json)
//             localStorage.setItem('company',c_id);
//             localStorage.removeItem('side_menu');
//             var CryptoJS = require("crypto-js");
//             var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json.modules), DKEY).toString();
      
//             localStorage.setItem('permissions',ciphertext);
//             window.location.replace('http://localhost:3001/'+json.modules[0].name);
//           }
    
         
//           // this.props.history.push("/"+);
    
//         })
//         .catch((e) => {
//           document.getElementById("c_name").value= {
//             value: company_id
//           } ;

//           // console.log(e)  
//           toast.warning('No access', {
//               position: "top-center",
//               autoClose: 3000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: false,
//               draggable: true,
//               progress: undefined,
//               });
//         })
//       }
//     })
//     .catch((e) => {
//       document.getElementById("c_name").value= company_id ;
//       // console.log(e)  
//       toast.warning('No access', {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: true,
//           progress: undefined,
//           });
//     })

   
//   }
  
  return (
    <div className={classes} style={{backgroundImage:'linear-gradient(to right, #FFFFFF, #FFFFFF)'}}>
      <div className="p-0">
        
        <Navbar type="light" className="align-items-stretch flex-md-nowrap p-0">
          <NavbarSearch />
          {/* <div style={{padding:'10px'}}>
          {company.length !=0 ? (
           <Select id="c_name" options={company} value={findDefault(company_id)} autosize={true} defaultValue={findDefault(company_id)} onChange={changeCompany} isSearchable={false} />
          ) : (
            <div></div>
          )}
        
        </div> */}
          <NavbarNav />
          {/* <img src={icon} width={50} height={50} style={{borderRadius:'2px', marginTop:'4px'}} ></img> */}
          
          <span  onClick={()=>{
            i18next.changeLanguage(currentLanguageCode==='en' ? 'ar' : 'en')
            // if(currentLanguageCode === 'en' ){
              window.location.reload(false);
            // }
            
          }} style={{cursor:'pointer', marginTop:'13px', color:'#D79D12', padding:'0 15px'}}> {t('language')} <GlobeIcon  /></span>
          <NavbarToggle />
          {/* <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                style={{marginLeft:'6%'}}
                /> */}
        </Navbar>
        
        
      </div>
    </div>
  );
};

MainNavbar.propTypes = {
  /**
   * The layout type where the MainNavbar is used.
   */
  layout: PropTypes.string,
  /**
   * Whether the main navbar is sticky to the top, or not.
   */
  stickyTop: PropTypes.bool
};

MainNavbar.defaultProps = {
  stickyTop: true
};

export default MainNavbar;
