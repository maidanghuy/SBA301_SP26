import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Orchid from "../components/Orchid";
import orchids from "../data/orchids";

function Home() {
  return (
    <>
      <h2 className="mb-4">Orchid Collection</h2>

      <Row xs={1} md={3} className="g-4">
        <Orchid orchid={orchids[0]} />
      </Row>
    </>
  );
}

export default Home;
