import escomplex from "typhonjs-escomplex";
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = join(__dirname, "../src");
const REPORTS_DIR = join(__dirname, "../reports");

const SKIP_DIRS = new Set(["database", "migrations"]);
const SKIP_FILES = new Set(["server.js"]);

const ANALYZE_OPTIONS = {
  logicalor: true,
  switchcase: true,
  forin: true,
  trailingTryCatch: false,
};

function collectJsFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      collectJsFiles(fullPath, files);
      continue;
    }

    if (!entry.endsWith(".js")) continue;
    if (SKIP_FILES.has(entry)) continue;
    files.push(fullPath);
  }

  return files;
}

function parseImports(source, moduleId) {
  const imports = [];
  const staticImport = /import\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g;
  const sideEffectImport = /import\s+["']([^"']+)["']/g;

  let match;
  while ((match = staticImport.exec(source))) {
    imports.push(resolveImportTarget(moduleId, match[1]));
  }
  while ((match = sideEffectImport.exec(source))) {
    imports.push(resolveImportTarget(moduleId, match[1]));
  }

  return imports.filter(Boolean);
}

function resolveImportTarget(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = relative(SRC_ROOT, fromFile).replace(/\\/g, "/");
  const baseDir = base.includes("/") ? base.slice(0, base.lastIndexOf("/")) : "";
  const parts = [...(baseDir ? baseDir.split("/") : []), ...specifier.split("/")];
  const resolved = [];

  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") resolved.pop();
    else resolved.push(part);
  }

  let path = resolved.join("/");
  if (!path.endsWith(".js")) path += ".js";
  return path;
}

function layerOf(modulePath) {
  if (modulePath.startsWith("controllers/")) return "controllers";
  if (modulePath.startsWith("services/")) return "services";
  if (modulePath.startsWith("repositories/")) return "repositories";
  if (modulePath.startsWith("facades/")) return "facades";
  if (modulePath.startsWith("factories/")) return "factories";
  if (modulePath.startsWith("strategies/")) return "strategies";
  if (modulePath.startsWith("serializers/")) return "serializers";
  if (modulePath.startsWith("metrics/")) return "metrics";
  if (modulePath.startsWith("middlewares/")) return "middlewares";
  if (modulePath.startsWith("models/")) return "models";
  return "other";
}

function analyzeCoupling(filesContent) {
  const graph = new Map();

  for (const { moduleId, source } of filesContent) {
    const targets = parseImports(source, join(SRC_ROOT, moduleId));
    graph.set(moduleId, new Set(targets));
  }

  const modules = [...graph.keys()];
  let totalEfferent = 0;
  let totalAfferent = 0;
  const edges = [];

  for (const mod of modules) {
    const efferent = graph.get(mod)?.size || 0;
    totalEfferent += efferent;

    for (const target of graph.get(mod) || []) {
      edges.push({ from: mod, to: target });
      if (!graph.has(target)) continue;
    }
  }

  for (const mod of modules) {
    const afferent = edges.filter((e) => e.to === mod).length;
    totalAfferent += afferent;
  }

  const layerPairs = {};
  for (const { from, to } of edges) {
    const key = `${layerOf(from)} -> ${layerOf(to)}`;
    layerPairs[key] = (layerPairs[key] || 0) + 1;
  }

  const avgEfferent = modules.length ? totalEfferent / modules.length : 0;
  const avgAfferent = modules.length ? totalAfferent / modules.length : 0;

  return {
    moduleCount: modules.length,
    dependencyEdges: edges.length,
    averageEfferentCoupling: Number(avgEfferent.toFixed(2)),
    averageAfferentCoupling: Number(avgAfferent.toFixed(2)),
    couplingByLayer: layerPairs,
    instabilityIndex: Number(
      (avgEfferent / (avgEfferent + avgAfferent || 1)).toFixed(2),
    ),
  };
}

function cohesionByLayer(filesContent) {
  const layers = {};

  for (const { moduleId, report } of filesContent) {
    const layer = layerOf(moduleId);
    if (!layers[layer]) layers[layer] = { modules: 0, totalMaintainability: 0 };
    layers[layer].modules += 1;
    layers[layer].totalMaintainability += report.maintainability;
  }

  const result = {};
  for (const [layer, data] of Object.entries(layers)) {
    result[layer] = {
      modules: data.modules,
      averageMaintainability: Number(
        (data.totalMaintainability / data.modules).toFixed(2),
      ),
      cohesionProxy:
        data.modules <= 1
          ? "single-responsibility module"
          : data.modules <= 4
            ? "high"
            : "moderate",
    };
  }

  return result;
}

