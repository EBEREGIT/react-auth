import { Container, Col, Row } from "react-bootstrap";
import Account from "./Account";

function App() {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>React Authentication Tutorial</h1>
        </Col>
      </Row>

      {/* account */}
      <Account />
    </Container>
  );
}

export default App;
