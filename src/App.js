import React from 'react';
import Table from 'react-bootstrap/Table';

function App() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Postleitzahl</th>
          <th>Gemeindeteil</th>
          <th>Straße</th>
          <th>Hausnummer</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>18147</td>
          <td>Gehlsdorf</td>
          <td>Blockweg</td>
          <td>3</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default App;
