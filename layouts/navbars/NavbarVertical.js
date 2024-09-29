'use client'
// import node module libraries
import { Fragment, useContext } from 'react';
import Link from 'next/link';
import { usePathname   } from 'next/navigation'
import { useMediaQuery } from 'react-responsive';
import {
	ListGroup,
	Card,
	// Image,
	Badge,
} from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'next/image';
import betlify from "../../public/images/brand/logotrans.png";

// import simple bar scrolling used for notification item scrolling
import SimpleBar from 'simplebar-react';
// import 'simplebar/dist/simplebar.min.css';

// import routes file
import { DashboardMenu } from 'routes/DashboardRoutes';

const NavbarVertical = (props) => {
	const location = usePathname ()

	const isMobile = useMediaQuery({ maxWidth: 767 });

	return (
		<section style={{ backgroundColor:'black' }}>
			<section style={{ maxHeight: '100vh'}}>
				<div className="nav-scroller">
					<Link href="/dashboard" className="navbar-brand navbar-nav nav-link active">
						<Image src={betlify} width={150} height={50} style={{}} alt="betlify logo" />
					</Link>
				</div>				
				{/* Dashboard Menu */}
				<Accordion className="navbar-nav flex-column">
					{DashboardMenu.map(function (menu, index) {
								return (
									<Card bsPrefix="nav-item" key={index}>
										<Link href={menu.link} className={`nav-link ${location === menu.link ? 'active' : ''}`}>
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
			</section>
		</section>
	);
};

export default NavbarVertical;
