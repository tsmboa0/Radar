// Widget : Stat Style 
// Style : Stat widget with right top icon

// import node module libraries
import Image from 'next/image';
import {
	Col,
	Row,
	Button,
	Card,
	Spinner,
	ToggleButton,
	ToggleButtonGroup,
	Nav,
	Tab,
	Container
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import blog from 'public/images/blog/blog-img-1.jpg'
import Link from 'next/link';
// import { Card } from 'react-bootstrap';

const StatRightTopIcon = props => {
    const { info } = props;
    return (
        <Card style={{ width: '15rem' }}>
            <Image variant="top" src={blog} style={{ width: '15rem', height:'auto' }} />
            <Card.Body>
                <Card.Title style={{margin: '0', fontWeight:'bold', color:'black'}}>{info.title}</Card.Title>
                <Card.Text style={{fontSize:'12px'}}>
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                </Card.Text>
                <Link href={`/pool/${info.title}`}>
                    <Button variant="primary">Manage Pool</Button>
                </Link>
            </Card.Body>
        </Card>
    )
}

// Typechecking With PropTypes
StatRightTopIcon.propTypes = {
    info: PropTypes.any.isRequired
};

export default StatRightTopIcon