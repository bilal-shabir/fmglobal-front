import React from "react";
import { Page, Text, View, Document, StyleSheet, Image,Font } from '@react-pdf/renderer';
import fonts from '../../fonts/OpenSans-Bold.ttf'
import fontnormal from '../../fonts/OpenSans-Regular.ttf'
import fontitalicbold from '../../fonts/OpenSans-BoldItalic.ttf'
import fontitalic from '../../fonts/OpenSans-Italic.ttf'
import { PDFViewer } from '@react-pdf/renderer';
import {URL2,DKEY} from '../../constants';
import { parse } from "date-fns";
import Cookies from "universal-cookie";
import L from "../../components/components-overview/loader";
import { Container } from "shards-react";
import logo from '../../images/pavilionrenewableslogo.png'
import made_in_bahrain from '../../images/made_in_bahrain.png'
import iso from '../../images/iso.png'



Font.register({ family: 'Segoe UI', src: fonts });
Font.register({ family: 'Segoe UI normal', src: fontnormal });
Font.register({ family: 'Segoe UI italic bold', src: fontitalicbold });
Font.register({ family: 'Segoe UI italic', src: fontitalic });
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Segoe UI',
        marginLeft: '70%', 
        marginTop: '7%',
        fontSize: 30,
        position:'absolute', 
        width:'200px'
    },
    normal:{
        fontFamily: 'Segoe UI normal',
        fontSize: 11,
    },
    bill_no:{
        fontFamily: 'Segoe UI',
        fontSize: 11,
        marginTop: '2px', width:'180px',paddingVertical:'2px',paddingLeft:'3px', backgroundColor:'#343030',color:'white'
        
    },
    customer_details: {
        fontFamily: 'Segoe UI normal',
        fontSize: 11,
    },
  })                

class PR_PDF extends React.Component{

    constructor(props){
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
      const userEmail=localStorage.getItem('Email');
      const userToken=localStorage.getItem('Password');
      if(userIs_logged != 1){
        this.props.history.push("/login");
      }
        this.state ={
            isLoaded: false,
            PR_NO: '',
            NAME:'',
            PROJET:'',
            COMPANY:'',
            REQ_NO:'',
            REQ_LOCATION:'',
            REQ_DEPARTMENT:'',
            DELEVERY_ADDRESS:'',
            CONTACT_NO:'',
            REQUESTED_BY:'',
            REQUESTED_POISTION:'',
            DELEVERY_DATE:'',
            LEAD_TIME:'',
            LOCATION:'',
            Created_at:'',
            STATUS:'',

            items : [],

            ITEM_DESC1: ' ',
            ITEM_UNIT1: ' ',
            ITEM_AVAIL1: ' ',
            ITEM_QTY1: ' ',
            ITEM_NEED_PROCUR1: ' ',
            //dash1: ' ',
            
            ITEM_DESC2: ' ',
            ITEM_UNIT2: ' ',
            ITEM_AVAIL2: ' ',
            ITEM_QTY2: ' ',
            ITEM_NEED_PROCUR2: ' ',
            //dash1: ' ',

            ITEM_DESC3: ' ',
            ITEM_UNIT3: ' ',
            ITEM_AVAIL3: ' ',
            ITEM_QTY3: ' ',
            ITEM_NEED_PROCUR3: ' ',
            //dash1: ' ',

            ITEM_DESC4: ' ',
            ITEM_UNIT4: ' ',
            ITEM_AVAIL4: ' ',
            ITEM_QTY4: ' ',
            ITEM_NEED_PROCUR4: ' ',
            //dash1: ' ',

            ITEM_DESC5: ' ',
            ITEM_UNIT5: ' ',
            ITEM_AVAIL5: ' ',
            ITEM_QTY5: ' ',
            ITEM_NEED_PROCUR5: ' ',
            //dash1: ' ',

            ITEM_DESC6: ' ',
            ITEM_UNIT6: ' ',
            ITEM_AVAIL6: ' ',
            ITEM_QTY6: ' ',
            ITEM_NEED_PROCUR6: ' ',
            //dash1: ' ',

            ITEM_DESC7: ' ',
            ITEM_UNIT7: ' ',
            ITEM_AVAIL7: ' ',
            ITEM_QTY7: ' ',
            ITEM_NEED_PROCUR7: ' ',
            //dash1: ' ',

            ITEM_DESC8: ' ',
            ITEM_UNIT8: ' ',
            ITEM_AVAIL8: ' ',
            ITEM_QTY8: ' ',
            ITEM_NEED_PROCUR8: ' ',
            //dash1: ' ',

            ITEM_DESC9: ' ',
            ITEM_UNIT9: ' ',
            ITEM_AVAIL9: ' ',
            ITEM_QTY9: ' ',
            ITEM_NEED_PROCUR9: ' ',
            //dash1: ' ',

            ITEM_DESC10: ' ',
            ITEM_UNIT10: ' ',
            ITEM_AVAIL10: ' ',
            ITEM_QTY10: ' ',
            ITEM_NEED_PROCUR10: ' ',
            //dash1: ' ',






        }
    }

