import React from "react";
import { Page, Text, View, Document, StyleSheet, Image,Font } from '@react-pdf/renderer';
import fonts from '../../fonts/OpenSans-Bold.ttf'
import fontnormal from '../../fonts/OpenSans-Regular.ttf'
import fontitalicbold from '../../fonts/OpenSans-BoldItalic.ttf'
import fontitalic from '../../fonts/OpenSans-Italic.ttf'
import { PDFViewer } from '@react-pdf/renderer';
import logo from '../../images/fmlogo.png'; 
import L from "../../components/components-overview/loader";


Font.register({ family: 'Segoe UI', src: fonts });
Font.register({ family: 'Segoe UI normal', src: fontnormal });
Font.register({ family: 'Segoe UI italic bold', src: fontitalicbold });
Font.register({ family: 'Segoe UI italic', src: fontitalic });
const styles = StyleSheet.create({
    title: {
        fontFamily: 'Segoe UI',
        marginLeft: '50%', 
        marginTop: '3.5%',
        fontSize: 32,
        position:'absolute', 
        width:'250px',
        textAlign:'center',
        color:'#45413E'
    },
    bold: {
        fontFamily: 'Segoe UI',
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

class ReservationVoucherPDF extends React.Component{

    constructor(props){
        super(props);
        this.state ={
            isLoaded: true,
        }
        
    }
    
    render(){
        const {isLoaded} = this.state;
        return(
            
            <div>
            {isLoaded ? (
           
            
            <PDFViewer style={{width: '100%', height: '87vh'}}>
            
            <Document>
                
                <Page size="A4" style={{flexDirection: 'row', backgroundColor: 'white'}}>
                
                {/* <Image src="https://i.ibb.co/N23BQz2/logo.png" style={{maxHeight: '60px', marginTop:'55px', marginLeft: '15px'}} /> */}
                
                <View style={{width:'100%', height:'140px', backgroundColor:'#E5DFDB', position:'absolute'}}>
                    <Image src={logo} style={{maxHeight: '110px', width:'110px', marginTop:'3%', marginLeft: '50px'}} />
                    <Text style={styles.title} >Reservation Voucher</Text>
                </View>
                <View style={{width:'100%', marginTop:'140px', height:'50px', position:'absolute' }}>
                    <View style={{width:'50%', height:'50px', fontSize:'13px',  backgroundColor:'#AA9E4D', position:'absolute', color:'white',  justifyContent:'center', alignContent:'center', display:'flex'}}>
                        <Text style={{width:'100%', textAlign:'center'}}>Booking ID#:  16974</Text>
                        <Text style={{width:'100%', textAlign:'center'}}>External Reference: 701657649</Text>
                    </View>
                    <View style={{width:'50%', height:'50px', marginLeft:'50%',  backgroundColor:'black',  justifyContent:'center', alignContent:'center', display:'flex'}}>
                        <Text style={{width:'100%', textAlign:'center', color:'white'}}>Date: 02-07-2022</Text>
                    </View>
                </View>
                <View style={{width:'88%', marginLeft:'6%',height:'50px', marginTop:'190px', position:'absolute'}}>
                    <View style={{width:'30%', height:'50px', position:'absolute', justifyContent:'center', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'center'}}>Voucher to:</Text>
                    </View>
                    <View style={{width:'70%', height:'50px', marginLeft:'30%',  justifyContent:'center', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'center', }}>Mr. MOHAMMED  ABDULNABI</Text>
                    </View>
                </View>
                <View style={{width:'88%', marginLeft:'6%',height:'50px', marginTop:'240px', position:'absolute'}}>
                    <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', color:'white', backgroundColor:'#AA9E4D', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'left',  marginLeft:'8px', fontSize:'14px'}}>Hotel Name</Text>
                    </View>
                    <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'center', }}>RAMADA ENCORE KUWAIT DOWNTOWN</Text>
                    </View>
                </View>
                <View style={{width:'88%', marginLeft:'6%',height:'50px', marginTop:'295px', position:'absolute'}}>
                    <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', color:'white', backgroundColor:'#000', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'left', marginLeft:'8px',fontSize:'14px'}}>Address</Text>
                        <Text style={{width:'100%', textAlign:'left', marginLeft:'8px', fontSize:'14px'}}>Tel.</Text>
                    </View>
                    <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                        <Text style={{width:'100%', textAlign:'center', fontSize:'11px' }}>113 Jaber Al Mubarak Street Block 8, Sharq District, 32026, Kuwait City,KUWAIT CITY, Kuwait
                        </Text>
                        <Text style={{width:'100%', textAlign:'center', fontSize:'11px'}}>+001800112</Text>
                    </View>
                </View>
                
                <View style={{width:'70%', marginLeft:'15%',height:'252px', marginTop:'390px', border:'2px solid black', position:'absolute'}}>
                    <View style={{width:'100%',height:'50px', position:'absolute', borderBottom:'2px solid #A09992'}}>
                        <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', borderRight:'2px solid black', borderBottom:'2px solid #A09992', backgroundColor:'#FAFAF5', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center', fontSize:'14px', color:'#454141'}}>Check-in</Text>
                        </View>
                        <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center',fontSize:'14px' }}>04-07-2022</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:'50px', position:'absolute', borderBottom:'2px solid #A09992', marginTop:'50px'}}>
                        <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', borderRight:'2px solid black', borderBottom:'2px solid #A09992', backgroundColor:'#FAFAF5', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center', fontSize:'14px', color:'#454141'}}>Check-out</Text>
                        </View>
                        <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center',fontSize:'14px' }}>06-07-2022</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:'50px', position:'absolute', borderBottom:'2px solid #A09992', marginTop:'100px'}}>
                        <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', borderRight:'2px solid black', borderBottom:'2px solid #A09992', backgroundColor:'#FAFAF5', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center', fontSize:'14px', color:'#454141'}}>Nights</Text>
                        </View>
                        <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center',fontSize:'14px' }}>2</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:'50px', position:'absolute', borderBottom:'2px solid #A09992', marginTop:'150px'}}>
                        <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', borderRight:'2px solid black', borderBottom:'2px solid #A09992', backgroundColor:'#FAFAF5', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center', fontSize:'14px', color:'#454141'}}>Room Type</Text>
                        </View>
                        <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center',fontSize:'14px' }}>1 Queen Bed Smoking Room only</Text>
                        </View>
                    </View>
                    <View style={{width:'100%',height:'50px', position:'absolute', borderBottom:'2px solid #A09992', marginTop:'200px'}}>
                        <View style={{width:'25%', height:'50px', position:'absolute', justifyContent:'center', borderRight:'2px solid black', borderBottom:'2px solid #A09992', backgroundColor:'#FAFAF5', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center', fontSize:'14px',  color:'#454141'}}>Guest(s) In-Room </Text>
                        </View>
                        <View style={{width:'75%', height:'50px', marginLeft:'25%', fontSize:'14px', justifyContent:'center', backgroundColor:'#E5DFDB', alignContent:'center', display:'flex', fontFamily: 'Segoe UI'}}>
                            <Text style={{width:'100%', textAlign:'center',fontSize:'14px' }}>Adults: 2</Text>
                        </View>
                    </View>
                </View>

                <View style={{width: '94%', marginLeft:'3%', height:'50px', marginTop:'700px', position:'absolute' }}>
                    <View style={{width:'50%', backgroundColor:'#A99F4D', height:'50px', justifyContent:'center', alignContent:'center', display:'flex', textAlign:'center', position:'absolute'}}>
                        <Text style={{color:'#45413E', fontSize:'13px', fontFamily:'Segoe UI'}}>CANCELLATION PENALTIES</Text>
                        <Text style={{color:'#45413E', fontSize:'8px', fontFamily:'Segoe UI'}}>No cancellations or changes are accepted</Text>
                    </View>
                    <View style={{width:'50%',marginLeft:'50%', height:'50px', justifyContent:'center', alignContent:'center', display:'flex', textAlign:'center'}}>
                        <Text style={{ fontSize:'11px', fontFamily:'Segoe UI', borderTop:'2px solid black', width:'50%', marginLeft:'25%', paddingTop:'4px'}}>F&M GLOBAL W.L.L</Text>
                    </View>
                </View>
                <View style={{width: '100%', height:'30px', marginTop:'808px', backgroundColor: '#E5DFDB' }}>
                    <View style={{width: '50%', height:'30px', backgroundColor: '#A99F4D', color:'white', justifyContent:'center', alignContent:'center', display:'flex',  fontFamily: 'Segoe UI', textAlign:'center', fontSize:'13px' }}>
                    <Text >Thank you for your business</Text>
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

export default ReservationVoucherPDF