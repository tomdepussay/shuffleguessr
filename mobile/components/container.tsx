import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

type Props = {
    children: React.ReactNode;
    scrollable?: boolean;
};

export default function Container({ children, scrollable = true }: Props) {
    return (
        <SafeAreaView className="flex-1 bg-primary">
            {scrollable ? (
                <ScrollView keyboardShouldPersistTaps="handled">
                    {children}
                </ScrollView>
            ) : (
                <View className="flex-1">{children}</View>
            )}
        </SafeAreaView>
    );
}
