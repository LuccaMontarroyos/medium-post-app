import MetricsService from "../metrics/MetricsService.js";

export default async (req, res, next) => {
  const start = Date.now();

  MetricsService.incrementRequest(req.path);

  res.on("finish", () => {
    const duration = Date.now() - start;

    MetricsService.addResponseTime(
      req.path,
      duration
    );
  });

  next();
};