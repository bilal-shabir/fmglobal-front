import React from "react";
import { Row, Col, Button,Container } from "shards-react";
import Chart from "react-google-charts";
import {URL} from '../../constants';

class WaterButton extends React.Component{

  constructor(props) {
        super(props);
        const userIs_logged=localStorage.getItem('is_logged');
        // const userEmail=localStorage.getItem('Email');
        // const userToken=localStorage.getItem('Token');
        // const UserId=localStorage.getItem('ID'); 

        if(userIs_logged !== 1){
        this.props.history.push("/login");
        }

        this.state = {
            data : [],
            metadata:'',
            limit : '',
            limitvalues : '',
            dataLoadingStatus: 'loading',
            chartData: [],
            chemicalCODE:"",
            pid:this.props.id,
            type:this.props.type,
            series:[]
        }
        
    }

    async componentDidMount() {
        const {pid,type} = this.state
        const chemical_CODE = 'pH';
        const response = await fetch(URL+'users/drwChartPerButton/'+pid+'/'+chemical_CODE+'/'+type,{
            headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
            },
            method: 'GET',
        })
        const json = await response.json()
        const data = json.data
        //console.log(type,data)
        if(type !== 'ByPass'){

          const columns = [
            { type: 'date', label: 'Year' },
            { type: 'number', label: 'Pavilion Water' },
            { type: 'number', label: 'Bahrain Tap Water' },
            { type: 'number', label: 'Min WHO Limit' },
            { type: 'number', label: 'Max WHO Limit' },
            { type: 'number', label: 'Min International Laboratories Limit' },
            { type: 'number', label: 'Max International Laboratories Limit' },
            { type: 'number', label: 'Feed Water' },
            ]
            let rows = []
            for (let row of data) {
            const {dateadded,CH,tap_watermin,ASmin,ASmax,internMin,internMAX,FEEDCH} = row
            rows.push([new Date(Date.parse(dateadded)),CH,tap_watermin,ASmin,ASmax,internMin,internMAX,FEEDCH])
            // console.log(rows);
            }
            this.setState({
            chartData: [columns, ...rows],
            dataLoadingStatus: 'ready',
            chemicalCODE:chemical_CODE,
            series: {
              // Gives each series an axis name that matches the Y-axis below.
              0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
              1: { color: '#f1ca3a',lineDashStyle: [14, 2, 2, 7] , lineWidth: 4},
              2: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
              3: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
              4: { color: '#15967f' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
              5: { color: '#15967f' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
              6: { color: '#702391'  ,curveType: 'function' ,pointShape: 'circle', pointSize: 7 },
              //4: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
            }
            })
        }else {
          const columns = [
          { type: 'date', label: 'Year' },
          { type: 'number', label: 'Pavilion Water' },
          { type: 'number', label: 'Min FAO Limit' },
          { type: 'number', label: 'Max FAO Limit' },
          { type: 'number', label: 'Feed Water' },
          ]
          let rows = []
          for (let row of data) {
          const {dateadded,CH,min,max,FEEDCH} = row
          rows.push([new Date(Date.parse(dateadded)),CH,min,max,FEEDCH])
          // console.log(rows);
          }
          this.setState({
          chartData: [columns, ...rows],
          dataLoadingStatus: 'ready',
          chemicalCODE:chemical_CODE,
          series: {
            // Gives each series an axis name that matches the Y-axis below.
            0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
            1: { color: '#f1ca3a',lineDashStyle: [14, 2, 2, 7] , lineWidth: 4},
            2: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
            3: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4,curveType: 'function'  },
            //4: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
          }
          })
        }     
    }

