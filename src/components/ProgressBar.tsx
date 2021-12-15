import { Line } from 'rc-progress';
import { useEffect, useState } from 'react';

export default function ProgressBar({ balance, goal }: { balance: number, goal: number }) {

    const containerStyle = {
        width: '55rem',
    }; //TODO: Move to css

    const [percent, setPercent] = useState<number>(balance);

    useEffect(() => {
        setPercent((balance / goal));
        // setColor(colorMap[parseInt((percent*100).toString())]);
    }, [balance])

    return (
        <>
            <Line style={containerStyle} percent={percent * 100} strokeWidth={1} strokeColor={"#ec5990"}></Line>
            <div>{`${balance} of ${goal} ETH funded`}</div>
        </>
    )
};