import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {DebounceInput} from 'react-debounce-input';

const ADDRESS_ENDPOINT = 'https://geo.sv.rostock.de/download/opendata/adressenliste/adressenliste.json';
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor('postleitzahl', {
    header: () => <span>Post&shy;leit&shy;zahl</span>,
    size: 80,
    meta: {
      inputMode: 'numeric',
    },
    // Instead of `.includes()`, use `.startsWith()` to filter.
    // This is arguably more natural for postal codes.
    filterFn(row, columnId, value) {
      const rowValue = row.getValue(columnId);
      return rowValue.startsWith(value);
    },
  }),
  columnHelper.accessor('gemeindeteil_name', {
    header: 'Gemeindeteil',
  }),
  columnHelper.accessor('strasse_name', {
    header: 'Straße',
  }),
  columnHelper.accessor('hausnummer', {
    header: () => <span>Haus&shy;nummer</span>,
    size: 80,
    enableColumnFilter: false,
  }),
  columnHelper.display({
    header: () => <abbr title='OpenStreetMap'>OSM</abbr>,
    size: 30,
    id: 'osm',
    cell(props) {
      const address = props.row.original;
      const query = `${address.strasse_name} ${address.hausnummer}, ${address.postleitzahl} ${address.gemeindeteil_name}, Deutschland`;
      const link = 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(query);

      return <a href={link} style={{textDecoration: 'none'}}>Öffnen&nbsp;↗</a>;
    },
  }),
];

function AddressTable() {
  const [addresses, setAddresses] = useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);

  useEffect(() => {
    // Cache responses via the Cache API.
    async function getResponse() {
      const cache = await caches.open('opendata');
      const match = await cache.match(ADDRESS_ENDPOINT);

      // If there’s a cache hit…
      if (match) {
        const lastModified = new Date(match.headers.get('Last-Modified'));
        const now = new Date();
        const age = now - lastModified;

        // …only use it it’s less than a week old.
        if (age < ONE_WEEK) {
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
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <Table responsive style={{tableLayout: 'fixed'}}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{width: header.getSize()}}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {header.column.getCanFilter() ? (
                    // Debounce filter input to reduce load.
                    <DebounceInput
                      element={Form.Control}
                      type='text'
                      inputMode={header.column.columnDef.meta?.inputMode ?? 'text'}
                      value={(header.column.getFilterValue() ?? '')}
                      placeholder={`Suchen… (${header.column.getFacetedUniqueValues().size})`}
                      onChange={e => header.column.setFilterValue(e.target.value)}
                    />
                  ) : (
                    // Align headers by adding an invisible filter text field.
                    <Form.Control disabled type='text' style={{visibility: 'hidden'}}/>
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
                <td key={cell.id} style={{width: cell.column.getSize(), hyphens: 'auto'}}>
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
    </>
  );
}

export default AddressTable;
