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
    console.log("The session user is: ",session?.user.name);

    useEffect(()=>{
        const fetchPools = async()=>{
            console.log("starting pools fetch...");
            const user = session?.user?.name;
            const url = `/api/server/database/?action=getmanagerpools&user=${user}`;

            try{
                const response = await fetch(url, {
                    method: "GET"
                });

                if(response.status == 200){
                    const result = await response.json();
                    console.log("pool 0 poolTitle is: ",result[0].poolTitle);
                    setPools(result);
                    setIsLoading(false);
                }else{
                    console.log("no pools");
                    setNoPool(true);
                    setIsLoading(false);
                }
            }catch(e){
                console.log("An error occured while fetching manager pools: ",e)
            }

        }

        fetchPools();
    },[]);

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
                                    <Col xl={3} lg={4} md={6} sm={6} xs={12} className="mt-6" key={index}>
                                        <Card style={{ width: '15rem' }}>
                                            <Image variant="top" src={item.uploadUrl} width={100} height={100} style={{ width: '15rem', height:'auto' }} alt="Pool Image"/>
                                            <Card.Body>
                                                <h6 style={{margin: '0', fontWeight:'bold', color:'black'}}>{item.poolTitle}</h6>
                                                <Card.Text style={{fontSize:'12px'}}>
                                                    {(item.desc).substring(0,25)}
                                                </Card.Text>
                                                <Link href={`/pool/${item.pdaBase58}`}>
                                                    <Button variant="primary" style={{padding:'7px', backgroundColor:'black',border:'none'}}>Manage</Button>
                                                </Link>
                                            </Card.Body>
                                        </Card>
                                    </Col>
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
