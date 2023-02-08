import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const ADDRESS_ENDPOINT = 'https://geo.sv.rostock.de/download/opendata/adressenliste/adressenliste.json';

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('postleitzahl', {
    header: 'Postleitzahl',
  }),
  columnHelper.accessor('gemeindeteil_name', {
    header: 'Gemeindeteil',
  }),
  columnHelper.accessor('strasse_name', {
    header: 'Straße',
  }),
  columnHelper.accessor('hausnummer', {
    header: 'Hausnummer',
  }),
];

function App() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch(ADDRESS_ENDPOINT)
      .then(response => response.json())
      .then(result => setAddresses(result));
  }, []);

  const table = useReactTable({
    data: addresses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
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
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default App;
