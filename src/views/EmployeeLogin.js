import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';
import {URL2,DKEY} from '../constants';
import logo from '../images/PavilionLogo.png';
import banner from '../images/login.jpg'
import "./login.css";
import Dashboard from "./Dashboard";
import Cookies from 'universal-cookie';
import { Select } from "semantic-ui-react";
import setPermissions from "./defineAbility";
import { Can } from "@casl/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation, initReactI18next } from "react-i18next";
import i18next from "i18next";
import { useHistory } from "react-router-dom";

const GlobeIcon = ({width = 20, height = 20}) =>(
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="currentColor" class="bi bi-globe" viewBox="0 0 16 16">
  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.025 7.025 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a6.958 6.958 0 0 0-.656 2.5h2.49zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5H4.847zM8.5 5v2.5h2.99a12.495 12.495 0 0 0-.337-2.5H8.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5H4.51zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5H8.5zM5.145 12c.138.386.295.744.468 1.068.552 1.035 1.218 1.65 1.887 1.855V12H5.145zm.182 2.472a6.696 6.696 0 0 1-.597-.933A9.268 9.268 0 0 1 4.09 12H2.255a7.024 7.024 0 0 0 3.072 2.472zM3.82 11a13.652 13.652 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5H3.82zm6.853 3.472A7.024 7.024 0 0 0 13.745 12H11.91a9.27 9.27 0 0 1-.64 1.539 6.688 6.688 0 0 1-.597.933zM8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855.173-.324.33-.682.468-1.068H8.5zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.65 13.65 0 0 1-.312 2.5zm2.802-3.5a6.959 6.959 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5h2.49zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7.024 7.024 0 0 0-3.072-2.472c.218.284.418.598.597.933zM10.855 4a7.966 7.966 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4h2.355z"/>
</svg>
)

function EmployeeLogin(){
  let history = useHistory(); 
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

  const routeChange = () =>{ 
    let path = `Roles`; 
    history.push(path);
  }

  return (
    <div class="auth-wrapper loginform" >
    <div class="auth-form-wrapper">
      <div class="auth-media">
        
        <img class="card-img-top" src={banner} alt="Card image cap" style={{borderRadius: '20px'}}/>
      </div>
      <div class="auth-form">
        <div class="auth-form-label">
        <img class="card-img-top" src={logo} style={{ maxWidth: "50px"}} alt="Card image cap"/>
          <p class="primary-label" style={{color:'#D79D12'}}>F&M GLOBAL</p>
          
        </div>
        <div class="auth-form-label">
        <p class="primary-label" style={{fontSize:13, color:'#C9C9C9'}}>&#160;</p>
        </div>
      <div style={{paddingLeft: '25px', paddingRight:'25px'}}  >
          <div>
            <input type="text" name="Email" placeholder={t('email_placeholder')} id="Email" className="text" />
          </div>

          <div>
            <input type="password" name="Password" placeholder={t('password_placeholder')} id="Password" class="password"/>
          </div>
          <div>
          {/* <select class="select" name="company" id="Company">
              <option disabled selected value> -- select a company -- </option>
              {this.state.companies.map((company) => 
                                               <option key={company.id } value={company.id}>   
                                                      {  company.name}
                                               </option>
                                              )}
              
          </select> */}
          </div>
          <div style={{marginTop:'10px'}}>
          <button class="button loginbutton"  onClick={routeChange} >
                        {/* {
                            this.state.show_loading  &&
                            <div style={{display:'inline-block',paddingRight:'5px'}}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/><span className="sr-only">Loading...</span></div>
                        }  */}
                        {t('sign_in')}
         </button>
          </div>
        </div> 
      </div>
      
    </div>
    <div style={{display:'flex', justifyContent:'flex-end'}}>

      {/* <select class="form-control" name="lng" id="lng" style={{width:'50px', textAlign:'center'}} onChange={()=>i18next.changeLanguage(document.getElementById('lng').value)} defaultValue={currentLanguageCode}> */}
        {/* <option disabled selected value> -- select an option -- </option> */}
        {/* {languages.map((language) =>
          <option key={language.code} value={language.code} >
            {language.code}
          </option>
        )}
      </select> */}
      <span onClick={()=>i18next.changeLanguage(currentLanguageCode==='en' ? 'ar' : 'en')} style={{cursor:'pointer', color:'#D79D12'}}> {t('language')} <GlobeIcon  /></span>
     
    
      </div>
    <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                // style={{marginLeft:'6%'}}
                />
  </div>
  
  );
}

