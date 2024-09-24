'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Container, Col, Row, Button } from 'react-bootstrap';

// import sub components
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";

const PoolDetails = ({params} : {params : {slug : String}}) => {
    return (
        <Fragment>
            {/* <div className="bg-primary pt-10 pb-21"></div> */}
            <Container fluid className=" px-6">

                <Row className="my-6" >
                    <Col xl={4} lg={6} md={12} xs={12} className="mb-6 mb-xl-0" style={{marginRight:'0'}}>

                        <TasksPerformance option1="True" option2="False" title={params.slug} />

                    </Col>
                    <Col xl={8} lg={6} md={12} xs={12} style={{marginLeft:'0'}}>
                        <Teams pda={params.slug} />
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
export default PoolDetails;
