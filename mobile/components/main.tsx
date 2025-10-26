import { View } from 'react-native';
import Title from './title';
import Input from './ui/input';
import { useEffect, useState } from 'react';
import Text from './ui/text';
import { PageType } from '@/types/page';
import * as MediaLibrary from 'expo-media-library';
import Button from './ui/button';
import usePseudo from '@/stores/pseudo';
import useCode from '@/stores/code';
import useSocket from '@/stores/socket';

type Props = {
    setPage: (val: PageType) => void;
};

export default function Main({ setPage }: Props) {
    const { pseudo, setPseudo } = usePseudo();
    const { code, setCode } = useCode();
    const {
        socket,
        isConnected,
        createGame: create,
        joinGame: join,
    } = useSocket();

    const [tempPseudo, setTempPseudo] = useState(pseudo);
    const [tempCode, setTempCode] = useState(code);
    const [joinMenu, setJoinMenu] = useState(false);
    const [permission, setPermission] =
        useState<MediaLibrary.PermissionResponse>();
    const [errors, setErrors] = useState({
        pseudo: '',
        code: '',
        permission: '',
    });

    const handleJoin = () => {
        setErrors({ pseudo: '', code: '', permission: '' });
        setJoinMenu((prev) => !prev);
    };

    const verif = () => {
        setErrors({ pseudo: '', code: '', permission: '' });
        let pseudoVerif = '';
        let codeVerif = '';
        let permissionVerif = '';

        if (tempPseudo.length === 0 || tempPseudo.length > 20) {
            pseudoVerif = 'Vous devez choisir un pseudonyme';
        }

        if (joinMenu && (tempCode.length === 0 || tempCode.length > 6)) {
            codeVerif = 'Vous devez rentrer un code';
        }

        if (permission && permission.accessPrivileges !== 'all') {
            permissionVerif =
                "Vous devez autoriser l'accès total à vos photos pour pouvoir jouer";
        }

        if (pseudoVerif !== '' || codeVerif !== '' || permissionVerif !== '') {
            setErrors({
                pseudo: pseudoVerif,
                code: codeVerif,
                permission: permissionVerif,
            });
            return false;
        }

        return true;
    };

    const createGame = () => {
        if (verif() && socket) {
            setPseudo(tempPseudo);
            create(tempPseudo);
        }
    };

    const joinGame = () => {
        if (verif() && socket) {
            setPseudo(tempPseudo);
            setCode(tempCode);
            join(tempCode, tempPseudo);
        }
    };

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === 'created') {
                        setCode(data.code);
                        setPage('room');
                    }

                    if (data.type === 'joined') {
                        setPage('room');
                    }

                    if (data.type === 'not_exit') {
                        setErrors({
                            pseudo: '',
                            code: "Cette partie n'existe pas",
                            permission: '',
                        });
                    }
                } catch (err) {
                    console.log(err);
                }
            };
        }
    }, [socket]);

    useEffect(() => {
        askPermission();
    }, []);

    const askPermission = async () => {
        let permission = await MediaLibrary.getPermissionsAsync();
        setPermission(permission);
    };

    return (
        <View className="mx-auto max-w-sm flex-1 justify-start gap-4">
            <Title />
            <View className="flex-1 justify-start items-center gap-6 mt-24">
                <View className="w-full">
                    <Text className="text-red-800 font-semibold ml-1">
                        {isConnected
                            ? errors.permission
                            : 'Un problème de connexion avec le serveur est survenu'}
                    </Text>
                </View>
                <View className="w-full gap-1">
                    <Input
                        error={errors.pseudo}
                        value={tempPseudo}
                        onChangeText={setTempPseudo}
                        placeholder="Pseudonyme"
                    />
                    <Text className="text-red-800 font-semibold ml-1">
                        {errors.pseudo}
                    </Text>
                </View>
                {joinMenu ? (
                    <>
                        <View className="w-full gap-1">
                            <Input
                                error={errors.code}
                                keyboardType="numeric"
                                value={tempCode}
                                onChangeText={setTempCode}
                                placeholder="Code"
                                maxLength={6}
                            />
                            <Text className="text-red-800 font-semibold ml-1">
                                {errors.code}
                            </Text>
                        </View>
                        <Button
                            key={'join-2'}
                            onPress={joinGame}
                            className="bg-accent w-full"
                        >
                            <Text className="text-primary text-xl font-semibold">
                                Rejoindre une partie
                            </Text>
                        </Button>
                        <Button
                            key={'back'}
                            onPress={handleJoin}
                            className="w-full"
                        >
                            <Text className="text-primary text-center text-xl font-semibold w-full">
                                Retour
                            </Text>
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            key={'join'}
                            onPress={handleJoin}
                            className="bg-accent w-full"
                        >
                            <Text className="text-primary text-xl font-semibold">
                                Rejoindre une partie
                            </Text>
                        </Button>
                        <Button
                            key={'create'}
                            onPress={createGame}
                            className="w-full"
                        >
                            <Text className="text-primary text-xl font-semibold">
                                Créer une partie
                            </Text>
                        </Button>
                    </>
                )}
            </View>
        </View>
    );
}
