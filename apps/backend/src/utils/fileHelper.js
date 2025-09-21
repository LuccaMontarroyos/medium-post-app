import fs from "fs/promises";
import path from "path";

/**
 * @param {string|null} imagePath 
 */
export async function deleteImageFile(imagePath) {
  if (!imagePath) return;

  try {
    
    const fullPath = path.resolve(process.cwd(), "." + imagePath);
    await fs.unlink(fullPath);

  } catch (err) {
    
    if (err.code !== "ENOENT") {
      console.error("Erro ao remover imagem:", err);
    }
  }
}
