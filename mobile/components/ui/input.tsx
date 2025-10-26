import { cn } from '@/libs/utils';
import { TextInputProps, TextInput, View } from 'react-native';

type Props = TextInputProps & {
    className?: string;
    error?: string;
};

export default function Input({ className, error = '', ...rest }: Props) {
    return (
        <View className="w-full ">
            <TextInput
                maxLength={20}
                className={cn(
                    'w-full rounded-lg border border-second/80 px-4 py-3 text-base placeholder:text-second/80 focus:border-blue-500',
                    error !== '' && 'border-red-800 focus:border-red-500',
                    className
                )}
                {...rest}
            />
        </View>
    );
}
