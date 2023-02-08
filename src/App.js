import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AddressTable from './AddressTable';

function App() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Adressenliste</h1>
          <p>Diese Tabelle listet alle Adressen der Hanse- und Universitätsstadt Rostock von <a href='https://www.opendata-hro.de/dataset/adressenliste'>OpenData.HRO</a>.</p>

          <AddressTable/>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