    async handleSubmit(e) {
            const {pid,type} = this.state
            const chemical_CODE = e.target.value;

            const response = await fetch(URL+'users/drwChartPerButton/'+pid+'/'+chemical_CODE+'/'+type,{
                headers : { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                method: 'GET',
            })
            const json = await response.json()
            const data = json.data

            if(type !== 'ByPass'){

              if(chemical_CODE !== 'pH'){
                const columns = [
                { type: 'date', label: 'Year' },
                { type: 'number', label: 'Pavilion Water' },
                { type: 'number', label: 'Bahrain Tap Water' },
                { type: 'number', label: 'Max WHO Limit' },
                { type: 'number', label: 'Max International Laboratories Limit' },
                { type: 'number', label: 'Feed Water' },
                ]
                let rows = []
                for (let row of data) {
                const {dateadded,CH,tap_water,ASlimit,intern_limits,FEEDCH} = row
                rows.push([new Date(Date.parse(dateadded)), CH,tap_water,ASlimit,intern_limits,FEEDCH])
                // console.log(rows);
                }
                this.setState({
                chartData: [columns, ...rows],
                dataLoadingStatus: 'ready',
                chemicalCODE:chemical_CODE,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
                  1: { color: '#f1ca3a',lineDashStyle: [14, 2, 2, 7] , lineWidth: 4},
                  2: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  3: { color: '#15967f' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  }, 
                  4: {color: '#702391'  ,curveType: 'function' ,pointShape: 'circle', pointSize: 7 },
                           
                }
                })
            }if(chemical_CODE === 'pH'){
              const columns = [
                { type: 'date', label: 'Year' },
                { type: 'number', label: 'Pavilion Water' },
                { type: 'number', label: 'Bahrain Tap Water' },
                { type: 'number', label: 'Min WHO Limit' },
                { type: 'number', label: 'Max WHO Limit' },
                { type: 'number', label: 'Min International Laboratories Limit' },
                { type: 'number', label: 'Max International Laboratories Limit' },
                { type: 'number', label: 'Feed Water' },
                ]
                let rows = []
                for (let row of data) {
                const {dateadded,CH,tap_watermin,ASmin,ASmax,internMin,internMAX,FEEDCH} = row
                rows.push([new Date(Date.parse(dateadded)),CH,tap_watermin,ASmin,ASmax,internMin,internMAX,FEEDCH])
                // console.log(rows);
                }
                this.setState({
                chartData: [columns, ...rows],
                dataLoadingStatus: 'ready',
                chemicalCODE:chemical_CODE,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
                  1: { color: '#f1ca3a',lineDashStyle: [14, 2, 2, 7] , lineWidth: 4},
                  2: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  3: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  4: { color: '#15967f' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  5: { color: '#15967f' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  6: { color: '#702391'  ,curveType: 'function' ,pointShape: 'circle', pointSize: 7 },
                  //4: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
                }
                })
            }

            }else {

              if(chemical_CODE !== 'pH'){
                const columns = [
                { type: 'date', label: 'Year' },
                { type: 'number', label: 'Pavilion Water' },
                { type: 'number', label: 'Max FAO Limit' },
                { type: 'number', label: 'Feed Water' },
                ]
                let rows = []
                for (let row of data) {
                const {dateadded,CH,FAOlimit,FEEDCH} = row
                rows.push([new Date(Date.parse(dateadded)), CH,FAOlimit,FEEDCH])
                }
                this.setState({
                chartData: [columns, ...rows],
                dataLoadingStatus: 'ready',
                chemicalCODE:chemical_CODE,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
                  1: { color: '#c72c2c' ,lineDashStyle: [14, 2, 2, 7] , lineWidth: 4},
                  2: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4,curveType: 'function' },
                  //3: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
                }
                })
            }if((chemical_CODE === 'pH') || (chemical_CODE === 'TDS') || (chemical_CODE === 'conductivity') || (chemical_CODE === 'boron')){
                const columns = [
                { type: 'date', label: 'Year' },
                { type: 'number', label: 'Pavilion Water' },
                { type: 'number', label: 'Min FAO Limit' },
                { type: 'number', label: 'Max FAO Limit' },
                { type: 'number', label: 'Feed Water' },
                ]
                let rows = []
                for (let row of data) {
                  const {dateadded,CH,min,max,FEEDCH} = row
                  rows.push([new Date(Date.parse(dateadded)),CH,min,max,FEEDCH])
                // console.log(rows);
                }
                this.setState({
                chartData: [columns, ...rows],
                dataLoadingStatus: 'ready',
                chemicalCODE:chemical_CODE,
                series: {
                  // Gives each series an axis name that matches the Y-axis below.
                  0: { axis: this.state.chemicalCODE ,curveType: 'function', color: '#0c76c7' , pointShape: 'circle', pointSize: 7 },
                  1: { color: '#f1ca3a' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },
                  2: { color: '#c72c2c' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 },
                  3: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4 , curveType: 'function' },
                  //4: { color: '#702391' , lineDashStyle: [14, 2, 2, 7] , lineWidth: 4  },          
                }
                })
            }

          }
              
        }

  render(){
    return(
      <Container fluid className="main-content-container px-4">
      <div>
        <Row>
        <Col>
          <Button onClick={e => this.handleSubmit(e, "value")} outline size="sm" theme="primary" className="mb-2 mr-1" value={"pH"}>
            pH
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")} outline size="sm" theme="primary" className="mb-2 mr-1" value={"TDS"}>
            TDS
          </Button>
          <Button  onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"TSS"}>
            TSS
          </Button>
          <Button  onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"Total_Hardness_mg_L_of_CaCO3"}>
            Total Hardness
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"ATP"}>
            ATP
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"Chlorine"}>
            Chlorine
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"Sulphate"}>
            Sulphate
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"fluoride"}>
            Flouride
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"potassium"}>
            Potassium
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"phosphorous"}>
            Phosphorous
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"nitrate"}>
          Nitrate
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"ammonium"}>
          Ammonium
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"copper"}>
          Copper
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"silica"}>
          Silica
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"iron"}>
          Iron
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"aluminum"}>
          Aluminum
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"zinc"}>
          Zinc
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"nickel"}>
          Nickel
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"phenols"}>
          Phenols
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"molybdenum"}>
          Molybdenum
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"boron"}>
          Boron
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"silver"}>
          Silver
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"formaldehyde"}>
          Formaldehyde
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"lead"}>
          Lead
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"cobalt"}>
          Cobalt
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"cyanide"}>
          Cyanide
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"manganese"}>
          Manganese
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"calcium"}>
          Calcium
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"sodium"}>
          Sodium
          </Button>
          <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"magnesium"}>
          Magnesium
          </Button>
          {this.state.type ==='ByPass' ? 
            <Button onClick={e => this.handleSubmit(e, "value")}outline size="sm" theme="primary" className="mb-2 mr-1" value={"SAR"}>
            SAR
            </Button>
          : null }
        
        </Col>
        </Row>
        

        <Row>
            <Chart
                width={'100%'}
                height={'100%'}
                chartType="LineChart"
                loader = {this.state.dataLoadingStatus}
                data={this.state.chartData}
                options={{  

                chart: {
                    title:this.state.chemicalCODE,
                },
                width: '100%',
                height: 700,
                series: this.state.series,
                trendlines: { 0: {} },
                hAxis: {
                    formatr: 'yyyy',
                },
                vAxis: {
                format: 'short',
                },
                title: this.state.chemicalCODE+' Level',
                interpolateNulls:true
                }
                }
                rootProps={{ 'data-testid': '1' }}
            />
        
        </Row>
      </div>
      </Container>
    )
  }
  
}

export default WaterButton;
