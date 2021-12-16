import { useEffect, useState } from 'react';
import { IProjectInfo } from '../components/types/project';
import { smartContract } from '../smartContract';
import { secondsToMillis, weiToEth } from '../utils/exchanges';
import '../App.css';
import { changeState } from '../utils/fetchAccounts';
import BasicTable from './Table';

export default function ProjectsList() {

    useEffect(() => {
        setProjectInfo();
    }, [])

    const [state, setState] = useState<IProjectInfo>({
        projectId: "",
        balance: 0,
        ethGoal: 0,
        deadline: 0,
        progress: 0
    });

    const setProjectInfo = async () => {
        const projectId = "1";
        console.log(await smartContract.methods.projects("0x5e8DeE6d254a3e26B27BE8215111bEfA982A6d7F").call())
        // const balance = await smartContract.methods.balance().call();
        // const ethGoal = await smartContract.methods.ethGoal().call();
        // const deadline = await smartContract.methods.deadline().call();
        // const progress = balance / ethGoal * 100;
        // changeState(setState,"projectId", projectId);
        // changeState(setState,"ethGoal", weiToEth(ethGoal) as number);
        // changeState(setState,"balance", weiToEth(balance) as number);
        // changeState(setState,"deadline", deadline);
        // changeState(setState,"progress",  progress);
    };

    const rows = [{
        projectId: state.projectId,
        balance: state.balance,
        ethGoal: state.ethGoal,
        deadline: new Date(secondsToMillis(state.deadline)).getDate(),
        progress: state.progress
    }]

    return (
        <>
            <h2>Projects List</h2>
            <BasicTable rows={rows}></BasicTable>
        </>
    );
}