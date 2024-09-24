'use client'
// import node module libraries
import { Fragment, useContext } from 'react';
import Link from 'next/link';
import { usePathname   } from 'next/navigation'
import { useMediaQuery } from 'react-responsive';
import {
	ListGroup,
	Card,
	Image,
	Badge,
} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import betlify from "public/images/brand/betlifylogobg.jpg";

// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

// import routes file
import { DashboardMenu } from 'routes/DashboardRoutes';

const NavbarVertical = (props) => {
	const location = usePathname ()

	const isMobile = useMediaQuery({ maxWidth: 767 });

	return (
		<Fragment>
			<SimpleBar style={{ maxHeight: '100vh' }}>
				<div className="nav-scroller">
					<Link href="/dashboard" className="navbar-brand">
						<Image src={betlify} width={152} height={52} style={{width:'100%', height:'auto'}} alt="betlify logo" />
					</Link>
				</div>				
				{/* Dashboard Menu */}
				<Accordion defaultActiveKey="0" as="ul" className="navbar-nav flex-column">
					{DashboardMenu.map(function (menu, index) {
								return (
									<Card bsPrefix="nav-item" key={index}>
										<Link href={menu.link} className={`nav-link ${location === menu.link ? 'active' : ''} ${menu.title === 'Download' ? 'bg-primary text-white' : ''}`}>
											{typeof menu.icon === 'string' ? (
												<i className={`nav-icon fe fe-${menu.icon} me-2`}></i>
											) : (menu.icon)}
											{menu.title}
										</Link>
									</Card>
								);
							}
					)}
				</Accordion>				
			</SimpleBar>
		</Fragment>
	);
};

export default NavbarVertical;