    componentWillMount() {

          //require('../../utils').checkpermision('PR')
        
        const pid = this.props.match.params.id
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'purchase-requisition/get-prid/'+pid, {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'access_token' : access_token
             },
             credentials: 'include'
          }).then(response => response.json())
          .then((response)=>{
               console.log(response)
              const count = []
              count.push(response.pr);
            //   console.log(count)
              this.setState({
                  pr: count,
                  items: response.items
              })
              this.setState({
                
                PR_NO : count[0].id,
                NAME : count[0].name,
                PROJET : count[0].project_name,
                COMPANY : count[0].company_name,
                REQ_NO : count[0].requisition_number,
                REQ_LOCATION : count[0].requestor_location,
                REQ_DEPARTMENT : count[0].department_or_unit,
                DELEVERY_ADDRESS : count[0].delivery_address,
                CONTACT_NO : count[0].contact_number,
                REQUESTED_BY : count[0].requested_by,
                REQUESTED_POISTION : count[0].requested_by_position,
                DELEVERY_DATE : count[0].delivery_date,
                LEAD_TIME : count[0].lead_time,
                LOCATION : count[0].location,
                STATUS : count[0].status,
                Created_at:count[0].created_at,
   
                isLoaded: true,
              
              })


              if (this.state.items.length>0) {
                this.setState({
                    ITEM_DESC1: this.state.items[0].description,
                    ITEM_UNIT1: this.state.items[0].unit,
                    ITEM_AVAIL1: this.state.items[0].available,
                    ITEM_QTY1: this.state.items[0].quantity,
                    ITEM_NEED_PROCUR1: this.state.items[0].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>1) {
                this.setState({
                    ITEM_DESC2: this.state.items[1].description,
                    ITEM_UNIT2: this.state.items[1].unit,
                    ITEM_AVAIL2: this.state.items[1].available,
                    ITEM_QTY2: this.state.items[1].quantity,
                    ITEM_NEED_PROCUR2: this.state.items[1].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>2) {
                this.setState({
                    ITEM_DESC3: this.state.items[2].description,
                    ITEM_UNIT3: this.state.items[2].unit,
                    ITEM_AVAIL3: this.state.items[2].available,
                    ITEM_QTY3: this.state.items[2].quantity,
                    ITEM_NEED_PROCUR3: this.state.items[2].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>3) {
                this.setState({
                    ITEM_DESC4: this.state.items[3].description,
                    ITEM_UNIT4: this.state.items[3].unit,
                    ITEM_AVAIL4: this.state.items[3].available,
                    ITEM_QTY4: this.state.items[3].quantity,
                    ITEM_NEED_PROCUR4: this.state.items[3].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>4) {
                this.setState({
                    ITEM_DESC5: this.state.items[4].description,
                    ITEM_UNIT5: this.state.items[4].unit,
                    ITEM_AVAIL5: this.state.items[4].available,
                    ITEM_QTY5: this.state.items[4].quantity,
                    ITEM_NEED_PROCUR5: this.state.items[4].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>5) {
                this.setState({
                    ITEM_DESC6: this.state.items[5].description,
                    ITEM_UNIT6: this.state.items[5].unit,
                    ITEM_AVAIL6: this.state.items[5].available,
                    ITEM_QTY6: this.state.items[5].quantity,
                    ITEM_NEED_PROCUR6: this.state.items[5].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>6) {
                this.setState({
                    ITEM_DESC7: this.state.items[6].description,
                    ITEM_UNIT7: this.state.items[6].unit,
                    ITEM_AVAIL7: this.state.items[6].available,
                    ITEM_QTY7: this.state.items[6].quantity,
                    ITEM_NEED_PROCUR7: this.state.items[6].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>7) {
                this.setState({
                    ITEM_DESC8: this.state.items[7].description,
                    ITEM_UNIT8: this.state.items[7].unit,
                    ITEM_AVAIL8: this.state.items[7].available,
                    ITEM_QTY8: this.state.items[7].quantity,
                    ITEM_NEED_PROCUR8: this.state.items[7].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>8) {
                this.setState({
                    ITEM_DESC9: this.state.items[8].description,
                    ITEM_UNIT9: this.state.items[8].unit,
                    ITEM_AVAIL9: this.state.items[8].available,
                    ITEM_QTY9: this.state.items[8].quantity,
                    ITEM_NEED_PROCUR9: this.state.items[8].need_to_procure,
                    //dash1: ' ',
                })
            }
            if (this.state.items.length>9) {
                this.setState({
                    ITEM_DESC10: this.state.items[9].description,
                    ITEM_UNIT10: this.state.items[9].unit,
                    ITEM_AVAIL10: this.state.items[9].available,
                    ITEM_QTY10: this.state.items[9].quantity,
                    ITEM_NEED_PROCUR10: this.state.items[9].need_to_procure,
                    //dash1: ' ',
                })
            }
        })
    }

    numberWithCommas(x) {
    if(x != ' '){
    const b =parseFloat(x).toFixed(3)
    return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    }
    numberWithCommasSpecial(x,y){
        
        let a = parseFloat(x)+parseFloat(y)
        let b =parseFloat(a).toFixed(3)
        return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
    }
    convert(date){
        
        var time = Date.parse(date);
        
        var d = new Date(time);
        const month =this.addZero(d.getMonth()+1)
        const day = this.addZero(d.getDate())
        const year = this.addZero(d.getFullYear())
        
        return day+'/'+month+'/'+year
        
      }
      addZero(i) {
        if (i < 10) {i = "0" + i}
        return i;
      }
    render(){
        const {isLoaded} = this.state;
        return(
            
            <div>
            {isLoaded ? (
           
            
            <PDFViewer style={{width: '100%', height: '90vh'}}>
            
            <Document>
                
                <Page size="A4" style={{flexDirection: 'row', backgroundColor: 'white'}}>
                <View>
                <Image src={logo} style={{maxHeight: '120px', marginTop:'-10px',marginLeft:'25px'}} />
                </View>
                
                <View style={{position:'absolute'}}>
                <Image src={made_in_bahrain} style={{maxHeight: '30px',width:'30px', marginTop:'72px', marginLeft:'46px'}} />
                </View>
                <View style={{position:'absolute'}}>
                <Image src={iso} style={{maxHeight: '65px',width:'65px', marginTop:'72px', marginLeft:'80px'}} />
                </View>
                <View>
                <Text style={{fontSize:'8', fontFamily:'Segoe UI normal', position:'fixed', width:'100%', textAlign:'center', marginTop:'88px'}}>Project: {this.state.PROJET}</Text>
                </View>
                <Text style={{fontSize:'10', fontFamily:'Segoe UI', position:'absolute', marginTop:'113px', marginLeft:'5%', width:'100px'}}>{this.state.COMPANY}</Text>
                
                <Text style={{fontSize:'10', fontFamily:'Segoe UI', position:'absolute', marginTop:'113px', marginLeft:'5%', width:'90%',textAlign:'center'}}>Material Requisition</Text>
                <Text style={{fontSize:'10', fontFamily:'Segoe UI', position:'absolute', marginTop:'113px', marginLeft:'5%', width:'90%',textAlign:'right'}}>Requisition No. MRN-{this.state.PR_NO}</Text>
                
                <View style={{width:'90%', height:'583px', marginLeft:'5%', border:'1px solid black', position:'absolute', marginTop:'21.2%'}}>
                    <View>
                    <Text style={{width:'84%', textAlign:'center', fontSize:11, fontFamily:'Segoe UI', paddingTop:'6px', height:'30px', borderBottom:'1px solid black', position:'absolute', borderRight:'1px solid black'}}>Supply, Material Equipment, and Service Requisitions </Text>
                    <View style={{marginLeft:'84%',width:'16%', fontFamily:'Segoe UI', height:'30px', borderBottom:'1px solid black',position:'absolute', paddingLeft:'2px'}}> 
                        <Text style={{fontSize:9, fontFamily:'Segoe UI normal'}}>{this.convert(this.state.Created_at)}</Text>
                        <Text style={{fontSize:9, fontFamily:'Segoe UI normal'}}>Page   1  </Text>
                    </View>
                    </View>
                    <View style={{marginTop:'25px'}}>
                        <Text style={{width:'84%', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black'}}>&nbsp;</Text>
                        <Text style={{marginLeft:'84%', width:'16%', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;</Text>
                    </View>
                    <View style={{marginTop:'20px'}}>
                        <Text style={{width:'20%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Requestor Location</Text>
                        <Text style={{marginLeft:'20%', width:'80%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp; {this.state.REQ_LOCATION}</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'20%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Department/Unit</Text>
                        <Text style={{marginLeft:'20%', width:'80%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;{this.state.REQ_DEPARTMENT}</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'20%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Deliver To</Text>
                        <Text style={{marginLeft:'20%', width:'80%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;{this.state.DELEVERY_ADDRESS}</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'20%', position:'absolute',height:'20px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'3px'}}>Phone Number</Text>
                        <Text style={{marginLeft:'20%', width:'80%',height:'20px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;{this.state.CONTACT_NO}</Text>
                    </View>
                    <View style={{marginTop:'20px'}}>
                        <Text style={{width:'32.9%', position:'absolute',height:'40px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'12px'}}>Requested by(Name &#38; Position)</Text>
                        <Text style={{marginLeft:'32.9%', width:'21%',height:'40px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black'}}>&nbsp;{this.state.REQUESTED_BY}</Text>
                        <View style={{marginLeft:'68.8%', width:'31.8%',height:'40px', position:'absolute',borderBottom:'1px solid black'}}>
                            <View>
                                <Text style={{fontFamily:'Segoe UI', fontSize:9, paddingLeft:'2px', height:'20px', borderBottom:'1px solid black', paddingTop:'3px',width:'80px',borderRight:'1px solid black', position:'absolute'}}>Delivery Date: </Text>
                                <Text style={{fontFamily:'Segoe UI', fontSize:9, paddingLeft:'2px', height:'20px', borderBottom:'1px solid black', paddingTop:'3px',marginLeft:'80px', position:'absolute',width:'88px'}}>{this.convert(this.state.DELEVERY_DATE)}</Text>
                            </View>
                            <View style={{marginTop:'20px'}}>
                                <Text style={{fontFamily:'Segoe UI', fontSize:9,paddingLeft:'2px', height:'20px', paddingTop:'3px', width:'80px', borderRight:'1px solid black'}}>Lead Time: </Text>
                                <Text style={{fontFamily:'Segoe UI', fontSize:9, paddingLeft:'2px', height:'20px', paddingTop:'3px',marginLeft:'80px', position:'absolute',width:'88px'}}>{this.state.LEAD_TIME} Days</Text>
                            </View>
                            
                        </View>
                    </View>
                    <View style={{marginTop:'40px'}}>
                        <Text style={{width:'32.9%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Signature &#38; Date</Text>
                        <Text style={{marginLeft:'32.9%', width:'67.1%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'32.9%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Approved By(Name &#38; Position)</Text>
                        <Text style={{marginLeft:'32.9%', width:'67.1%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'32.9%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Signature &#38; Date</Text>
                        <Text style={{marginLeft:'32.9%', width:'67.1%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;</Text>
                    </View>
                    <View style={{marginTop:'30px'}}>
                        <Text style={{width:'32.9%', position:'absolute',height:'30px',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,paddingLeft:'3px', paddingTop:'8px'}}>Use Location</Text>
                        <Text style={{marginLeft:'32.9%', width:'67.1%',height:'30px', position:'absolute',borderBottom:'1px solid black'}}>&nbsp;{this.state.LOCATION}</Text>
                    </View>


                    <View style={{marginTop: '30px'}}>
                        <Text style={{width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Item</Text>
                        <Text style={{marginLeft:'45px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Unit</Text>
                        <Text style={{marginLeft:'90px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Qty</Text>
                        <Text style={{marginLeft:'170px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Description</Text>
                        <Text style={{marginLeft:'436px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Available</Text>
                        <Text style={{marginLeft:'486px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>Procure</Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;1</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT1}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY1}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center', paddingLeft:'2px'}}>&nbsp;{this.state.ITEM_DESC1}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL1}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR1}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;2</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT2}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY2}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC2}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL2}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR2}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;3</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT3}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY3}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC3}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL3}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR3}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;4</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT4}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY4}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC4}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL4}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR4}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;5</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT5}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY5}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC5}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL5}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR5}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;6</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT6}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY6}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC6}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL6}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR6}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;7</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT7}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY7}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC7}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL7}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR7}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;8</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT8}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY8}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC8}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL8}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR8}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;9</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT9}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY9}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC9}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL9}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR9}</Text>
                    </View>
                    <View style={{marginTop: '26px'}}>
                    <Text style={{width:'45px',height:'26px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;10</Text>
                        <Text style={{marginLeft:'45px',height:'26px', width:'45px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_UNIT10}</Text>
                        <Text style={{marginLeft:'90px',height:'26px', width:'86px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_QTY10}</Text>
                        <Text style={{marginLeft:'170px',height:'26px', width:'266px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center'}}>&nbsp;{this.state.ITEM_DESC10}</Text>
                        <Text style={{marginLeft:'436px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', borderRight:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_AVAIL10}</Text>
                        <Text style={{marginLeft:'486px',height:'26px', width:'50px', position:'absolute',borderBottom:'1px solid black', fontFamily:'Segoe UI',fontSize:9,textAlign:'center',paddingTop:'5px'}}>&nbsp;{this.state.ITEM_NEED_PROCUR10}</Text>
                    </View>
                </View>
                <View style={{width:'90%', marginLeft:'5%', border:'1px solid black', position:'absolute', marginTop:'740px', height:'72px'}}>
                    <View>
                        <Text style={{width: '29%', borderBottom:'1px solid black',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>Approved By (Name &#38; Position)</Text>
                        <Text style={{marginLeft: '29%',width:'5%', borderBottom:'1px solid black',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>&nbsp;</Text>
                        <Text style={{marginLeft: '53%',width:'1%', borderBottom:'1px solid black',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>Store Manager</Text>
                    </View>
                    <View style={{marginTop:'35px'}}>
                        <Text style={{width: '29%',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>Signature &#38; Date</Text>
                        <Text style={{marginLeft: '29%',width:'5%',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>&nbsp;</Text>
                        <Text style={{marginLeft: '53%',width:'1%',borderRight:'1px solid black', height:'35px', position:'absolute', fontSize:9, fontFamily:'Segoe UI' ,paddingLeft:'3px', paddingTop:'9px' }}>Signature &#38; Date</Text>
                    </View>
                </View>


                </Page>
            </Document> 
            </PDFViewer>
            ) : (<div style={{height:'85vh',paddingTop: '8%'}}><L></L></div>)}
            </div>
        )
    }
}

export default PR_PDF