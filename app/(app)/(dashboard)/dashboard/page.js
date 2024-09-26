'use client'
// import node module libraries
import { Fragment, useEffect, useState } from "react";
import Link from 'next/link';
import { Container, Col, Row,Button,Card, Spinner,} from 'react-bootstrap';
import Image from "next/image";

import { getManagerPools } from "app/api/server/database/route";
import { useSession } from "next-auth/react";

const Home = () => {

    const {data: session, status} = useSession();
    const [pools, setPools] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noPool, setNoPool] = useState(true);
    const _user = session?.user?.name;
    console.log(session?.user);

    useEffect(()=>{
        const data = new FormData();
        data.append("user", _user);
        const fetchPools = async()=>{
            console.log("starting pools fetch...");
            const response = await getManagerPools(data);
            if(response !== null){
                const result = [...JSON.parse(response)];
                console.log("pool 0 poolTitle is: ",result[0].poolTitle);
                setPools(result);
                setIsLoading(false);
            }else{
                console.log("no pools");
                setNoPool(true);
                setIsLoading(false);
            }

        }

        fetchPools();
    },[_user]);

    return (
        <Fragment>
            <Container fluid className=" px-6">
                <Row style={{marginBottom:'1rem'}}>
                    <Col lg={12} md={12} xs={12}>
                        <div>
                            <div className="d-flex justify-content-between align-items-center" style={{marginTop:'1rem'}}>
                                <div className="mb-2 mb-lg-0">
                                    <h3 className="mb-0  text-black" style={{fontWeight:'bold'}}>Welcome {session?.user?.name}</h3>
                                </div>
                                <div>
                                    <Link href="/create" className="btn btn-white" style={{backgroundColor:'black', color:'whitesmoke'}}>Create New Pool</Link>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
                <section style={{display:'flex', flexFlow:'row wrap', gap:'0.9rem', justifyContent:'center', alignItems:'center'}}>
                    {!isLoading ? (
                        pools.length > 0 ? (
                            pools.map((item, index) => {
                                return (
                                    <Card style={{ width: '10rem' }} key={index}>
                                        <Image variant="top" src={item.uploadUrl} width={100} height={100} style={{ width: '100%', height:'auto' }} alt="Pool Image"/>
                                        <Card.Body>
                                            <h6 style={{margin: '0', fontWeight:'bold', color:'black'}}>{item.poolTitle}</h6>
                                            <Card.Text style={{fontSize:'12px'}}>
                                                {(item.desc).substring(0,25)}
                                            </Card.Text>
                                            <Link href={`/pool/${item.pda}`}>
                                                <Button variant="primary" style={{padding:'7px', backgroundColor:'black',border:'none'}}>Manage</Button>
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        ): (
                            <div>You have no bet pool. Click the create button to create a bet pool</div>
                        )
                    ) : (
                        <div>Loading...</div>
                    )}
                </section>
            </Container>
        </Fragment>
    )
}
export default Home;
