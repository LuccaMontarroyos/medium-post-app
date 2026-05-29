class MetricsService {
    constructor() {
      this.metrics = {
        totalRequests: 0,
        cacheHits: 0,
        cacheMisses: 0,
        routes: {},
      };
    }
  
    incrementRequest(route) {
      this.metrics.totalRequests++;
  
      if (!this.metrics.routes[route]) {
        this.metrics.routes[route] = {
          count: 0,
          totalResponseTime: 0,
        };
      }
  
      this.metrics.routes[route].count++;
    }
  
    addResponseTime(route, time) {
      this.metrics.routes[route].totalResponseTime += time;
    }
  
    incrementCacheHit() {
      this.metrics.cacheHits++;
    }
  
    incrementCacheMiss() {
      this.metrics.cacheMisses++;
    }
  
    getMetrics() {
      return this.metrics;
    }
  }
  
  export default new MetricsService();