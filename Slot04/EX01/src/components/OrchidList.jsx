import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Orchid from "./Orchid";
import orchids from "../data/orchids";

function OrchidList() {
  return (
    <Row xs={1} md={3} className="g-4">
      {orchids.map((orchid) => (
        <Col key={orchid.id}>
          <Orchid orchid={orchid} />
        </Col>
      ))}
    </Row>
  );
}

export default OrchidList;
