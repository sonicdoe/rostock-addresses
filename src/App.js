import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

const ADDRESS_ENDPOINT = 'https://geo.sv.rostock.de/download/opendata/adressenliste/adressenliste.json';
const ONE_DAY = 24 * 60 * 60 * 1000;

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('postleitzahl', {
    header: 'Postleitzahl',
    size: 50,
  }),
  columnHelper.accessor('gemeindeteil_name', {
    header: 'Gemeindeteil',
  }),
  columnHelper.accessor('strasse_name', {
    header: 'Straße',
  }),
  columnHelper.accessor('hausnummer', {
    header: 'Hausnummer',
    size: 50,
  }),
];

function App() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    async function getResponse() {
      const cache = await caches.open('opendata');
      const match = await cache.match(ADDRESS_ENDPOINT);

      // If there’s a cache hit…
      if (match) {
        const lastModified = new Date(match.headers.get('Last-Modified'));
        const now = new Date();
        const age = now - lastModified;

        // …only use it it’s less than a day old.
        if (age < ONE_DAY) {
          return match;
        }
      }

      await cache.add(ADDRESS_ENDPOINT);
      return cache.match(ADDRESS_ENDPOINT);
    }

    getResponse()
      .then(response => response.json())
      .then(result => setAddresses(result));
  }, []);

  const table = useReactTable({
    data: addresses,
    columns,
    pageSize: 10,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Container>
      <Row>
        <Col>
          <h1>Adressenliste</h1>
          <p>Diese Tabelle listet alle Adressen der Hanse- und Universitätsstadt Rostock von <a href='https://www.opendata-hro.de/dataset/adressenliste'>OpenData.HRO</a>.</p>

          <Table style={{tableLayout: 'fixed'}}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{width: header.getSize()}}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{width: cell.column.getSize()}}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>

          <nav className='d-flex align-items-center justify-content-end gap-3'>
            <p>Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}</p>
            <Pagination>
              <Pagination.Prev disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}/>
              <Pagination.Next disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}/>
            </Pagination>
          </nav>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
