import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import fonts from '../../fonts/OpenSans-Bold.ttf'
import fontnormal from '../../fonts/OpenSans-Regular.ttf'
import fontitalicbold from '../../fonts/OpenSans-BoldItalic.ttf'
import fontitalic from '../../fonts/OpenSans-Italic.ttf'
import { PDFViewer } from '@react-pdf/renderer';
import { URL2, DKEY } from '../../constants';
import { parse } from "date-fns";
import Cookies from "universal-cookie";
import L from "../../components/components-overview/loader";
import { Container, object } from "shards-react";
import logo from '../../images/pavilionrenewableslogo.png'
import made_in_bahrain from '../../images/made_in_bahrain.png'
import iso from '../../images/iso.png'
import QRsample from '../../images/qrsample.png'
import { useLocation } from 'react-router-dom'
import { fit } from "@progress/kendo-drawing";



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
        position: 'absolute',
        width: '200px'
    },
    normal: {
        fontFamily: 'Segoe UI normal',
        fontSize: 11,
    },
    bill_no: {
        fontFamily: 'Segoe UI',
        fontSize: 11,
        marginTop: '2px', width: '180px', paddingVertical: '2px', paddingLeft: '3px', backgroundColor: '#343030', color: 'white'

    },
    customer_details: {
        fontFamily: 'Segoe UI normal',
        fontSize: 11,
    },
})

class QR_PDF extends React.Component {


    constructor(props) {


        super(props);
        //let QR_Data = this.props.location;
        const userIs_logged = localStorage.getItem('is_logged');
        const userEmail = localStorage.getItem('Email');
        const userToken = localStorage.getItem('Password');
        if (userIs_logged != 1) {
            this.props.history.push("/login");
        }
        this.state = {
            isLoaded: false,
            QR_Data: [],
            Project_type:true,
            //Data:QR_Data

        }
    }

    GetQRData = async () => {
        //this.location.reload();
        //console.log("location",this.props.location)
        const queryParams = new URLSearchParams(window.location.search);
        
        var QR_Data = JSON.parse(queryParams.get('p'));
        
        // let QR_Data = this.props.location.state.state;
        //var project_type='Project'
        let QRImage = [];
        let contact = [];
        let project = [];
        let task = [];
        let Description = [];
        let QRImageFrom=[];
        console.log("QR_Data", QR_Data)
        //console.log("Project Type",QR_Data[0].travel)
        
        if(QR_Data[0].travel==true){
            //project_type='From'
            this.setState({
                QR_Data: QR_Data,
                isLoaded: true,
                Project_type:false
            })
        }else{
            this.setState({
                QR_Data: QR_Data,
                isLoaded: true,
                Project_type:true
            })

        }
        
        // for (let index = 0; index < QR_Data.length; index++) {
        //     if(QR_Data.travel==false){
        //     QRImage[index] = QR_Data[index].generated_qr_project
        //     contact[index] = QR_Data[index].contact_name
        //     project[index] = QR_Data[index].project_name
        //     task[index] = QR_Data[index].task_name
        //     Description[index] = QR_Data[index].description_name
        // }else{
        //     QRImageFrom[index] = QR_Data[index].generated_qr_travel_from
        //     QRImageTo[index] = QR_Data[index].generated_qr_travel_to
        //     contact[index] = QR_Data[index].contact_name
        //     project[index] = QR_Data[index].project_name
        //     task[index] = QR_Data[index].task_name
        //     Description[index] = QR_Data[index].description_name
        // }

        // }


        console.log("QR Data state", this.state.QR_Data)
        

    
}

    componentDidMount(){

    
        this.GetQRData()


        //window.location.reload();

        //const  QR_Data  = this.props.location.state




        //console.log("data",this.state.data)
        //console.log("QR State" , this.props.QR_Data )

        //this.require('../../utils').checkpermision('QR')

        //   const hist =this.props.location.state.key
        //   console.log("History",hist )




        //const pid = this.props.match.params.id
        // const access_token = localStorage.getItem('access_token');
        // fetch(URL2 + 'QR_Generater/', {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Accept': 'application/json',
        //         'access_token': access_token
        //     },
        //     credentials: 'include'
        // }).then(response => response.json())
        //     .then((response) => {
        //         console.log(response)
        //         const count = []
        //         count.push(response);
        //         console.log(count)
        //         this.setState({


        //             isLoaded: true,

        //         })



        //     })
    }


