import * as React from 'react';

import {
  chakra,
  Table as ChakraTable,
  Icon,
  TableContainer,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';

type Props<TData extends object> = TableProps & {
  data: TData[];
  columns: Array<ColumnDef<TData>>;
  defaultSort?: SortingState;
};

export const Table = <TData extends object>({
  data,
  columns,
  colorScheme = 'gray',
  defaultSort = [],
  size = 'sm',
  variant = 'simple',
}: Props<TData>) => {
  const [sorting, setSorting] = React.useState<SortingState>(defaultSort);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    sortDescFirst: false,
    state: {
      sorting,
    },
  });

  return (
    <TableContainer>
      <ChakraTable colorScheme={colorScheme} size={size} variant={variant}>
        <Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  isNumeric={header.column.columnDef.meta?.isNumeric}
                  cursor={header.column.getCanSort() ? 'pointer' : 'default'}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <chakra.span pl="2">
                    {header.column.getIsSorted() &&
                      (header.column.getIsSorted() === 'desc' ? (
                        <Icon as={RxCaretDown} aria-label="sorted descending" />
                      ) : (
                        <Icon as={RxCaretUp} aria-label="sorted ascending" />
                      ))}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map(row => (
            <Tr key={row.id}>
              {row.getVisibleCells().map(cell => {
                const isNumeric = cell.column.columnDef.meta?.isNumeric;
                const width = cell.column.columnDef.size
                  ? `${cell.column.columnDef.size}px`
                  : undefined;
                const maxWidth = cell.column.columnDef.maxSize
                  ? `${cell.column.columnDef.maxSize}px`
                  : undefined;

                return (
                  <Td key={cell.id} isNumeric={isNumeric} maxW={maxWidth} w={width}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                );
              })}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
};