// class EmployeeLogin extends React.Component {

//   constructor(props) {
//     super(props);
//     const  t = useTranslation()
//     this.state = {
//         companies: [],
//         name: null,
//         data: [],
//         per: 3,
//         page: 1,
//         num_rows:1,
//         show_loading:false,
//         hide_form:false,
//         ability: null,

//       };
//       localStorage.removeItem('Email');
//       localStorage.removeItem('Token');
  
//       localStorage.removeItem('ID');
//       localStorage.removeItem('is_logged');
//       localStorage.removeItem('side_menu');

//       localStorage.removeItem('permissions');
//       localStorage.removeItem('state');
//       localStorage.removeItem('username');
//       localStorage.removeItem('company');
//       localStorage.removeItem('user_id');
//       localStorage.removeItem('Name');
//       localStorage.removeItem('Type');
//     this.handleSubmit = this.handleSubmit.bind(this);
//  }

//  async componentDidMount(){
//   // fetch(URL2+'company',{
//   //   headers : { 
//   //     'Content-Type': 'application/json',
//   //     'Accept': 'application/json',
//   //     // 'access_token' : json.access_token
//   //    },
//   //    credentials: 'include'
//   // }).then(response => response.json())
//   // .then((json)=>{
//   //   console.log(json)
//   //   this.setState({
//   //     companies: json
//   //   })
//   // })
//  }

//   async handleSubmit(event) {
//     event.preventDefault();
//     this.setState({ show_loading: true}); 
//     const cookies = new Cookies();
  
    
//     var email=document.getElementById("Email").value;
//     var password=document.getElementById("Password").value;
//     // var company=document.getElementById("Company").value;

//     await fetch(URL2+'login', {
//       headers : { 
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//        },
//        credentials: 'include',
//       method: 'POST',
//       mode: 'cors',
//       body: JSON.stringify({ email: email,
//       password: password })
//     }).then(response => response.json())
//     .then((json) => {
//       if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) { 
//         throw Error(json.statusText)        
//       }
//       else{
//       // console.log(json.message)
//       console.log('login_response', json)
//       if(json.message=='succeess'){

//         localStorage.setItem('user_id',json.id);
//         this.setState({
//           name: json.name
//         })

//         fetch(URL2+'getPermissions',{
//           headers : { 
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',

//            },
//            credentials: 'include'
//         }).then(response => response.json())
//         .then((json)=>{

           
//           if (json.statusCode == 404 || json.statusCode == 401 || json.statusCode == 500 || json.statusCode == 403 || json.statusCode == 400) { 
//             throw Error(json.statusText)        
//           }
//           else{
//             console.log("here",json)
//           // const ability = setPermissions(json);
          
      
//         if(json.modules.length != 0){
//           this.setState({
//             show_loading: false,
//             hide_form:true
//           })
//           var QR_Path = new URL(window.location).pathname;
//           var fixURL= QR_Path.replace(/%20/g,' ');
//           var FinalURL= fixURL.replace(/%22/g,' ');
//           let splitUrl = FinalURL.split("/");
//           console.log("spilit",splitUrl)
//           var CryptoJS = require("crypto-js");
//           var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json.modules), DKEY).toString();

