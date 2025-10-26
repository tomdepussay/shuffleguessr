import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid, Platform } from "react-native";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

async function requestPermission() {
    if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            throw new Error("Permission refusée");
        }
    }
}

// /**
//  * Récupère N photos aléatoires de la photothèque
//  * @param {number} n - nombre de photos voulues
//  * @param {number} pageSize - taille de pagination (plus grand = plus rapide mais plus de mémoire)
//  * @returns {Promise<string[]>} - liste des URI des photos
//  */
// export async function getRandomPhotos(n = 1, pageSize = 100) {
//     await requestPermission();

//     // Étape 1 : récupérer totalCount
//     const firstPage = await CameraRoll.getPhotos({
//         first: 1,
//         assetType: "Photos",
//         include: ["fileSize", "filename", "imageSize", "playableDuration", "location", "totalCount"],
// t    });
//     const total = firstPage.page_info.totalCount;
//     if (total === 0) return [];

//     // Étape 2 : générer n indices uniques
//     const indices = new Set();
//     while (indices.size < Math.min(n, total)) {
//         indices.add(Math.floor(Math.random() * total));
//     }
//     const sortedIndices = [...indices].sort((a, b) => a - b);

//     // Étape 3 : parcourir les pages et collecter les photos
//     let results = [];
//     let cursor = null;
//     let currentIndex = 0; // index global de la photo
//     let collected = [];

//     while (sortedIndices.length > 0) {
//         const page = await CameraRoll.getPhotos({
//             first: pageSize,
//             assetType: "Photos",
//             after: cursor || undefined,
//         });

//         const edges = page.edges;
//         cursor = page.page_info.end_cursor;

//         // Vérifie si des indices tombent dans cette page
//         for (let i = 0; i < sortedIndices.length; i++) {
//             const targetIndex = sortedIndices[i];
//             if (
//                 targetIndex >= currentIndex &&
//                 targetIndex < currentIndex + edges.length
//             ) {
//                 const indexInPage = targetIndex - currentIndex;
//                 collected.push(edges[indexInPage]?.node.image.uri);
//             }
//         }

//         // Retire les indices déjà collectés
//         sortedIndices.splice(
//             0,
//             sortedIndices.filter(
//                 (idx) => idx < currentIndex + edges.length
//             ).length
//         );

//         // Avance l’index global
//         currentIndex += edges.length;

//         // Si plus d’indices → stop
//         if (!page.page_info.has_next_page || sortedIndices.length === 0) break;
//     }

//     return collected;
// }