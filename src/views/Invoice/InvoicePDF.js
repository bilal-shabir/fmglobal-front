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

Font.register({ family: 'Segoe UI', src: fonts });
Font.register({ family: 'Segoe UI normal', src: fontnormal });
Font.register({ family: 'Segoe UI italic bold', src: fontitalicbold });
Font.register({ family: 'Segoe UI italic', src: fontitalic });
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Segoe UI',
        marginLeft: '59.5%', 
        marginTop: '10%',
        fontSize: 34,
        position:'absolute', 
        width:'250px'
    },
    normal:{
        fontFamily: 'Segoe UI normal',
        fontSize: 8,
        marginTop:'2px'
    },
    bill_no:{
        fontFamily: 'Segoe UI',
        fontSize: 8,
        marginTop: '10px', width:'150px',paddingVertical:'4px',paddingLeft:'1px', backgroundColor:'#343030',color:'white'
        
    },
    customer_details: {
        fontFamily: 'Segoe UI normal',
        fontSize: 8,
        paddingTop:'1px'
    },
  })                

class InvoicePDF extends React.Component{

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
            INVC_NO : '',
            INVC_START_DATE : '',
            INVC_END_DATE : '',
            INVC_DUE_DATE : '',
            INVC_BILLING_MONTH : '',
            INVC_CRN : '',
            CUS_ID : '',
            PROJ_ID : '',
            INVC_POWER_GENERATED : '',
            INVC_SUB_TOTAL : '',
            INVC_TAX_RATE : '',
            INVC_TAX : '',
            INVC_TOTAL : '',
            INVC_CUSTOMER_NAME : '',
            INVC_COMPANY_NAME : '',
            INVC_PROJECT_NAME : '',
            INVC_COMPANY_STREET_ADDRESS : '',
            INVC_COMPANY_CITY : '',
            INVC_COMPANY_STATE : '',
            INVC_COMPANY_ZIP : '',
            INVC_COMPANY_PHONE: '',
            INVC_COMPANY_EMAIL: '',
            INVC_CREATED_AT:'',
            INVC_PREVIOUS_DUES: '',
            

            devices : [],

            INVC_DTAL_DESC1: ' ',
            INVC_DTAL_POWER_GENERATED1: ' ',
            INVC_DTAL_AMOUNT1: ' ',
            INVC_DTAL_DVIC_ID1: ' ',
            dash1: ' ',

            INVC_DTAL_DESC2: ' ',
            INVC_DTAL_POWER_GENERATED2: ' ',
            INVC_DTAL_AMOUNT2: ' ',
            INVC_DTAL_DVIC_ID2: ' ',
            dash2: ' ',

            INVC_DTAL_DESC3: ' ',
            INVC_DTAL_POWER_GENERATED3: ' ',
            INVC_DTAL_AMOUNT3: ' ',
            INVC_DTAL_DVIC_ID3: ' ',
            dash3: ' ',

            INVC_DTAL_DESC4: ' ',
            INVC_DTAL_POWER_GENERATED4: ' ',
            INVC_DTAL_AMOUNT4: ' ',
            INVC_DTAL_DVIC_ID4: ' ',
            dash4: ' ',

            INVC_DTAL_DESC5: ' ',
            INVC_DTAL_POWER_GENERATED5: ' ',
            INVC_DTAL_AMOUNT5: ' ',
            INVC_DTAL_DVIC_ID5: ' ',
            dash5: ' ',

            INVC_DTAL_DESC6: ' ',
            INVC_DTAL_POWER_GENERATED6: ' ',
            INVC_DTAL_AMOUNT6: ' ',
            INVC_DTAL_DVIC_ID6: ' ',
            dash6: ' ',

            INVC_DTAL_DESC7: ' ',
            INVC_DTAL_POWER_GENERATED7: ' ',
            INVC_DTAL_AMOUNT7: ' ',
            INVC_DTAL_DVIC_ID7: ' ',
            dash7: ' ',

            INVC_DTAL_DESC8: ' ',
            INVC_DTAL_POWER_GENERATED8: ' ',
            INVC_DTAL_AMOUNT8: ' ',
            INVC_DTAL_DVIC_ID8: ' ',
            dash8: ' ',

