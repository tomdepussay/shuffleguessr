import { PageType } from '@/types/page';
import type { Player as PlayerType } from '@/types/player';
import Player from '@/components/player';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Button from './ui/button';
import AntDesign from '@expo/vector-icons/AntDesign';
import Text from './ui/text';
import Choose from './choose';
import usePseudo from '@/stores/pseudo';
import useCode from '@/stores/code';
import useSocket from '@/stores/socket';

type Props = {
    setPage: (val: PageType) => void;
};

export default function Room({ setPage }: Props) {
    const pseudo = usePseudo((state) => state.pseudo);
    const { code, setCode } = useCode();
    const socket = useSocket((state) => state.socket);

    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [open, setOpen] = useState(true);

    const canPlay = () => {
        return players.every((player) => player.status === 'choosed');
    };

    const back = () => {
        setPage('main');
        setCode('');
    };

    useEffect(() => {
        if (socket) {
            if (players.length === 0) {
                socket.send(JSON.stringify({ type: 'players', code: code }));
            }

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'players') {
                        setPlayers(data.players);
                    }

                    if (data.type === 'playerJoined') {
                        setPlayers((prev) => [...prev, data.player]);
                    }
                } catch (err) {
                    console.log(err);
                }
            };
        }
    }, [socket]);

    return (
        <View className="min-w-96 mx-auto mt-4 flex-1">
            <View className="flex-row justify-between">
                <View className="justify-start">
                    <Button className="bg-primary" onPress={back}>
                        <View className="flex-row justify-center items-center gap-2">
                            <AntDesign
                                name="left"
                                size={14}
                                className="text-lg text-second"
                            />
                            <Text className="text-xl font-semibold">
                                Retour
                            </Text>
                        </View>
                    </Button>
                </View>
                <View>
                    <Text className="text-4xl font-semibold">{code}</Text>
                </View>
            </View>
            <View className="flex-1 my-8">
                {players.length > 0 && (
                    <FlatList
                        data={players}
                        renderItem={({ item }) => <Player player={item} />}
                        keyExtractor={(item) => item.id}
                        numColumns={1}
                    />
                )}

                <View className="gap-2">
                    {canPlay() && (
                        <Button
                            onPress={() => console.log('test')}
                            className="bg-accent"
                        >
                            <Text className="text-primary font-bold text-lg">
                                Lancer la partie
                            </Text>
                        </Button>
                    )}
                    <Choose open={open} setOpen={setOpen} />
                </View>
            </View>
        </View>
    );
}
