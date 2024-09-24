// import node module libraries
"use client"

import Link from 'next/link';
import { Fragment } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Row,
    Col,
    Image,
    Dropdown,
    ListGroup,
    Button
} from 'react-bootstrap';

import { useSession } from 'next-auth/react';
import { logOutAction } from 'app/api/server/route';

// simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import hooks
import useMounted from '../hooks/useMounted';
import { redirect } from 'next/navigation';

const QuickMenu = () => {
    const {data: session, status} = useSession();
    const hasMounted = useMounted();
    
    const isDesktop = useMediaQuery({
        query: '(min-width: 1224px)'
    })

    const QuickMenuDesktop = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <Image alt="avatar" src={session?.user?.image} className="rounded-circle" />
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-end "
                    align="end"
                    aria-labelledby="dropdownUser"
                    show
                    >
                    <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1"> {session?.user?.name}</h5>
                                <Link href="#" className="text-inherit fs-6">View my profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                    </Dropdown.Item>
                    <Dropdown.Item >
                        <i className="fe fe-settings me-2"></i> Account Settings
                    </Dropdown.Item>
                    <form action={logOutAction}>
                        <Button size="sm" type='submit'>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Button>
                    </form>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup>
    )}

    const QuickMenuMobile = () => {
        return (
        <ListGroup as="ul" bsPrefix='navbar-nav' className="navbar-right-wrap ms-auto d-flex nav-top-wrap">
            <Dropdown as="li" className="ms-2">
                <Dropdown.Toggle
                    as="a"
                    bsPrefix=' '
                    className="rounded-circle"
                    id="dropdownUser">
                    <div className="avatar avatar-md avatar-indicators avatar-online">
                        <Image alt="avatar" src={session?.user?.image} className="rounded-circle" />
                    </div>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-end "
                    align="end"
                    aria-labelledby="dropdownUser"
                    >
                    <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=' '>
                            <div className="lh-1 ">
                                <h5 className="mb-1"> {session?.user?.name}</h5>
                                <Link href="#" className="text-inherit fs-6">View my profile</Link>
                            </div>
                            <div className=" dropdown-divider mt-3 mb-2"></div>
                    </Dropdown.Item>
                    <Dropdown.Item >
                        <i className="fe fe-settings me-2"></i> Account Settings
                    </Dropdown.Item>
                    <form action={logOutAction}>
                        <Button size="sm" type='submit'>
                            <i className="fe fe-power me-2"></i>Sign Out
                        </Button>
                    </form>
                </Dropdown.Menu>
            </Dropdown>
        </ListGroup>
    )}

    return (
        <Fragment>
            { hasMounted && isDesktop ? <QuickMenuDesktop /> : <QuickMenuMobile />}
        </Fragment>
    )
}

export default QuickMenu;