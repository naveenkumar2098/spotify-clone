/**
 * Slugify user-provided text so it is safe to use inside a storage object path.
 * Lowercase, non [a-z0-9-] replaced by "-", collapsed, trimmed, max 50 chars.
 */
const sanitizeFileName = (input: string | null | undefined): string => {
    const slug = (input ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-{2,}/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 50)
        .replace(/-+$/g, "");

    return slug || "untitled";
};

export default sanitizeFileName;
