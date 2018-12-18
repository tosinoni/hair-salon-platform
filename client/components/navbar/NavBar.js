import React, {Fragment} from 'react'
import { Link } from 'react-router-dom'
import ReactNavbar from 'react-bootstrap/lib/Navbar';
import ReactMenuItem from 'react-bootstrap/lib/MenuItem';
import ReactNav from 'react-bootstrap/lib/Nav';
import ReactNavItem from 'react-bootstrap/lib/NavItem';
import logoImage from '../../assets/logoSmall.png';
import './NavBar.css';

const NavBar = (props) => {
	return (
		<ReactNavbar collapseOnSelect fluid>
			<ReactNavbar.Header>
				<ReactNavbar.Brand>
					<Link to="/">
						<img src={logoImage} />
						<p>Olalere Law Office</p>
					</Link>
				</ReactNavbar.Brand>
				<ReactNavbar.Toggle />
			</ReactNavbar.Header>

			<ReactNavbar.Collapse>
				<ReactNav pullRight navbar>
					{props.currentUser
						? (
							<Fragment>
								<ReactNavItem eventKey={1}>
									<Link to="/vip">VIP</Link>
      							</ReactNavItem>
								<ReactNavItem eventKey={2}>
									<Link to="/register">Create User</Link>
      							</ReactNavItem>
								<ReactNavItem eventKey={3}>
								<Link to="/logout">Log Out</Link>
      							</ReactNavItem>
							</Fragment>
						)
						: (
							<ReactNavItem eventKey={3}>
								<Link to="/login">Log In</Link>
      						</ReactNavItem>
						)
					}

				</ReactNav>
			</ReactNavbar.Collapse>
		</ReactNavbar>
	)
}

export default NavBar