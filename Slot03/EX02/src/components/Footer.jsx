//Footer.jsx  to describe the footer component about the author
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";

function Footer() {
  return (
    <footer className="bg-light text-center py-4 mt-auto">
      <Container fluid>
        <Row className="align-items-center">
          <Col xs={2}>
            <Image
              src="/images/cat.png"
              alt="Author Avatar"
              className="rounded-circle"
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          </Col>
          <Col xs={8}>
            <h5>Tác giả: &copy; huymd</h5>
            <small>All rights reserved.</small>
          </Col>
          <Col xs={2}>
            <a href="mailto:huymdde180293@fpt.edu.vn">
              huymdde180293@fpt.edu.vn
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
