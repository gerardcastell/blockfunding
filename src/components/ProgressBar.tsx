import { Line } from 'rc-progress';
import { useEffect, useState } from 'react';

export default function ProgressBar({ balance, goal }: { balance: number, goal: number }) {

    const containerStyle = {
        width: '55rem',
    }; //TODO: Move to css

    const [percent, setPercent] = useState<number>(balance);
    const [color, setColor] = useState<string>('#FE8C6A');
    const colorMap = ['#FE8C6A', '#3FC7FA', '#85D262'];

    useEffect(() => {
        setPercent((balance / goal));
        setColor(colorMap[parseInt((percent*100).toString())]);
    }, [balance])

    return (
        <>
            <Line style={containerStyle} percent={percent * 100} strokeWidth={1} strokeColor={color}></Line>
            <div>{`${balance} of ${goal} ETH funded`}</div>
        </>
    )
};