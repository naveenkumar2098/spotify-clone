export const MAX_SONG_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_SONG_TYPES = ["audio/mpeg"];
export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

/** Returns an error message, or null when the file is acceptable. */
export const validateSongFile = (file: File): string | null => {
    if (!ALLOWED_SONG_TYPES.includes(file.type)) {
        return "Song must be an MP3 (audio/mpeg) file";
    }
    if (file.size > MAX_SONG_SIZE) {
        return "Song must be 20MB or smaller";
    }
    return null;
};

export const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return "Image must be PNG, JPEG or WebP";
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return "Image must be 5MB or smaller";
    }
    return null;
};