            INVC_DTAL_DESC9: ' ',
            INVC_DTAL_POWER_GENERATED9: ' ',
            INVC_DTAL_AMOUNT9: ' ',
            INVC_DTAL_DVIC_ID9: ' ',
            dash9: ' ',

            INVC_DTAL_DESC10: ' ',
            INVC_DTAL_POWER_GENERATED10: ' ',
            INVC_DTAL_AMOUNT10: ' ',
            INVC_DTAL_DVIC_ID10: ' ',
            dash10: ' ',

            INVC_DTAL_DESC11: ' ',
            INVC_DTAL_POWER_GENERATED11: ' ',
            INVC_DTAL_AMOUNT11: ' ',
            INVC_DTAL_DVIC_ID11: ' ',
            dash11: ' ',

            INVC_DTAL_DESC12: ' ',
            INVC_DTAL_POWER_GENERATED12: ' ',
            INVC_DTAL_AMOUNT12: ' ',
            INVC_DTAL_DVIC_ID12: ' ',
            dash12: ' ',

            INVC_DTAL_DESC13: ' ',
            INVC_DTAL_POWER_GENERATED13: ' ',
            INVC_DTAL_AMOUNT13: ' ',
            INVC_DTAL_DVIC_ID13: ' ',
            dash13: ' ',

        }
        
    }
    
    
    
    componentWillMount() {

        require('../../utils').checkpermision('Billed')
        const pid = this.props.match.params.id
        const access_token = localStorage.getItem('access_token');
        fetch(URL2+'invoice/getInvoice/'+pid, {
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
              count.push(response.invoice);
            //   console.log(count)
              this.setState({
                  invoice: count,
                  devices: response.devices
              })
              this.setState({
                isLoaded: true,
              
              })
              if (this.state.devices.length>0) {
                this.setState({
                    INVC_DTAL_DESC1: this.state.devices[0].device.desc,
                    INVC_DTAL_POWER_GENERATED1: this.state.devices[0].production_generated,
                    INVC_DTAL_AMOUNT1: this.state.devices[0].amount,
                    INVC_DTAL_DVIC_ID1: this.state.devices[0].device.sn,
                    dash1: ' / '
                })
            }
            if (this.state.devices.length>1) {
                this.setState({
                    INVC_DTAL_DESC2: this.state.devices[1].device.desc,
                    INVC_DTAL_POWER_GENERATED2: this.state.devices[1].production_generated,
                    INVC_DTAL_AMOUNT2: this.state.devices[1].amount,
                    INVC_DTAL_DVIC_ID2: this.state.devices[1].device.sn,
                    dash2: ' / '
                })
            }
    
            if (this.state.devices.length>2) {
                this.setState({
                    INVC_DTAL_DESC3: this.state.devices[2].device.desc,
                    INVC_DTAL_POWER_GENERATED3: this.state.devices[2].production_generated,
                    INVC_DTAL_AMOUNT3: this.state.devices[2].amount,
                    INVC_DTAL_DVIC_ID3: this.state.devices[2].device.sn,
                    dash3: ' / '
                })
            }
            if (this.state.devices.length>3) {
                this.setState({
                    INVC_DTAL_DESC4: this.state.devices[3].device.desc,
                    INVC_DTAL_POWER_GENERATED4: this.state.devices[3].production_generated,
                    INVC_DTAL_AMOUNT4: this.state.devices[3].amount,
                    INVC_DTAL_DVIC_ID4: this.state.devices[3].device.sn,
                    dash4: ' / '
                })
            }
            if (this.state.devices.length>4) {
                this.setState({
                    INVC_DTAL_DESC5: this.state.devices[4].device.desc,
                    INVC_DTAL_POWER_GENERATED5: this.state.devices[4].production_generated,
                    INVC_DTAL_AMOUNT5: this.state.devices[4].amount,
                    INVC_DTAL_DVIC_ID5: this.state.devices[4].device.sn,
                    dash5: ' / '
                })
            }
            if (this.state.devices.length>5) {
                this.setState({
                    INVC_DTAL_DESC6: this.state.devices[5].device.desc,
                    INVC_DTAL_POWER_GENERATED6: this.state.devices[5].production_generated,
                    INVC_DTAL_AMOUNT6: this.state.devices[5].amount,
                    INVC_DTAL_DVIC_ID6: this.state.devices[5].device.sn,
                    dash6: ' / '
                })
            }
            if (this.state.devices.length>6) {
                this.setState({
                    INVC_DTAL_DESC7: this.state.devices[6].device.desc,
                    INVC_DTAL_POWER_GENERATED7: this.state.devices[6].production_generated,
                    INVC_DTAL_AMOUNT7: this.state.devices[6].amount,
                    INVC_DTAL_DVIC_ID7: this.state.devices[6].device.sn,
                    dash7: ' / '
                })
            }
            if (this.state.devices.length>7) {
                this.setState({
                    INVC_DTAL_DESC8: this.state.devices[7].device.desc,
                    INVC_DTAL_POWER_GENERATED8: this.state.devices[7].production_generated,
                    INVC_DTAL_AMOUNT8: this.state.devices[7].amount,
                    INVC_DTAL_DVIC_ID8: this.state.devices[7].device.sn,
                    dash8: ' / '
                })
            }
            if (this.state.devices.length>8) {
                this.setState({
                    INVC_DTAL_DESC9: this.state.devices[8].device.desc,
                    INVC_DTAL_POWER_GENERATED9: this.state.devices[8].production_generated,
                    INVC_DTAL_AMOUNT9: this.state.devices[8].amount,
                    INVC_DTAL_DVIC_ID9: this.state.devices[8].device.sn,
                    dash9: ' / '
                })
            }
            if (this.state.devices.length>9) {
                this.setState({
                    INVC_DTAL_DESC10: this.state.devices[9].device.desc,
                    INVC_DTAL_POWER_GENERATED10: this.state.devices[9].production_generated,
                    INVC_DTAL_AMOUNT10: this.state.devices[9].amount,
                    INVC_DTAL_DVIC_ID10: this.state.devices[9].device.sn,
                    dash10: ' / '
                })
            }
            if (this.state.devices.length>10) {
                this.setState({
                    INVC_DTAL_DESC11: this.state.devices[10].device.desc,
                    INVC_DTAL_POWER_GENERATED11: this.state.devices[10].production_generated,
                    INVC_DTAL_AMOUNT11: this.state.devices[10].amount,
                    INVC_DTAL_DVIC_ID11: this.state.devices[10].device.sn,
                    dash11: ' / '
                })
            }
            if (this.state.devices.length>11) {
                this.setState({
                    INVC_DTAL_DESC12: this.state.devices[11].device.desc,
                    INVC_DTAL_POWER_GENERATED12: this.state.devices[11].production_generated,
                    INVC_DTAL_AMOUNT12: this.state.devices[11].amount,
                    INVC_DTAL_DVIC_ID12: this.state.devices[11].device.sn,
                    dash12: ' / '
                })
            }
            if (this.state.devices.length>12) {
                this.setState({
                    INVC_DTAL_DESC13: this.state.devices[12].device.desc,
                    INVC_DTAL_POWER_GENERATED13: this.state.devices[12].production_generated,
                    INVC_DTAL_AMOUNT13: this.state.devices[12].amount,
                    INVC_DTAL_DVIC_ID13: this.state.devices[12].device.sn,
                    dash13: ' / '
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
                
                <Image src="https://i.ibb.co/N23BQz2/logo.png" style={{maxHeight: '60px', marginTop:'55px', marginLeft: '15px'}} />
                
                
                <Text style={styles.title} >VAT INVOICE</Text>
                <View style={{position: 'absolute',width:'40%',height:'160px', marginTop: '22.8%',marginLeft:'3%'}}>
                    <Text style={styles.normal}>
                    11th Floor, GBCORP Tower
                    </Text>
                    <Text style={styles.normal}>
                    Bahrain Financial Harbor District
                    </Text>
                    <Text style={styles.normal}>
                    VAT no. 220001547700002
                    </Text>
                    <Text style={styles.normal}>
                    Manama
                    </Text>
                    <Text style={styles.normal}>
                    Kingdom of Bahrain
                    </Text>
                    <Text style={styles.normal}>
                    Phone:  +973 7793 9471
                    </Text>
                    <Text style={styles.bill_no}>
                        Bill to
                    </Text>
                        {/* <Text style={styles.customer_details}>
                            Accounts Department
                        </Text> */}
                    {/* <Text style={styles.customer_details}>
                        {this.state.INVC_COMPANY_NAME}
                    </Text> */}
                    <Text style={styles.customer_details}>
                        {this.state.invoice[0].customer.invoice_address_line_1}
                    </Text>
                    <Text style={styles.customer_details}>
                    {this.state.invoice[0].customer.invoice_address_line_2}
                    </Text>
                    <Text style={styles.customer_details}>
                    {this.state.invoice[0].customer.invoice_address_line_3}
                    </Text>
                    <Text style={styles.customer_details}>
                    {this.state.invoice[0].customer.invoice_address_line_4}
                    </Text>
                    <Text style={styles.customer_details}>
                    {this.state.invoice[0].customer.invoice_address_line_5}
                    </Text>
                    <Text style={styles.customer_details}>
                    {this.state.invoice[0].customer.invoice_address_line_6}
                    </Text>
                    
                </View>
                <View style={{position: 'absolute',width:'48%',height:'160px', marginTop: '24%',marginLeft:'46.6%'}}>
                    
                    <Text style={{width:'32%',backgroundColor:'#3A3838',color:'white',paddingVertical:'2px',paddingLeft:'1px', fontSize:8,marginTop:'2px', fontFamily: 'Segoe UI', position:'absolute'}}>Invoice number</Text>
                    <Text style={{width:'30%',marginLeft:'31.8%',backgroundColor:'#3A3838',color:'white',paddingVertical:'2px',fontSize:8,textAlign:'center',marginTop:'2px', fontFamily: 'Segoe UI', position:'absolute'}}> &nbsp;</Text>
                    <Text style={{width:'20%',marginLeft:'74%',backgroundColor:'#3A3838',color:'white',paddingVertical:'2px',fontSize:8,textAlign:'center',marginTop:'2px', fontFamily: 'Segoe UI', position:'absolute'}}>Invoice date</Text>

                    <Text style={{width:'32%',paddingVertical:'2px',paddingLeft:'2px', fontSize:8,marginTop:'14px', fontFamily: 'Segoe UI', position:'absolute'}}>{this.state.invoice[0].invc_number}</Text>
                    <Text style={{width:'30%',marginLeft:'32%',paddingVertical:'2px',fontSize:8,textAlign:'center',marginTop:'14px', fontFamily: 'Segoe UI', position:'absolute'}}> &nbsp;</Text>
                    <Text style={{width:'20%',marginLeft:'74%',paddingVertical:'2px',fontSize:8,textAlign:'center',marginTop:'14px', fontFamily: 'Segoe UI', position:'absolute'}}>{this.convert(this.state.invoice[0].created_at)}</Text>

                    {/* <Text style={{width:'100%',fontSize:8,textAlign:'center',marginTop:'2px', fontFamily:'Segoe UI'}}>{this.state.INVC_NO}                            {this.convert(this.state.INVC_CREATED_AT)}</Text> */}
                    <Text style={{width:'100%',backgroundColor:'#3A3838',color:'white',paddingVertical:'2px',fontSize:8, textAlign:'center', fontFamily: 'Segoe UI',marginTop:'40px'}}>Invoice period</Text>
                    <Text style={{width:'100%',fontSize:8, textAlign:'center',fontFamily:'Segoe UI' }}>{this.convert(this.state.invoice[0].start_date)} - {this.convert(this.state.invoice[0].end_date)}</Text>
                    <Text style={{width:'70%',backgroundColor:'#3A3838',color:'white',paddingVertical:'4px',fontSize:8, textAlign:'center',marginTop:'80px', fontFamily: 'Segoe UI', position:'absolute'}}>Customer Reference Number (CRN)</Text>
                    <Text style={{width:'30%',marginLeft:'69.8%',backgroundColor:'#3A3838',color:'white',paddingVertical:'4px',fontSize:8, textAlign:'center',marginTop:'80px', fontFamily: 'Segoe UI', position:'absolute'}}>Payment due date</Text>
                    <Text style={{width:'70%',paddingVertical:'2px',fontSize:8, textAlign:'center',marginTop:'97px', fontFamily: 'Segoe UI', position:'absolute'}}>{this.state.invoice[0].invc_crn}  </Text>
                    <Text style={{width:'30%',marginLeft:'69.8%',paddingVertical:'2px',fontSize:8, textAlign:'center',marginTop:'97px', fontFamily: 'Segoe UI', position:'absolute'}}>{this.convert(this.state.invoice[0].due_date)}</Text>
                    {/* <Text style={{width:'100%',fontSize:11,marginTop:'2px',fontFamily:'Segoe UI'}}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{this.state.INVC_CRN}                                         {this.convert(this.state.INVC_DUE_DATE)}
                    </Text>                  */}
                </View>
                <Text style={{width:'108px',fontSize:8,paddingLeft:'2px' ,textAlign:'center',marginTop:'262px',marginLeft:'470px',fontFamily:'Segoe UI', position:'absolute',border:'2px solid black'}}>Amount (BHD)</Text>
                <View style={{backgroundColor: 'white', marginLeft:'46.5%', maxHeight: '50px', width: '43.5%', marginTop:'274px',border:'2px solid black',position:'absolute'}}>
                    <Text style={{width:'65%', borderBottom:'2px solid black', borderRight:'2px solid black',fontFamily:'Segoe UI', fontSize:8}}>Current month charges</Text><Text style={{position:'absolute',fontFamily:'Segoe UI',fontSize:8,marginLeft:'65%',width:'35%',textAlign:'right',borderBottom:'2px solid black',marginTop:'-1px'}}>{this.numberWithCommas(this.state.invoice[0].total)}</Text>
                    <Text style={{width:'65%', borderBottom:'2px solid black', borderRight:'2px solid black',fontFamily:'Segoe UI', fontSize:8}}>Previous month dues</Text><Text style={{position:'absolute',fontFamily:'Segoe UI',marginTop:'4.2%',fontSize:8,marginLeft:'65%',width:'35%',textAlign:'right',borderBottom:'2px solid black'}}>{this.numberWithCommas(this.state.invoice[0].previous_dues)}</Text>
                    <Text style={{width:'65%', borderRight:'2px solid black', fontSize:8,fontFamily:'Segoe UI'}}>Total</Text><Text style={{position:'absolute',marginTop:'8.5%',fontSize:8,marginLeft:'65%',fontFamily:'Segoe UI',width:'35%',textAlign:'right',paddingTop:'1px'}}>{this.numberWithCommasSpecial(this.state.invoice[0].total,this.state.invoice[0].previous_dues) }</Text>
                </View>
                <View style={{borderRight:'1px solid black', width:'2px', height:'196px', position:'absolute', marginLeft:'312.6px', marginTop:'345px'}}></View>
                <View style={{borderRight:'1px solid black', width:'2px', height:'196px', position:'absolute', marginLeft:'429.6px', marginTop:'345px'}}></View>
                
                
                <View style={{position: 'absolute',width:'94%',height:'198px',borderRight: '1px solid black',borderLeft: '1px solid black',borderTop: '1px solid black', marginTop: '56%',marginLeft:'3%'}}>
                    <View>
                        <Text style={{position: 'absolute', fontSize: 8,backgroundColor: '#BDAC37',width:'53%', fontFamily:'Segoe UI', borderRight:'1px solid black'}}>
                            Description
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8,backgroundColor: '#BDAC37',fontFamily:'Segoe UI', paddingLeft:'2px'}}>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Power generated (kWh)
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '73.8%', backgroundColor: '#BDAC37',width:'28%', textAlign:'right', paddingRight:'2px',fontFamily:'Segoe UI',borderLeft:'1px solid black',borderRight:'1px solid black'}}>
                            Amount (BHD)
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC1}{this.state.dash1}{this.state.INVC_DTAL_DVIC_ID1}  
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED1)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT1)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC2}{this.state.dash2}{this.state.INVC_DTAL_DVIC_ID2}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED2)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT2)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC3 }{this.state.dash3}{this.state.INVC_DTAL_DVIC_ID3}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED3)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT3)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                            {this.state.INVC_DTAL_DESC4 }{this.state.dash4}{this.state.INVC_DTAL_DVIC_ID4}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED4)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT4)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                            {this.state.INVC_DTAL_DESC5 }{this.state.dash5}{this.state.INVC_DTAL_DVIC_ID5}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED5)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT5)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC6 }{this.state.dash6}{this.state.INVC_DTAL_DVIC_ID6}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED6)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT6)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC7 }{this.state.dash7}{this.state.INVC_DTAL_DVIC_ID7}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED7)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT7)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC8 }{this.state.dash8}{this.state.INVC_DTAL_DVIC_ID8}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED8)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT8)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC9 }{this.state.dash9}{this.state.INVC_DTAL_DVIC_ID9}
                         </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED9)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT9)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black',fontFamily:'Segoe UI normal' }}>
                            {this.state.INVC_DTAL_DESC10 }{this.state.dash10} {this.state.INVC_DTAL_DVIC_ID10}
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED10)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT10)} 
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                            {this.state.INVC_DTAL_DESC11 }{this.state.dash11} {this.state.INVC_DTAL_DVIC_ID11}
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED11)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT11)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                            {this.state.INVC_DTAL_DESC12 }{this.state.dash12} {this.state.INVC_DTAL_DVIC_ID12}
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED12)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                            {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT12)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                        {this.state.INVC_DTAL_DESC13 }{this.state.dash13} {this.state.INVC_DTAL_DVIC_ID13}
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                        {this.numberWithCommas(this.state.INVC_DTAL_POWER_GENERATED13)}
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        {this.numberWithCommas(this.state.INVC_DTAL_AMOUNT13)}
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',borderBottom: '1px solid black', fontFamily:'Segoe UI normal'}}>
                        &nbsp;
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                        &nbsp;
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        &nbsp;
                        </Text>
                    </View>
                    <View style={{marginTop: '13px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',fontFamily:'Segoe UI normal' }}>
                        &nbsp;
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '32%', fontSize: 8 , paddingLeft:'2px', width:'29%', textAlign:'right',fontFamily:'Segoe UI normal'}}>
                        &nbsp;
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        &nbsp;
                        </Text>
                    </View>
                    <View style={{marginTop: '11px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'85px',borderTop:'1px solid #BDAC37',borderBottom:'1px solid #BDAC37', paddingVertical:'2px' , fontFamily:'Segoe UI italic bold' }}>
                        &nbsp;
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px',marginTop:'1px',  backgroundColor:'#DCDBDD' , paddingVertical:'2px', paddingRight:'30px',fontFamily:'Segoe UI normal' }}>
                            Total power generated (kWh)
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'97px' ,marginTop:'1px', paddingVertical:'2px',backgroundColor:'#DCDBDD', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        {this.numberWithCommas(this.state.invoice[0].production_generated)}
                        </Text>
                    </View>
                    <View style={{marginTop: '17px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'85px' , fontFamily:'Segoe UI italic bold' }}>
                        Thank you for choosing Pavilion
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px', backgroundColor:'#DCDBDD' , paddingVertical:'2px', paddingRight:'30px',fontFamily:'Segoe UI normal' }}>
                        Subtotal (BHD)  
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'97px' , paddingVertical:'2px',backgroundColor:'#DCDBDD', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        {this.numberWithCommas(this.state.invoice[0].sub_total)}
                        </Text>
                    </View>
                    <View style={{marginTop: '12px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'53%',paddingLeft:'2px',paddingRight:'2px',fontFamily:'Segoe UI normal' }}>
                        The charges can be remitted through Fawri transfer to the below account details
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px', backgroundColor:'#DCDBDD' , paddingVertical:'2px', paddingRight:'30px',fontFamily:'Segoe UI normal'}}>
                        Tax rate    
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'97px' , paddingVertical:'2px',backgroundColor:'#DCDBDD', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        {Math.round(this.state.invoice[0].tax_rate)}%
                        </Text>
                    </View>
                    <View style={{marginTop: '12px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',fontFamily:'Segoe UI normal' }}>
                            IBAN Number: BH55BBKU00100000454983
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px', backgroundColor:'#DCDBDD', paddingVertical:'2px', paddingRight:'34px',fontFamily:'Segoe UI normal'}}>
                         Tax   
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'97px' , paddingVertical:'2px',backgroundColor:'#DCDBDD', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI normal'}}>
                        {this.numberWithCommas(this.state.invoice[0].tax)}
                        </Text>
                    </View>
                    <View style={{marginTop: '12px'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px' ,fontFamily:'Segoe UI normal' }}>
                            Account Name: PAVILION ENERGY W.L.L
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px', backgroundColor:'#DCDBDD' , paddingVertical:'2px', paddingRight:'33px',fontFamily:'Segoe UI'}}>
                        Total  
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px' , paddingVertical:'2px',backgroundColor:'#DCDBDD', width:'97px', textAlign:'right',paddingRight:'2px',fontFamily:'Segoe UI'}}>
                        BHD {this.numberWithCommas(this.state.invoice[0].total)}
                        </Text>
                    </View>
                    <View style={{marginTop: '12x'}}>
                        <Text style={{position: 'absolute', fontSize: 8,width:'100%',paddingLeft:'2px',fontFamily:'Segoe UI normal' }}>
                            Swift Code: BBKUBHBMXXX
                        </Text>
                        <Text style={{position: 'absolute', marginLeft: '53%', fontSize: 8, width:'-33px' , paddingLeft:'2px', paddingVertical:'2px', paddingRight:'30px'}}>
                           
                        </Text>
                        <Text style={{position: 'absolute', fontSize:8, marginLeft: '82%',paddingLeft:'2px',width:'18%', paddingVertical:'2px', textAlign:'right',paddingRight:'2px'}}>
                        
                        </Text>
                    </View>
                    <View style={{marginTop: '2%'}}>
                        <Text style={{fontSize:7, fontFamily:'Segoe UI italic',marginLeft:'2px',marginTop:'2px'  }}>Please mention your company's name and invoice number in the payment reference</Text>
                    </View>
                    <View style={{marginTop: '3%'}}>
                        <Text style={{fontSize:8, fontFamily:'Segoe UI normal',marginLeft:'2px'}}>Or a cheque can be issued to "PAVILION ENERGY W.L.L"</Text>
                    </View>
                    <View style={{marginTop: '3%',width:'100%'}}>
                        <Text style={{fontSize:8,width:'100%',textAlign:'center', fontFamily:'Segoe UI normal'}}>If you have any questions about this invoice, please contact</Text>
                    </View>
                    <View style={{marginTop: '2.5%',width:'100%'}}>
                        <Text style={{fontSize:8,width:'100%',textAlign:'center', fontFamily:'Segoe UI'}}>+973 33658052, customerservice@pavilion.energy</Text>
                    </View>

                    
                    
                </View>
                <View style={{ marginLeft: '4%', width:'92%', height:'25px', position:'absolute', marginTop:'686px', borderTop:'1px solid black'}}><Text style={{marginTop:'3px',fontSize:8,width:'100%',textAlign:'center', fontFamily:'Segoe UI normal'}}>GBCORP Tower | 11th Floor | Building 1411 | Road 4626 | Block 346 | Bahrain Financial Harbor District | Manama | Kingdom of Bahrain</Text></View>
                <View style={{ width:'94%',marginLeft:'3%', height:'25px', position:'absolute', marginTop:'706px', backgroundColor:'#BDAC37'}}><Text style={{marginTop:'5px',fontSize:9,width:'100%',textAlign:'center', fontFamily:'Segoe UI normal'}}>www.pavilion-renewables.com</Text></View>


                </Page>
            </Document> 
            </PDFViewer>
            ) : (<div style={{height:'85vh',paddingTop: '8%'}}><L></L></div>)}
            </div>
        )
    }
}

export default InvoicePDF
