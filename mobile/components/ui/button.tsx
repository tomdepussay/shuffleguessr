import { cn } from '@/libs/utils';
import { TouchableOpacity } from 'react-native';

type ButtonProps = {
    className?: string;
    onPress: () => void;
    children: React.ReactNode;
};

export default function Button({ className, onPress, children }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={cn(
                'bg-second flex items-center py-3 rounded-lg shadow-md',
                className
            )}
        >
            {children}
        </TouchableOpacity>
    );
}