    render() {
        console.log("Project_type",Project_type)
       
        console.log("State Data", this.state.Data)
        // const MyDocument = () => (
        //     <PDFViewer style={{width: '100%', height: '90vh'}}>
        //     <Document>
        //       <Page size="A4" >
        //           <View >
        //             {this.state.QR_Data.map(QR_Data => (<Text>{QR_Data.state.contact_name}
        //                   {QR_Data.state.project_name}
        //                   {QR_Data.state.task_name}{'\n\n'}
        //             </Text>))}
        //           </View>
        //       </Page>
        //     </Document>
        //     </PDFViewer>
        //   );
        //   ReactPDF.render(MyDocument);

        console.log("QR Data state Render", this.state.QR_Data)
        // console.log("QR Data state Render", this.state.QR_Data[0].company)

        const { isLoaded } = this.state;
        const { Project_type } = this.state;
        return (
        

            <div>
                {/* {Project_type && <button>Logout</button>} */}
                {isLoaded  ?  (
                  
                    <PDFViewer style={{ width: '100%', height: '90vh' }}>
                        
                        <Document>
                        {Project_type && <Page  size="A4" style={{ flexDirection: 'column', backgroundColor: 'white' }}>






{this.state.QR_Data.map(QR_Data => 
   
<div>
    <View style={{ flexDirection: 'row'}}>
    <Image  src={QR_Data.generated_qr_project.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '220px' }} />
    {/* <Image  src={QR_Data.generated_qr_travel_to.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '65px' }} /> */}
    </View>
    

<View  
style={{ width: '90%', marginLeft: '5%', border: '2px solid black', position: 'absolute', marginTop: '240px', height: '72px'  }}>


<View style={{flexDirection: 'row'}}>
   
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Contact</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.contact_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Project</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.project_name}</Text>
</View>


<View style={{ marginTop: '35px' }}>
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Task</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.task_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Description</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.description_name}</Text>
</View>


</View>

</div>

    
)}
                               

                            </Page>}
                            {!Project_type && <Page  size="A4" style={{ flexDirection: 'column', backgroundColor: 'white' }}>






{this.state.QR_Data.map(QR_Data => 
   
<div>
    <View style={{ flexDirection: 'row'}}>
    <Image  src={QR_Data.generated_qr_travel_from.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '220px'}} />
    {/* <Image  src={QR_Data.generated_qr_travel_to.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '65px' }} /> */}
    </View>
    

<View  
style={{ width: '90%', marginLeft: '5%', border: '2px solid black', position: 'absolute', marginTop: '240px', height: '72px'  }}>


<View style={{flexDirection: 'row'}}>
   
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Contact</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.contact_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>From</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.project_name}</Text>
</View>


<View style={{ marginTop: '35px' }}>
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Task</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.task_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Description</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.description_name}</Text>
</View>


</View>

<View style={{ flexDirection: 'row'}}>
    <Image  src={QR_Data.generated_qr_travel_to.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '220px' }} />
    {/* <Image  src={QR_Data.generated_qr_travel_to.replace(/\s/g, '+')} style={{ maxHeight: '150px', width: '150px', marginTop: '90px', marginLeft: '65px' }} /> */}
    </View>
    

<View  
style={{ width: '90%', marginLeft: '5%', border: '2px solid black', position: 'absolute', marginTop: '480px', height: '72px'  }}>


<View style={{flexDirection: 'row'}}>
   
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Contact</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.contact_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>To</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.project_name}</Text>
</View>


<View style={{ marginTop: '35px' }}>
    <Text style={{ width: '29%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Task</Text>
    <Text style={{ marginLeft: '29%', width: '5%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.task_name}</Text>
    <Text style={{ marginLeft: '53%', width: '1%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>Description</Text>
    <Text style={{ marginLeft: '78%', width: '22%', borderBottom: '1px solid black', borderRight: '1px solid black', height: '35px', position: 'absolute', fontSize: 9, fontFamily: 'Segoe UI', paddingLeft: '3px', paddingTop: '9px' }}>{QR_Data.description_name}</Text>
</View>


</View>

</div>

    
)}
                               

                            </Page>}


                        </Document>
                    </PDFViewer>
                ) : (<div style={{ height: '85vh', paddingTop: '8%' }}><L></L></div>)}

            </div>
        )
    }
}

export default QR_PDF