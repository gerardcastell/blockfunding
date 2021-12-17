import { Line } from 'rc-progress';
import { useEffect, useState } from 'react';
import { weiToEth } from '../utils/exchanges';
import { IProjectInfo } from './shared/types';

export default function ProgressBar({
  projectInfo,
}: {
  projectInfo: IProjectInfo;
}) {
  const [progress, setPercent] = useState<number>(projectInfo.progress);
  // const [deadline, setDeadline] = useState<number>(projectInfo.deadline);

  useEffect(() => {
    setPercent((projectInfo.balance / projectInfo.ethGoal) * 100);
  }, [projectInfo]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>{`${
        projectInfo.balance >= projectInfo.ethGoal
          ? '100'
          : progress
      }
                % already raised!`}</h2>
      <Line percent={progress} strokeWidth={1} strokeColor={'#ec5990'}></Line>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>{`${weiToEth(
        projectInfo.balance
      )} of ${weiToEth(projectInfo.ethGoal)} ETH achieved`}</div>
    </div>
  );
}
