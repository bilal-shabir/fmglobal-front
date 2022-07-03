// import React from "react";
// import Plot from 'react-plotly.js';
// import ReactECharts from 'echarts-for-react';
// import Echart1 from "../components/components-overview/chart1";
// import { Card, CardHeader, CardBody,Col, Container, Row } from "shards-react";

// class Plotly extends React.Component{

//     constructor(props){
//         super(props)

//         this.state ={

//             data : [
//                 {
//                     y: [0.2, 0.2, 0.6, 1.0, 0.5, 0.4, 0.2, 0.7, 0.9, 0.1, 0.5, 0.3],
//                     x: ['day 1', 'day 1', 'day 1', 'day 1', 'day 1', 'day 1',
//                     'day 2', 'day 2', 'day 2', 'day 2', 'day 2', 'day 2'],
//                     name: 'kale',
//                     marker: {color: '#3D9970'},
//                     type: 'box'
//                   },
//                   {
//                     y: [0.6, 0.7, 0.3, 0.6, 0.0, 0.5, 0.7, 0.9, 0.5, 0.8, 0.7, 0.2],
//                     x: ['day 1', 'day 1', 'day 1', 'day 1', 'day 1', 'day 1',
//                     'day 2', 'day 2', 'day 2', 'day 2', 'day 2', 'day 2'],
//                     name: 'radishes',
//                     marker: {color: '#FF4136'},
//                     type: 'box'
//                   }
//                   ,
//                   {
//                     y: [0.1, 0.3, 0.1, 0.9, 0.6, 0.6, 0.9, 1.0, 0.3, 0.6, 0.8, 0.5],
//                     x: ['day 1', 'day 1', 'day 1', 'day 1', 'day 1', 'day 1',
//                     'day 2', 'day 2', 'day 2', 'day 2', 'day 2', 'day 2'],
//                     name: 'carrots',
//                     marker: {color: '#FF851B'},
//                     type: 'box'
//                   },
                 
                 
//               ],
//               layout : {
//                 yaxis: {
//                   title: 'normalized moisture',
//                   zeroline: false
//                 },
//                 boxmode: 'group'
//               }

//         }
//     }

//     render(){
//         return(
//             <Container>
//                 <Card>
//                     <CardHeader>Hello</CardHeader>
//                     <CardBody>
//                     <Plot
//                        data = {[
//                         {
//                             x: [1, 2, 3, 4, 5, 6, 7, 8],
//                             y: [10, 15, null, 17, 14, 12, 10, null, 15],
//                             mode: 'lines+markers',
//                             connectgaps: true
//                           },
//                           {
//                             x: [1, 2, 3, 4, 5, 6, 7, 8],
//                             y: [16, null, 13, 10, 8, null, 11, 12],
//                             mode: 'lines+markers',
//                             connectgaps: true
//                           }
//                           ,
                          
                         
                         
//                       ]}
//                       layout ={ {
//                           width: 700,
//                           height:500,
//                           title: 'Connect the Gaps Between Data',
//                           showlegend: false
//                       }}
//                     />
                    
//                     </CardBody>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     Hello
//                   </CardHeader>
//                   <CardBody>
//                   <Echart1></Echart1>
//                   </CardBody>
//                 </Card>
                
//             </Container>
//         )
        
//     }

// }

// export default Plotly