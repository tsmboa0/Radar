'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row } from 'react-bootstrap';

// import widget/custom components
import { StatRightTopIcon2 } from "widgets";
// import required data files
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";

const CreatePool = () => {

    return (
        <Fragment>
            <Container fluid className=" px-6">
                <Row>
                    <Col lg={12} md={12} xs={12}>
                        <div>
                            <div className="d-flex justify-content-between align-items-center" style={{marginTop:'1rem'}}>
                                <div className="mb-2 mb-lg-0">
                                    <h2 className="mb-0  text-black" style={{fontWeight:'bold'}}>Browse Template</h2>
                                </div>
                                <div>
                                    <Link href="/create" className="btn btn-white" style={{backgroundColor:'#624BFF', color:'whitesmoke'}}>Request New Template</Link>
                                </div>
                            </div>
                            <p style={{marginTop:'0.8rem'}}>Choose a pool template that best suite your event from the lists of templates below. You can also request for a new tmeplate to be added in the future.</p>
                        </div>
                    </Col>
                    {ProjectsStatsData.map((item, index) => {
                        return (
                            <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mt-6" key={index}> 
                                <StatRightTopIcon2 info={item} />
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </Fragment>
    )
}
export default CreatePool;
