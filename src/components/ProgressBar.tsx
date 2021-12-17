import { Line } from 'rc-progress';
import { useEffect, useState } from 'react';
import { IProjectInfo } from './shared/types';

export default function ProgressBar({ projectInfo }: { projectInfo: IProjectInfo }) {

    const [progress, setPercent] = useState<number>(projectInfo.progress);
    const [balance, setBalance] = useState<number>(projectInfo.ethGoal);
    // const [deadline, setDeadline] = useState<number>(projectInfo.deadline);

    useEffect(() => {
        setPercent(projectInfo.progress);
        setBalance(projectInfo.balance);
    }, [projectInfo]);

    return (
        <>
            <Line percent={progress} strokeWidth={1} strokeColor={"#ec5990"}></Line>
            <div>{`${balance} of ${projectInfo.ethGoal} ETH funded`}</div>
        </>
    )
};