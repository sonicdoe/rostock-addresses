import React from 'react';
import Table from 'react-bootstrap/Table';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

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

const data = [
  {
    postleitzahl: '18147',
    // eslint-disable-next-line camelcase
    gemeindeteil_name: 'Gehlsdorf',
    // eslint-disable-next-line camelcase
    strasse_name: 'Blockweg',
    hausnummer: '3',
  },
];

function App() {
  const table = useReactTable({
    data,
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
