import Container from '@/components/container';
import Main from '@/components/main';
import { useEffect, useState } from 'react';
import { PageType } from '@/types/page';
import Room from '@/components/room';
import useSocket from '@/stores/socket';

export default function Index() {
    const { connect, disconnect } = useSocket();
    const [page, setPage] = useState<PageType>('main');

    useEffect(() => {
        connect(`ws://192.168.1.17:8080`);

        return () => {
            disconnect();
        };
    }, []);

    return (
        <Container scrollable={!['room'].includes(page)}>
            {page === 'main' ? (
                <Main setPage={setPage} />
            ) : (
                page === 'room' && <Room setPage={setPage} />
            )}
        </Container>
    );
}
