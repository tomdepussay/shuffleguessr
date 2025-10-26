import { cn } from '@/libs/utils';
import { TextProps, Text as TextReact } from 'react-native';

type Props = TextProps & {
    className?: string;
};

export default function Text({ children, className }: Props) {
    return (
        <TextReact className={cn('text-second', className)}>
            {children}
        </TextReact>
    );
}
