import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUsers, FaTicketAlt, FaRegSun, FaSignOutAlt } from 'react-icons/fa';
import { Tooltip } from "@chakra-ui/react"
import { useUserStatus } from '../store/selectors';
import { getAvatar } from '../helper/AvatarImage';
import { PlayerCount } from '../helper/AMQEvents';

const StatusUI = styled.aside`
    width: 250px;
    margin: 8px;
    border: 1px solid #7226987d;
    border-radius: 8px;
    background: #29152f;
    color: #fff;
`;

const CharaImg = styled.img`
    width: 150px;
    margin: 0 auto;
`;

const EXPProgressBar = styled.div`
    width: 100%;
    height: 30px;
    background: grey;
    color: #fff;
    line-height: 30px;
    position: relative;
`;

const EXPLevel = styled.div`
    width: 100%;
    height: 30px;
    position: relative;
    z-index: 4;

`;

const EXPProgress = styled.div<{p: string}>`
    background: green;
    height: 30px;
    position: absolute;
    top: 0;
    transition: width 0.4s ease-in-out;
    width: ${props => props.p}%;
    z-index: 3;
`;

type Connection = 'connected' | 'disconnected' | 'reconnecting';
const ConnectionStatus = () => {
    const [connection, setConnection] = useState<Connection>('connected');
    useEffect(() => {
        const discon = (e: any, d: any) => setConnection('disconnected');
        const con = (e: any, d: any) => setConnection('connected');

        window.electron.once('disconnect', discon);
        window.electron.once('reconnect', con);
    });

    return connection === 'connected' ? (
        <span>
            <span className="text-green-400">●</span> Connected
        </span>
    ) : connection === 'disconnected' ? (
        <span>
            <span className="text-red-400">×</span> Disconnected
        </span>
    ) : (
        <span>
            <span className="text-yellow-400">●</span> Reconnecting
        </span>
    );
}

const OnlineCounter = () => {
    const [online, setOnline] = useState(0);

    useEffect(() => {
        const update = (e: any, d: {count: number}) => setOnline(d.count);
        window.electron.once(PlayerCount, update);
    });

    return (
        <span className="ml-auto inline-flex"><FaUsers /> {online}</span>
    );
}

const AMQStatus = () => {
    const { state, loading, error } = useUserStatus();

    if (loading) return <StatusUI className="w-full h-full m-auto">loading</StatusUI>;

    const img = getAvatar(state.avatar);

    return (
        <StatusUI className="text-center flex flex-col justify-between">
            <div className="flex justify-between">
                <span className="leading-4 p-2 m-2 border border-gray-600 hover:border-gray-400 rounded-sm cursor-pointer">
                    <FaSignOutAlt />
                </span>
                <span className="leading-4 p-2 m-2 border border-gray-600 hover:border-gray-400 rounded-sm cursor-pointer">
                    <FaRegSun />
                </span>
            </div>
            <div>
                <div className="w-full">
                    <CharaImg className="py-2" src={img} />
                </div>
                <div className="text-2xl py-2">{ state.self }</div>
                <EXPProgressBar>
                    <Tooltip label={`${state.xpInfo.xpIntoLevel|0} / ${state.xpInfo.xpForLevel}`} aria-label="A tooltip">
                        <EXPLevel>{state.level}</EXPLevel>
                    </Tooltip>
                    <EXPProgress p={`${state.xpInfo.xpPercent * 100}`} />
                </EXPProgressBar>
                <div className="my-4">
                    <span className="px-2 py-1 m-2 rounded bg-blue-900"><FaTicketAlt /> {state.tickets} </span>
                    <span className="px-2 py-1 m-2 rounded bg-blue-900">♬ {state.credits}</span>
                </div>
            </div>
            <div className="text-sm leading-4 flex p-2 bottom-0 select-none">
                <ConnectionStatus />
                <OnlineCounter />
            </div>
        </StatusUI>
    )
}

export default AMQStatus;
