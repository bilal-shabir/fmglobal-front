import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../common/PageTitle";
import SmallStats from "../common/SmallStats";
import Colors from "./TestColors";
import {URL} from '../../constants';
import {Link} from 'react-router-dom'


class Test extends React.Component{

  constructor(props) {
    super(props);
  
    const userIs_logged=localStorage.getItem('is_logged');
    const userEmail=localStorage.getItem('Email');
    const userToken=localStorage.getItem('Password');
    if(userIs_logged != 1){
      this.props.history.push("/login");
    }
    this.state = {
      smallStats: [],
      id: this.props.IdParentToChild,
      test: this.props.TestParentToChild,
      date :[]
    }
    
  }

  
  async componentDidMount() {
    const {id,test} = this.state
    //console.log(id);
   // console.log(test)
    const response =  await fetch(URL+'users/getAllWaterResults/'+id+'/'+test, {
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      })
      const json = await response.json()
      const data = json.data
      const limits = json.limits
      //console.log(json)
      let pHs = []
      let TDSs = []
      let TSSs = []
      let ATPs = []
      let temps = []
      let salinitys = []
      let chlorines = []
      let sulphates = []
      let fluorides = []// 9
      let potassiums = [] 
      let phosphates = []
      let phosphorouss = []
      let chlorides = []
      let Nitrate_Nitrogens = []
      let nitrates = []
      let conductivitys = []
      let ammoniums = []
      let coppers = []//9
      let silicas = []
      let irons = []
      let aluminums = []
      let zincs = []
      let nickels = []
      let phenolss = []
      let molybdenums = []
      let borons = []
      let silvers = []//9
      let formaldehydes = []
      let leads = []
      let cobalts = []
      let cyanides = []
      let manganeses = []
      let calciums = []
      let sodiums = []
      let magnesiums = []
      let Total_Hardness_dHs = []//9
      let SARs = []
      let dates = []

      for (let row of data) {
        const {dateadded,pH,TDS,TSS,ATP,temp,salinity,chlorine,sulphate,fluoride,potassium,phosphate,phosphorous,
          chloride,Nitrate_Nitrogen,nitrate,conductivity,ammonium,copper,silica,iron,aluminum,zinc,nickel,phenols,
          molybdenum,boron,silver,formaldehyde,lead,cobalt,cyanide,manganese,calcium,sodium,magnesium,Total_Hardness_mg_L_of_CaCO3,SAR
        } = row
        dates.push([dateadded])
        pHs.push([pH])
        TDSs.push([TDS])
        TSSs.push([TSS])
        ATPs.push([ATP])
        temps.push([temp])
        salinitys.push([salinity])
        chlorines.push([chlorine])
        sulphates.push([sulphate])
        fluorides.push([fluoride])
        potassiums.push([potassium])
        phosphates.push([phosphate])
        phosphorouss.push([phosphorous])
        chlorides.push([chloride])
        Nitrate_Nitrogens.push([Nitrate_Nitrogen])
        nitrates.push([nitrate])
        conductivitys.push([conductivity])
        ammoniums.push([ammonium])
        coppers.push([copper])
        silicas.push([silica])
        irons.push([iron])
        aluminums.push([aluminum])
        zincs.push([zinc])
        nickels.push([nickel])
        phenolss.push([phenols])
        molybdenums.push([molybdenum])
        borons.push([boron])
        silvers.push([silver])
        formaldehydes.push([formaldehyde])
        leads.push([lead])
        cobalts.push([cobalt])
        cyanides.push([cyanide])
        manganeses.push([manganese])
        calciums.push([calcium])
        sodiums.push([sodium])
        magnesiums.push([magnesium])
        Total_Hardness_dHs.push([Total_Hardness_mg_L_of_CaCO3])
        SARs.push([SAR])
      }
      const phfinal = pHs.map((i) => Number(i));
      const TDSfinal = TDSs.map((i) => Number(i));
      const TSSfinal = TSSs.map((i) => Number(i));
      const ATPfinal = ATPs.map((i) => Number(i));
      const tempfinal = temps.map((i) => Number(i));
      const salinityfinal = salinitys.map((i) => Number(i));
      const chlorinefinal = chlorines.map((i) => Number(i));
      const sulphatefinal = sulphates.map((i) => Number(i));
      const fluoridefinal = fluorides.map((i) => Number(i));
      const potassiumfinal = potassiums.map((i) => Number(i));
      const phosphatefinal = phosphates.map((i) => Number(i));
      const phosphorousfinal = phosphorouss.map((i) => Number(i));
      const chloridefinal = chlorides.map((i) => Number(i));
      const Nitrate_Nitrogenfinal = Nitrate_Nitrogens.map((i) => Number(i));
      const nitratefinal = nitrates.map((i) => Number(i));
      const conductivityfinal = conductivitys.map((i) => Number(i));
      const ammoniumfinal = ammoniums.map((i) => Number(i));
      const copperfinal = coppers.map((i) => Number(i));
      const silicafinal = silicas.map((i) => Number(i));
      const ironfinal = irons.map((i) => Number(i));
      const aluminumfinal = aluminums.map((i) => Number(i));
      const zincfinal = zincs.map((i) => Number(i));
      const nickelfinal = nickels.map((i) => Number(i));
      const phenolsfinal = phenolss.map((i) => Number(i));
      const molybdenumfinal = molybdenums.map((i) => Number(i));
      const boronfinal = borons.map((i) => Number(i));
      const silverfinal = silvers.map((i) => Number(i));
      const formaldehydefinal = formaldehydes.map((i) => Number(i));
      const leadfinal = leads.map((i) => Number(i));
      const cobaltfinal = cobalts.map((i) => Number(i));
      const cyanidefinal = cyanides.map((i) => Number(i));
      const manganesefinal = manganeses.map((i) => Number(i));
      const calciumfinal = calciums.map((i) => Number(i));
      const sodiumfinal = sodiums.map((i) => Number(i));
      const magnesiumfinal = magnesiums.map((i) => Number(i));
      const Total_Hardness_dH = Total_Hardness_dHs.map((i) => Number(i));
      const SARfinal = SARs.map((i) => Number(i));

      if(test != 'ByPass'){

        this.setState({
          smallStats: [
            {
              label: "pH Level",
              value:this.checkNUll(pHs),
              percentage: " ",
              // increase: " ",
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phfinal,limits.who_limits_pHmax) 
              ]
            },
             {
              label: "TDS",
              value: TDSs[0],
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                {
                  label: "Today",
                  fill: "start",
                  borderWidth: 1.5,
                  backgroundColor: "rgba(255,180,0,0.1)",
                  borderColor: "rgb(255,180,0)",
                  data: TDSfinal,
                }
              ]
            },
            {
              label: "TSS (mg/l)",
              value: this.checkNUll(TSSs),
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(TSSfinal,limits.who_limits_TSS) 
              ]
            },
            {
              label: "Total Hardness (mg/l of CaCO3)",
              value: this.checkNUll(Total_Hardness_dHs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(Total_Hardness_dHs,limits.who_limits_TotalHardness)
              ]
            },
            {
              label: "ATP (RLU)",
              value: this.checkNUll(ATPs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ATPs,limits.who_limits_ATP),
    
              ]
            },
            {
              label: "Chlorine(mg/l)",
              value: this.checkNUll(chlorines),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(chlorinefinal,limits.who_limits_chlorine),
              ]
            },
            {
              label: "Sulphate(mg/l)",
              value:this.checkNUll(sulphates),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(sulphatefinal,limits.who_limits_sulphate),        
              ]
            },
            {
              label: "Fluoride(mg/l)",
              value: this.checkNUll(fluorides),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(fluoridefinal,limits.who_limits_fluoride),  
              ]
            },
            {
              label: "Potassium(mg/l)",
              value: this.checkNUll(potassiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: { lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(potassiumfinal,limits.who_limits_potassium), 
                        ]
            },
            {
              label: "Phosphorous(mg/l)",
              value: this.checkNUll(phosphorouss),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phosphorousfinal,limits.who_limits_phosphorous),
              ]
            },
            {
              label: "Nitrate(mg/l)",
              value: this.checkNUll(nitrates),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(nitratefinal,limits.who_limits_nitrate),
              
              ]
            },
            {
              label: "Ammonium(mg/l)",
              value: this.checkNUll(ammoniums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ammoniumfinal,limits.who_limits_ammonium),
              ]
            },
            {
              label: "Copper(mg/l)",
              value: this.checkNUll(coppers),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(copperfinal,limits.who_limits_copper),
              ]
            },
            {
              label: "Silica(mg/l)",
              value: this.checkNUll(silicas),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(silicafinal,limits.who_limits_silica),
              ]
            },
            {
              label: "Iron(mg/l)",
              value: this.checkNUll(irons),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ironfinal,limits.who_limits_iron),
              ]
            },
            {
              label: "Aluminum(mg/l)",
              value: this.checkNUll(aluminums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(aluminumfinal,limits.who_limits_aluminum),
              ]
            },
            {
              label: "Zinc(mg/l)",
              value: this.checkNUll(zincs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(zincfinal,limits.who_limits_zinc),
              ]
            },
            {
              label: "Nickel(mg/l)",
              value: this.checkNUll(nickels),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(nickelfinal,limits.who_limits_nickel),
              ]
            },
            {
              label: "Phenols(mg/l)",
              value: this.checkNUll(phenolss),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phenolsfinal,limits.who_limits_phenols),
              ]
            },
            {
              label: "Molybdenum(mg/l)",
              value: this.checkNUll(molybdenums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(molybdenumfinal,limits.who_limits_molybdenum),
              ]
            },
            {
              label: "Boron(mg/l)",
              value: this.checkNUll(borons),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(boronfinal,limits.who_limits_boron),
              
              ]
            },
            {
              label: "Silver(mg/l)",
              value: this.checkNUll(silvers),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(silverfinal,limits.who_limits_silver),
              ]
            },
            {
              label: "Formaldehyde(mg/l)",
              value: this.checkNUll(formaldehydes),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(formaldehydefinal,limits.who_limits_formaldehyde),
              ]
            },
            {
              label: "Lead(mg/l)",
              value: this.checkNUll(leads),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(leadfinal,limits.who_limits_lead),
              ]
            },
            {
              label: "Cobalt(mg/l)",
              value: this.checkNUll(cobalts),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(cobaltfinal,limits.who_limits_cobalt),
              ]
            },
            {
              label: "Cyanide(mg/l)",
              value: this.checkNUll(cyanides),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(cyanidefinal,limits.who_limits_cyanide),
              ]
            },
            {
              label: "Manganese(mg/l)",
              value: this.checkNUll(manganeses),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(manganesefinal,limits.who_limits_manganese),
              ]
            },
            {
              label: "Calcium(mg/l)",
              value: this.checkNUll(calciums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(calciumfinal,limits.who_limits_calcium),
              ]
            },
            {
              label: "Sodium(mg/l)",
              value: this.checkNUll(sodiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(sodiumfinal,limits.who_limits_sodium),
              ]
            },
            {
              label: "Magnesium(mg/l)",
              value: this.checkNUll(magnesiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(magnesiumfinal,limits.who_limits_magnesium),
              ]
            },
          ],
          // smallStats2: [
          //   {
          //     label: "chloride",
          //     value: chlorides[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: chloridefinal,
          //       }
          //     ]
          //   },
          //   // {
          //   //   label: "Nitrate_Nitrogen",
          //   //   value: Nitrate_Nitrogens[0],
          //   //   percentage: " ",
          //   //   increase: false,
          //   //   chartLabels: [null, null, null, null, null, null, null],
          //   //   attrs: {  lg:"2", md: "6", sm: "6" },
          //   //   datasets: [
          //   //     {
          //   //       label: "Today",
          //   //       fill: "start",
          //   //       borderWidth: 1.5,
          //   //       backgroundColor: "rgba(255,180,0,0.1)",
          //   //       borderColor: "rgb(255,180,0)",
          //   //       data: Nitrate_Nitrogenfinal,
          //   //     }
          //   //   ]
          //   // },
          //   {
          //     label: "conductivity",
          //     value: conductivitys[0],
          //     percentage: " ",
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: { lg:"4" , lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: conductivityfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "temp",
          //     value: temps[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: tempfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "Salinity",
          //     value: salinitys[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: salinityfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "formaldehyde",
          //     value: formaldehydes[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: formaldehydefinal,
          //       }
          //     ]
          //   },
            
          //],
          date :dates,
          
        })

      }else {

        this.setState({
          smallStats: [
            {
              label: "pH Level",
              value:this.checkNUll(pHs),
              percentage: " ",
              // increase: " ",
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phfinal,limits.fao_limits_pHmax) 
              ]
            },
            {
              label: "TDS",
              value: this.checkNUll(TDSs),
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [this.datasets(TDSfinal,limits.fao_limits_TDSmax)]
            },
            {
              label: "SAR",
              value: this.checkNUll(SARs),
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [this.datasets(SARfinal,limits.fao_limits_TDSmax)]
            },
            {
              label: "TSS (mg/l)",
              value: this.checkNUll(TSSs),
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(TSSfinal,limits.fao_limits_TSS) 
              ]
            },
            {
              label: "Total Hardness (mg/l of CaCO3)",
              value: this.checkNUll(Total_Hardness_dHs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(Total_Hardness_dHs,limits.fao_limits_TotalHardness)
              ]
            },
            {
              label: "ATP (RLU)",
              value: this.checkNUll(ATPs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ATPs,limits.fao_limits_ATP),
    
              ]
            },
            {
              label: "Chlorine(mg/l)",
              value: this.checkNUll(chlorines),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(chlorinefinal,limits.fao_limits_chlorine),
              ]
            },
            {
              label: "Sulphate(mg/l)",
              value:this.checkNUll(sulphates),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(sulphatefinal,limits.fao_limits_sulphate),        
              ]
            },
            {
              label: "Fluoride(mg/l)",
              value: this.checkNUll(fluorides),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(fluoridefinal,limits.fao_limits_fluoride),  
              ]
            },
            {
              label: "Potassium(mg/l)",
              value: this.checkNUll(potassiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: { lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(potassiumfinal,limits.fao_limits_potassium), 
                        ]
            },
            {
              label: "Phosphorous(mg/l)",
              value: this.checkNUll(phosphorouss),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phosphorousfinal,limits.fao_limits_phosphorous),
              ]
            },
            {
              label: "Nitrate(mg/l)",
              value: this.checkNUll(nitrates),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(nitratefinal,limits.fao_limits_nitrate),
              
              ]
            },
            {
              label: "Ammonium(mg/l)",
              value: this.checkNUll(ammoniums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ammoniumfinal,limits.fao_limits_ammonium),
              ]
            },
            {
              label: "Copper(mg/l)",
              value: this.checkNUll(coppers),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(copperfinal,limits.fao_limits_copper),
              ]
            },
            {
              label: "Silica(mg/l)",
              value: this.checkNUll(silicas),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(silicafinal,limits.fao_limits_silica),
              ]
            },
            {
              label: "Iron(mg/l)",
              value: this.checkNUll(irons),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(ironfinal,limits.fao_limits_iron),
              ]
            },
            {
              label: "Aluminum(mg/l)",
              value: this.checkNUll(aluminums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(aluminumfinal,limits.fao_limits_aluminum),
              ]
            },
            {
              label: "Zinc(mg/l)",
              value: this.checkNUll(zincs),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(zincfinal,limits.fao_limits_zinc),
              ]
            },
            {
              label: "Nickel(mg/l)",
              value: this.checkNUll(nickels),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(nickelfinal,limits.fao_limits_nickel),
              ]
            },
            {
              label: "Phenols(mg/l)",
              value: this.checkNUll(phenolss),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(phenolsfinal,limits.fao_limits_phenols),
              ]
            },
            {
              label: "Molybdenum(mg/l)",
              value: this.checkNUll(molybdenums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(molybdenumfinal,limits.fao_limits_molybdenum),
              ]
            },
            {
              label: "Boron(mg/l)",
              value: this.checkNUll(borons),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(boronfinal,limits.fao_limits_boronmax),
              
              ]
            },
            {
              label: "Silver(mg/l)",
              value: this.checkNUll(silvers),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(silverfinal,limits.fao_limits_silver),
              ]
            },
            {
              label: "Formaldehyde(mg/l)",
              value: this.checkNUll(formaldehydes),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(formaldehydefinal,limits.fao_limits_formaldehyde),
              ]
            },
            {
              label: "Lead(mg/l)",
              value: this.checkNUll(leads),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(leadfinal,limits.fao_limits_lead),
              ]
            },
            {
              label: "Cobalt(mg/l)",
              value: this.checkNUll(cobalts),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                 this.datasets(cobaltfinal,limits.fao_limits_cobalt),
              ]
            },
            {
              label: "Cyanide(mg/l)",
              value: this.checkNUll(cyanides),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(cyanidefinal,limits.fao_limits_cyanide),
              ]
            },
            {
              label: "Manganese(mg/l)",
              value: this.checkNUll(manganeses),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(manganesefinal,limits.fao_limits_manganese),
              ]
            },
            {
              label: "Calcium(mg/l)",
              value: this.checkNUll(calciums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(calciumfinal,limits.fao_limits_calcium),
              ]
            },
            {
              label: "Sodium(mg/l)",
              value: this.checkNUll(sodiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(sodiumfinal,limits.fao_limits_sodium),
              ]
            },
            {
              label: "Magnesium(mg/l)",
              value: this.checkNUll(magnesiums),
              percentage: " ",
              increase: false,
              chartLabels: [null, null, null, null, null, null, null],
              attrs: {  lg:"2", md: "6", sm: "6" },
              datasets: [
                this.datasets(magnesiumfinal,limits.fao_limits_magnesium),
              ]
            },
          ],
          // smallStats2: [
          //   {
          //     label: "chloride",
          //     value: chlorides[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: chloridefinal,
          //       }
          //     ]
          //   },
          //   // {
          //   //   label: "Nitrate_Nitrogen",
          //   //   value: Nitrate_Nitrogens[0],
          //   //   percentage: " ",
          //   //   increase: false,
          //   //   chartLabels: [null, null, null, null, null, null, null],
          //   //   attrs: {  lg:"2", md: "6", sm: "6" },
          //   //   datasets: [
          //   //     {
          //   //       label: "Today",
          //   //       fill: "start",
          //   //       borderWidth: 1.5,
          //   //       backgroundColor: "rgba(255,180,0,0.1)",
          //   //       borderColor: "rgb(255,180,0)",
          //   //       data: Nitrate_Nitrogenfinal,
          //   //     }
          //   //   ]
          //   // },
          //   {
          //     label: "conductivity",
          //     value: conductivitys[0],
          //     percentage: " ",
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: { lg:"4" , lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: conductivityfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "temp",
          //     value: temps[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: tempfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "Salinity",
          //     value: salinitys[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: salinityfinal,
          //       }
          //     ]
          //   },
          //   {
          //     label: "formaldehyde",
          //     value: formaldehydes[0],
          //     percentage: " ",
          //     increase: false,
          //     chartLabels: [null, null, null, null, null, null, null],
          //     attrs: {  lg:"2", md: "6", sm: "6" },
          //     datasets: [
          //       {
          //         label: "Today",
          //         fill: "start",
          //         borderWidth: 1.5,
          //         backgroundColor: "rgba(255,180,0,0.1)",
          //         borderColor: "rgb(255,180,0)",
          //         data: formaldehydefinal,
          //       }
          //     ]
          //   },
             // {
            //   label: "TDS",
            //   value: TDSs[0],
            //   percentage: " ",
            //   increase: false,
            //   chartLabels: [null, null, null, null, null, null, null],
            //   attrs: {  lg:"2", md: "6", sm: "6" },
            //   datasets: [
            //     {
            //       label: "Today",
            //       fill: "start",
            //       borderWidth: 1.5,
            //       backgroundColor: "rgba(255,180,0,0.1)",
            //       borderColor: "rgb(255,180,0)",
            //       data: TDSfinal,
            //     }
            //   ]
            // },
          //],
           date :dates,
          
        })

      }
      
  }

  checkNUll(data){
    let value =""
    //console.log(data[0]);
    if(data[0][0] != null){

      value = Math.round((data[0]) * 100) / 100

    }else {

      value = "#N/A"
    }
    return value;
  }
  

  datasets(data,who){
    //console.log(who)
    let dataset = ""
    if(data.length != 7) {

      dataset = {
        label: "Today",
        fill: "start",
        borderWidth: 1.5,
        data: "",
      }

    }else {

      if(who){

        //Stable Over 8 Readings
        if( data[0] < who & data[1] < who & data[2] < who & data[3] < who & data[4] < who & data[5] < who & data[6] < who){
          
          dataset = {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(23,198,113,0.1)",
            borderColor: "rgba(23,198,113)",
            data: data.reverse(),
          }
  
         } //Outside Limits Over 4 Readings
         else if(who <  data[0] && who < data[1] && who <  data[2] && who < data[3]){
          
          dataset = {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255,65,105,0.1)",
            borderColor: "rgba(255,65,105)",
            data: data.reverse(),
          }
          
        
        }  //Improving Over 4 Readings 
        else if((who > data[0] & who > data[1] & who > data[2] & who > data[3]) && (who < data[4] & who < data[5] & who < data[6])){
          
          dataset = {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255,180,0,0.1)",
            borderColor: "rgba(255,180,0)",
            data: data.reverse(),
          }
        
        }//Getting Worse Over 4 Readings 
        else if(who < (data[0] & data[1] & data[2] & data[3]) && who > (data[4] & data[5] & data[6])){
  
          dataset = {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255, 187, 138,0.1)",
            borderColor: "rgba(255, 187, 138)",
            data: data.reverse(),
          }
        }else {
  
          dataset = {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(255,180,0,0.1)",
            borderColor: "rgba(255,180,0)",
            data: data.reverse(),
          }
  
        }
      }else {
        dataset = {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          data: "",
        }
      }

    }
    
    //console.log(dataset)
    return dataset;
  }


  render (){
    return (
  <Container fluid className="main-content-container px-4">
    {/* Page Header */}
    <Row noGutters className="page-header py-4">
      <PageTitle title={this.state.test+" Water Testing Result"}  subtitle="Overview" className="text-sm-left mb-3" />
    </Row>

    {/* Small Stats Blocks */}
    <Row >
      {this.state.smallStats.map((stats, idx) => (
        <Col className="col-lg mb-5" key={idx} {...stats.attrs}>
          <SmallStats
            id={`small-stats-${idx}`}
            variation="1"
            chartData={stats.datasets}
            chartLabels={stats.chartLabels}
            label={stats.label}
            value={stats.value}
          />
        </Col>
      ))}
    </Row>
    
    <Colors />
      Test Date :{this.state.date[0]} -- Product Water
      <Col className="text-right view-report">
        {/* eslint-disable-next-line */}

        {/* changes */}
        <Link to={`/WaterSystem/${this.state.id}/${this.state.test}`}>Full report &rarr;</Link>
        {/* changes */}
        
      </Col>
  </Container>
); 
}
}

export default Test;

