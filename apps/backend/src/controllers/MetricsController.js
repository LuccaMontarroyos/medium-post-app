import MetricsService from "../metrics/MetricsService.js";

class MetricsController {
  async index(req, res) {
    return res.json(MetricsService.getMetrics());
  }
}

export default new MetricsController();