function run() {
  const files = collectJsFiles(SRC_ROOT);
  const perFile = [];
  const analyzed = [];

  let totalCyclomatic = 0;
  let functionCount = 0;

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");
    const moduleId = relative(SRC_ROOT, filePath).replace(/\\/g, "/");

    const report = escomplex.analyzeModule(source, ANALYZE_OPTIONS);
    const cyclomatic = report.aggregate.cyclomatic;
    const maintainability = report.maintainability;

    totalCyclomatic += cyclomatic;
    functionCount += report.functions?.length || 0;

    perFile.push({
      module: moduleId,
      cyclomaticComplexity: cyclomatic,
      maintainabilityIndex: Number(maintainability.toFixed(2)),
      linesOfCode: report.aggregate.sloc.logical,
      dependencies: report.dependencies?.length || 0,
    });

    analyzed.push({ moduleId, source, report });
  }

  const averageCyclomaticComplexity = Number(
    (totalCyclomatic / (perFile.length || 1)).toFixed(2),
  );

  const coupling = analyzeCoupling(analyzed);
  const cohesion = cohesionByLayer(
    analyzed.map(({ moduleId, report }) => ({ moduleId, report })),
  );

  const summary = {
    generatedAt: new Date().toISOString(),
    tool: "typhonjs-escomplex",
    filesAnalyzed: perFile.length,
    averageCyclomaticComplexity,
    totalFunctionsAnalyzed: functionCount,
    coupling,
    cohesionByLayer: cohesion,
    perFile: perFile.sort(
      (a, b) => b.cyclomaticComplexity - a.cyclomaticComplexity,
    ),
  };

  mkdirSync(REPORTS_DIR, { recursive: true });
  const jsonPath = join(REPORTS_DIR, "static-metrics.json");
  writeFileSync(jsonPath, JSON.stringify(summary, null, 2), "utf8");

  const mdPath = join(REPORTS_DIR, "static-metrics.md");
  writeFileSync(mdPath, formatMarkdown(summary), "utf8");

  console.log("Static metrics report generated:");
  console.log(`  ${jsonPath}`);
  console.log(`  ${mdPath}`);
  console.log("");
  console.log(`Average cyclomatic complexity: ${averageCyclomaticComplexity}`);
  console.log(
    `Average efferent coupling: ${coupling.averageEfferentCoupling}`,
  );
  console.log(
    `Average afferent coupling: ${coupling.averageAfferentCoupling}`,
  );
}

function formatMarkdown(summary) {
  const topComplex = summary.perFile.slice(0, 10);
  const layers = Object.entries(summary.cohesionByLayer)
    .map(
      ([layer, data]) =>
        `| ${layer} | ${data.modules} | ${data.averageMaintainability} | ${data.cohesionProxy} |`,
    )
    .join("\n");

  return `# Relatório de Métricas Estáticas

Gerado em: ${summary.generatedAt}

## Resumo

| Métrica | Valor |
| --- | --- |
| Arquivos analisados | ${summary.filesAnalyzed} |
| Complexidade ciclomática média (por módulo) | ${summary.averageCyclomaticComplexity} |
| Funções analisadas | ${summary.totalFunctionsAnalyzed} |
| Acoplamento efferente médio | ${summary.coupling.averageEfferentCoupling} |
| Acoplamento afferente médio | ${summary.coupling.averageAfferentCoupling} |
| Índice de instabilidade (Ce/(Ce+Ca)) | ${summary.coupling.instabilityIndex} |

## Coesão por camada (proxy via maintainability)

| Camada | Módulos | Maintainability médio | Coesão (proxy) |
| --- | --- | --- | --- |
${layers}

## Acoplamento entre camadas

${Object.entries(summary.coupling.couplingByLayer)
  .map(([pair, count]) => `- ${pair}: ${count} dependência(s)`)
  .join("\n")}

## Top 10 módulos por complexidade ciclomática

| Módulo | CC | Maintainability | LOC lógicas |
| --- | --- | --- | --- |
${topComplex
  .map(
    (f) =>
      `| ${f.module} | ${f.cyclomaticComplexity} | ${f.maintainabilityIndex} | ${f.linesOfCode} |`,
  )
  .join("\n")}
`;
}

run();
