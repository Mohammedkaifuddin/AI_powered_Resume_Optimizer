import mammoth from "mammoth";

export const extractDocText = async (
    buffer: Buffer
): Promise<string> => {
    const result = await mammoth.extractRawText({
        buffer,
    });

    return result.value;
}