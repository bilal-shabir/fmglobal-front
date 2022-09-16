import React, { Suspense } from "react";
import { Col, Container, Row } from "shards-react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import L from "../../components/components-overview/loader";
import AnalyticsCards from "../../components/components-overview/Analytics/cards";
import { checkLanguage } from "../../utils";
import MonthlyChart from "../../components/components-overview/Analytics/Charts/monthlyChart";
import PieChart from "../../components/components-overview/Analytics/Charts/pieChart";


const rtl = checkLanguage();
function Analytics() {
  const { t } = useTranslation();
  
  return (
    <Suspense fallback={<L />}>
      <Container fluid className="main-content-container px-4">
        <Row noGutters className="page-header py-4">
          <h4 style={{ fontWeight: "600", color: "black" }}>
            {t("analytics_page_heading")}
          </h4>
        </Row>
        <AnalyticsCards />
        <Row style={{marginTop: '70px'}}>
            <Col>
                
                <div className="card" style={{background:'radial-gradient(circle, rgba(27,28,32,1) 0%, rgba(26,28,33,1) 0%, rgba(21,21,24,1) 50%)', padding:'10px'}} >
  
                    <MonthlyChart />
                </div>
            </Col>
            <Col>
            <div className="card" style={{padding:'10px'}} >
             <PieChart />
             </div>
            </Col>
        </Row>
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
          style={!rtl ? { marginLeft: "6%" } : { marginLeft: "-6%" }}
        />
      </Container>
    </Suspense>
  );
}
export default Analytics;
