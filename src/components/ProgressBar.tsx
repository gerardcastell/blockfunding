import { Line } from 'rc-progress';
import { useEffect, useState } from 'react';
import { IProjectInfo } from './types/project';

export default function ProgressBar({ projectInfo }: { projectInfo: IProjectInfo }) {

    const [percent, setPercent] = useState<number>(projectInfo.progress);
    const [balance, setBalance] = useState<number>(projectInfo.ethGoal);

    useEffect(() => {
        setPercent(projectInfo.progress);
        setBalance(projectInfo.balance);
    }, [projectInfo])

    return (
        <>
            <Line percent={percent * 100} strokeWidth={1} strokeColor={"#ec5990"}></Line>
            <div>{`${balance} of ${projectInfo.ethGoal} ETH funded`}</div>
        </>
    )
};