//           //cookies.set('permissions', ciphertext, { path: '/', secure:true} )
//           localStorage.setItem('permissions',ciphertext);
//           localStorage.setItem('UserType','Staff');
//           localStorage.setItem('Name',this.state.name);
//           localStorage.setItem('Email',email);
//           localStorage.setItem('Type',json.user_type);
//           localStorage.setItem('is_logged','1');
//           localStorage.setItem('company',json.company_id);

//           if(splitUrl[1] =='get_value_project'){
//             this.props.history.push(`/Checkin?p=${QR_Path}`);
//           }
//           else if(json.modules[0].name =='Billing'){
//             this.props.history.push("/ViewInvoices");
//           }
  
//           else{
//             this.props.history.push("/"+json.modules[0].name);
//           }

//         }
//         else{
//           toast.info('No Access', {
//             position: "top-center",
//             autoClose: 3000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: false,
//             draggable: true,
//             progress: undefined,
//             });
//           this.setState({
//             show_loading: false,
//             hide_form:true
//           })
          
//         }
//           }
          
          
//         })
//         .catch((e) => {
//           // console.log(e)  
//           toast.error('Something went wrong...', {
//               position: "top-center",
//               autoClose: 3000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: false,
//               draggable: true,
//               progress: undefined,
//               });
//               this.setState({
//                 show_loading: false,
//                 hide_form:true
//               })
//         });
  
        
        
//       }
//       else{
//         toast.info('Invalid Credentials', {
//           position: "top-center",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: false,
//           draggable: true,
//           progress: undefined,
//           });
//         this.setState({
//           show_loading: false,
//           hide_form:true
//         })
//       }
    
//     }
//   }).catch((e) => {
//     // console.log(e)  
//     toast.error('Something went wrong...', {
//         position: "top-center",
//         autoClose: 3000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: false,
//         draggable: true,
//         progress: undefined,
//         });
//   });

// }
  

  
  
  
//   render() {

//   return (

    

//     <div class="auth-wrapper">
//     <div class="auth-form-wrapper">
//       <div class="auth-media">
        
//         <img class="card-img-top" src={banner} alt="Card image cap" style={{borderRadius: '20px'}}/>
//       </div>
//       <div class="auth-form">
//         <div class="auth-form-label">
//         <img class="card-img-top" src={logo} style={{ maxWidth: "50px"}} alt="Card image cap"/>
//           <p class="primary-label">Pavilion Renewables</p>
          
//         </div>
//         <div class="auth-form-label">
//         <p class="primary-label" style={{fontSize:13, color:'#C9C9C9'}}>&#160;</p>
//         </div>
//       <form style={{paddingLeft: '25px', paddingRight:'25px'}} onSubmit={this.handleSubmit}>
//           <div>
//             <input type="text" name="Email" placeholder="Email" id="Email" className="text" />
//           </div>

//           <div>
//             <input type="password" name="Password" placeholder="Password" id="Password" class="password"/>
//           </div>
//           <div>
//           {/* <select class="select" name="company" id="Company">
//               <option disabled selected value> -- select a company -- </option>
//               {this.state.companies.map((company) => 
//                                                <option key={company.id } value={company.id}>   
//                                                       {  company.name}
//                                                </option>
//                                               )}
              
//           </select> */}
//           </div>
//           <div style={{marginTop:'10px'}}>
//           <button class="button" type="submit" >
//                         {
//                             this.state.show_loading  &&
//                             <div style={{display:'inline-block',paddingRight:'5px'}}><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/><span className="sr-only">Loading...</span></div>
//                         } 
//                         SIGN IN 
//          </button>
//           </div>
//         </form> 
//       </div>
//     </div>
//     <div id="snackbar">Invalid Credentials</div>
//     <div id="snackbar2">No Access</div>
//     <ToastContainer
//                 position="top-center"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss={false}
//                 draggable
//                 pauseOnHover={false}
//                 // style={{marginLeft:'6%'}}
//                 />
//   </div>
  
//   );
// }
// } // close for login

export default EmployeeLogin;
