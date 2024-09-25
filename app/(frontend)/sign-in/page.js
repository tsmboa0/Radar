'use client'

import { loginAction } from '../../api/server/route';
import { getCsrfToken } from 'next-auth/react';

// import node module libraries
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import Link from 'next/link';

// import hooks
import useMounted from 'hooks/useMounted';
import { Google, TwitterX } from 'react-bootstrap-icons';
import { useSearchParams } from 'next/navigation';

const SignIn = () => {
  const hasMounted = useMounted();
  const search = useSearchParams();
  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100" style={{borderTop:'2px solid black'}}>
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/">
                {/* <Image src="/images/brand/logo/logo-primary.svg" className="mb-2" alt="" /> */}
                <h2 style={{fontWeight:'bold'}}>Betlify</h2>
              </Link>
              <p className="mb-6">Register / Login Using Any Of The Methods Below</p>
            </div>
              <Form action={loginAction}>
                <div>
                  {/* <div className="d-grid" style={{marginBottom:'0.8rem'}}>
                    <Button variant="primary" name="provider" value="google" type="submit"><Google /> Sign In With Google</Button>
                  </div> */}
                  <div className="d-grid">
                    <Button variant="primary" style={{backgroundColor:'black', color:'whitesmoke', border:'none'}} name="provider" value="twitter" type="submit"><TwitterX/> Sign In With X</Button>
                  </div>
                </div>
              </Form>


          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}


export default SignIn