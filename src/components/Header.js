import { Container, Navbar } from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar bg="primary" variant="dark">
            <Container style={{ color: '#fff' }}>
                <Navbar.Brand href="#home">Image Editor</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    dobstudio
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
