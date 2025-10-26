import { Player as PlayerType } from '@/types/player';
import { View } from 'react-native';
import Text from './ui/text';

type Props = {
    player: PlayerType;
};

export default function Player({ player }: Props) {
    return (
        <View
            key={player.id}
            className="flex-1 m-2 p-3 rounded-xl bg-primary border border-second/80"
        >
            <Text className="text-xl text-second font-semibold">
                {player.pseudo}
            </Text>
            <Text>
                {player.status === 'choose'
                    ? 'choisit ses photos...'
                    : player.status === 'choosed' && 'a choisit ses photos'}
            </Text>
        </View>
    );
}
