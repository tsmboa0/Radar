'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';

import Image from 'next/image';
import {
	Col,
	Row,
	Button,
	Card,
	Container
} from 'react-bootstrap';
import mockup from "public/images/background/true-or-false.png";

import { useRouter } from "next/navigation";

const CreatePool = () => {
    const router = useRouter();

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
                                    <Link href="/create" className="btn btn-white" style={{backgroundColor:'black', color:'whitesmoke'}}>Request</Link>
                                </div>
                            </div>
                            <p style={{marginTop:'0.8rem'}}>Choose a pool template that best suite your event from the lists of templates below. You can also request for a new tmeplate to be added in the future.</p>
                        </div>
                    </Col>
                    <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mt-6"> 
                        <Card style={{ width: '15rem' }}>
                            <Image variant="top" src={mockup} style={{ width: '15rem', height:'auto' }} />
                            <Card.Body>
                                <Card.Title style={{margin: '0', fontWeight:'bold', color:'black'}}>TRUE or FALSE</Card.Title>
                                <Card.Text style={{fontSize:'12px'}}>
                                    suitable for markets with two options. either true or false.
                                </Card.Text>
                                <Button onClick={()=>router.push('/create/true-or-false')} variant="primary" style={{backgroundColor:'black', border:'none'}}>Use Template</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    )
}
export default CreatePool;
