import * as fs from 'fs';
import * as path from 'path';

/**
 * Supported image file extensions
 */
const SUPPORTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];

/**
 * Check if a file is an image based on its extension
 */
function isImageFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return SUPPORTED_IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Collect image files from a directory
 * @param directoryPath Path to the directory to search
 * @param recursive Whether to search subdirectories recursively
 * @returns Array of image file paths
 */
function collectImagesFromDirectory(directoryPath: string, recursive: boolean = true): string[] {
    const imagePaths: string[] = [];

    try {
        console.log(`[DEBUG collectImagesFromDirectory] Attempting to read directory: ${directoryPath}`);

        // Check if directory exists and is accessible
        if (!fs.existsSync(directoryPath)) {
            console.warn(`[ERROR collectImagesFromDirectory] Directory does not exist: ${directoryPath}`);
            return imagePaths;
        }

        const stat = fs.statSync(directoryPath);
        if (!stat.isDirectory()) {
            console.warn(`[ERROR collectImagesFromDirectory] Path is not a directory: ${directoryPath}`);
            return imagePaths;
        }

        // Check read permissions
        try {
            fs.accessSync(directoryPath, fs.constants.R_OK);
            console.log(`[DEBUG collectImagesFromDirectory] Directory is readable: ${directoryPath}`);
        } catch (accessError) {
            console.warn(`[ERROR collectImagesFromDirectory] Directory is not readable: ${directoryPath}`, accessError);
            return imagePaths;
        }

        const items = fs.readdirSync(directoryPath);
        console.log(
            `[DEBUG collectImagesFromDirectory] Reading directory: ${directoryPath}, found ${items.length} items`
        );

        for (const item of items) {
            const itemPath = path.join(directoryPath, item);

            try {
                const itemStat = fs.statSync(itemPath);

                if (itemStat.isFile() && isImageFile(itemPath)) {
                    const absolutePath = path.resolve(itemPath);
                    imagePaths.push(`file:///${absolutePath.replace(/\\/g, '/')}`);
                    // console.log(`[DEBUG collectImagesFromDirectory] Found image file: ${absolutePath}`);
                } else if (itemStat.isDirectory() && recursive) {
                    console.log(`[DEBUG collectImagesFromDirectory] Entering subdirectory: ${itemPath}`);
                    const subDirImages = collectImagesFromDirectory(itemPath, recursive);
                    imagePaths.push(...subDirImages);
                }
            } catch (itemError) {
                console.warn(`[ERROR collectImagesFromDirectory] Failed to access item: ${itemPath}`, itemError);
                continue;
            }
        }

        console.log(`[DEBUG collectImagesFromDirectory] Total images found in ${directoryPath}: ${imagePaths.length}`);
    } catch (error) {
        console.warn(`[ERROR collectImagesFromDirectory] Failed to read directory: ${directoryPath}`, error);
    }

    return imagePaths;
}

/**
 * Collect images from multiple folder paths
 * @param folderPaths Array of folder paths to search
 * @param recursive Whether to search subdirectories recursively
 * @returns Array of image file paths
 */
export function collectImagesFromFolders(folderPaths: string[], recursive: boolean = true): string[] {
    const allImages: string[] = [];

    for (const folderPath of folderPaths) {
        if (!folderPath || folderPath.trim() === '') {
            continue;
        }

        let resolvedPath: string;
        try {
            // Handle both file:// URIs and regular paths
            if (folderPath.startsWith('file://')) {
                // Extract the actual path from file:// URI
                const decodedPath = decodeURIComponent(folderPath.replace('file:///', ''));
                // console.log(`[DEBUG collectImagesFromFolders] Decoded URI path: ${decodedPath}`);
                resolvedPath = path.resolve(decodedPath);
            } else {
                resolvedPath = path.resolve(folderPath);
            }

            // console.log(`[DEBUG collectImagesFromFolders] Resolved path: ${resolvedPath}`);
        } catch (error) {
            console.warn(`[ERROR collectImagesFromFolders] Invalid path: ${folderPath}`, error);
            continue;
        }

        if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
            const images = collectImagesFromDirectory(resolvedPath, recursive);
            allImages.push(...images);
            console.log(`[DEBUG collectImagesFromFolders] Found ${images.length} images in directory`);
        } else {
            console.warn(
                `[ERROR collectImagesFromFolders] Directory does not exist or is not a directory: ${resolvedPath}`
            );
        }
    }

    // Remove duplicates while preserving order
    const uniqueImages = Array.from(new Set(allImages));

    return uniqueImages;
}
