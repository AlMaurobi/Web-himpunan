import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.5, // Maksimal ukuran 500 KB
    maxWidthOrHeight: 1200, // Maksimal lebar/tinggi 1200px
    useWebWorker: true,
    fileType: "image/webp",
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Gagal mengompresi gambar, menggunakan file asli:", error);
    return file;
  }
}
