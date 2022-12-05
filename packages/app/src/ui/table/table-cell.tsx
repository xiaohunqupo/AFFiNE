import { PropsWithChildren, useLayoutEffect } from 'react';
import { TableCellProps } from './interface';
import { StyledTableCell } from './styles';

export const TableCell = ({
  children,
  ...props
}: PropsWithChildren<TableCellProps>) => {
  return <StyledTableCell {...props}>{children}</StyledTableCell>;
};

export default TableCell;