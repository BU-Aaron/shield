export function isImage(mime: string) {
    return /^image\/\w+$/.test(mime);
}

export function isPDF(mime: string) {
    return [
        "application/pdf",
        "application/x-pdf",
        "application/acrobat",
        "application/vnd.pdf",
        "text/pdf",
        "text/x-pdf",
    ].includes(mime);
}

export function isAudio(mime: string) {
    return [
        "audio/mpeg",
        "audio/ogg",
        "audio/wav",
        "audio/x-m4a",
        "audio/webm",
    ].includes(mime);
}

export function isVideo(mime: string) {
    return [
        "video/mp4",
        "video/mpeg",
        "video/ogg",
        "video/quicktime",
        "video/webm",
    ].includes(mime);
}

export function isWord(mime: string) {
    return [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-word.document.macroEnabled.12",
        "application/vnd.ms-word.template.macroEnabled.12",
    ].includes(mime);
}

export function isExcel(mime: string) {
    return [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
        "application/vnd.ms-excel.template.macroEnabled.12",
    ].includes(mime);
}

export function isZip(mime: string) {
    return ["application/zip"].includes(mime);
}

export function isText(mime: string) {
    return [
        "text/plain",
        "text/html",
        "text/css",
        "text/javascript",
        "text/csv",
    ].includes(mime);
}