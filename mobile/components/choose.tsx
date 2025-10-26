import { FlatList, Modal, View } from 'react-native';
import Button from './ui/button';
import Text from './ui/text';
import Image from './image';
import * as MediaLibrary from 'expo-media-library';

type Props = {
    open: boolean;
    setOpen: (val: boolean) => void;
};

export default function Choose({ open, setOpen }: Props) {
    const handleChoose = () => {
        console.log('Choose');
    };

    const handlePicker = async () => {
        let permission = await MediaLibrary.getPermissionsAsync();

        // Si la permission n'est pas déjà accordée, la demander
        if (!permission.granted) {
            permission = await MediaLibrary.requestPermissionsAsync();
        }

        // Si toujours refusé, on peut afficher un message ou juste quitter
        if (!permission.granted) {
            console.log(
                "Permission refusée. Veuillez autoriser l'accès aux photos."
            );
            return;
        }

        let allPhotos: MediaLibrary.Asset[] = [];
        let after: string | undefined = undefined;
        let hasNextPageBool: boolean = false;

        do {
            console.log('Recupération des photos');
            const { assets, endCursor, hasNextPage } =
                await MediaLibrary.getAssetsAsync({
                    mediaType: 'photo',
                    first: 100, // récupère 100 photos à la fois
                    after,
                    sortBy: [MediaLibrary.SortBy.creationTime],
                });
            hasNextPageBool = hasNextPage;
            allPhotos = allPhotos.concat(assets);
            after = endCursor;
        } while (after && hasNextPageBool);

        console.log(`Total photos récupérées: ${allPhotos.length}`);
    };

    return (
        <>
            <Button onPress={() => setOpen(true)} className="">
                <Text className="text-primary font-bold text-xl">
                    Choisir vos photos !
                </Text>
            </Button>
            <Modal
                transparent
                animationType="fade"
                visible={open}
                onRequestClose={() => setOpen(false)}
            >
                <View className="flex-1 bg-black/40 justify-center items-center">
                    <View className="w-5/6 bg-primary rounded-2xl p-6 shadow-lg gap-3">
                        <View className="gap-2">
                            <Text className="font-semibold">
                                - Cliquer sur la photo pour la bloquer
                            </Text>
                            <Text className="font-semibold">
                                - Cliquer longtemps sur la photo pour zoomer
                            </Text>
                        </View>
                        <View className="text-xl font-bold">
                            <FlatList
                                data={Array.from({ length: 9 }).map(
                                    (_, i) => i
                                )}
                                renderItem={({ item }) => <Image />}
                                keyExtractor={(item) => item.toString()}
                                numColumns={3}
                            />
                        </View>
                        <View className="">
                            <Button
                                onPress={() => handlePicker()}
                                className="bg-accent"
                            >
                                <Text className="text-primary font-semibold">
                                    Relancer
                                </Text>
                            </Button>
                        </View>
                        <View className="flex-row gap-2">
                            <Button
                                onPress={() => handleChoose()}
                                className="flex-1"
                            >
                                <Text className="text-primary font-semibold">
                                    Choisir !
                                </Text>
                            </Button>
                            <Button
                                onPress={() => setOpen(false)}
                                className="flex-1 bg-red-500"
                            >
                                <Text className="text-primary font-semibold">
                                    Fermer
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}
