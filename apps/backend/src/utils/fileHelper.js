// src/utils/fileHelper.js
import fs from "fs/promises";
import path from "path";

/**
 * Remove um arquivo de imagem do disco
 * @param {string|null} imagePath - Caminho salvo no banco (ex: "/uploads/posts/123.png")
 */
export async function deleteImageFile(imagePath) {
  if (!imagePath) return;

  try {
    // Normaliza para caminho absoluto no servidor
    const fullPath = path.resolve(process.cwd(), "." + imagePath);
    await fs.unlink(fullPath);
    console.log(`Imagem removida: ${fullPath}`);
  } catch (err) {
    // Se o arquivo não existir, apenas loga
    if (err.code !== "ENOENT") {
      console.error("Erro ao remover imagem:", err);
    }
  }
}
