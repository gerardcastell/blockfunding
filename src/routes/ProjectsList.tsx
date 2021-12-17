import { useEffect, useState } from 'react';
import { smartContract } from '../smartContract';
import '../App.css';
import BasicTable from './Table';

export default function ProjectsList() {

    useEffect(() => {
        getProjects();
    }, [])

    const [state, setState] = useState<any[]>([]);

    async function getProjects() {
        const projects = await smartContract.methods.getProjects().call();
        setState(projects);
    }

    return (
        <>
            <h2>Projects List</h2>
            <BasicTable rows={state}></BasicTable>
        </>
    );
}