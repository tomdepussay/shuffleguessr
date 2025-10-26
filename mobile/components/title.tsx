import { View } from 'react-native';
import Text from './ui/text';

export default function Title() {
    return (
        <View className="pt-12">
            <Text className="text-5xl text-center font-extrabold">
                Shuffle
                <Text className="text-accent">Guessr</Text>
            </Text>
        </View>
    );
}
