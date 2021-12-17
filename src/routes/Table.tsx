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
            <TableCell align="center">Owner</TableCell>
            <TableCell align="center">Title</TableCell>
            <TableCell align="center">Goal (Ethers)</TableCell>
            <TableCell align="center">Progress</TableCell>
            <TableCell align="center">Closes on</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.owner}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align='center'>{row.owner}</TableCell>
              <TableCell align='center'>{row.title}</TableCell>
              <TableCell align='center'>{weiToEth(row.ethGoal)}</TableCell>
              <TableCell align='center'>
                {row.balance >= row.ethGoal
                  ? '100'
                  : (row.balance * 100) / row.ethGoal}
                %
              </TableCell>
              <TableCell align="center">{new Date(row.deadline * 1000).toString()}</TableCell>
              <TableCell align="center">
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
