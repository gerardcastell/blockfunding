import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { weiToEth } from '../utils/exchanges';

export default function BasicTable({
  rows,
}: {
  rows: { [key: string]: any }[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell align='right'>Id</TableCell>
            <TableCell align='right'>Title</TableCell>
            <TableCell align='right'>Goal (Ethers)</TableCell>
            <TableCell align='right'>Progress</TableCell>
            <TableCell align='right'>Deadline</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.owner}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align='right'>{row.owner}</TableCell>
              <TableCell align='right'>{row.title}</TableCell>
              <TableCell align='right'>{weiToEth(row.ethGoal)}</TableCell>
              <TableCell align='right'>
                {row.balance >= row.ethGoal
                  ? '100'
                  : (row.balance * 100) / row.ethGoal}
                %
              </TableCell>
              <TableCell align='right'>{row.deadline}</TableCell>
              <TableCell align='right'>
                <Button component={Link} to={`/${row.owner}/donate`}>
                  Contribute
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
