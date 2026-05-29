import { describe, it, expect, beforeEach } from "vitest";
import MetricsService from "../../src/metrics/MetricsService.js";

describe("MetricsService", () => {
  beforeEach(() => {
    MetricsService.metrics = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      routes: {},
    };
  });

  it("tracks request count per route", () => {
    MetricsService.incrementRequest("/posts");
    MetricsService.incrementRequest("/posts");

    const metrics = MetricsService.getMetrics();
    expect(metrics.totalRequests).toBe(2);
    expect(metrics.routes["/posts"].count).toBe(2);
  });

  it("accumulates response time per route", () => {
    MetricsService.incrementRequest("/posts");
    MetricsService.addResponseTime("/posts", 120);
    MetricsService.addResponseTime("/posts", 80);

    const route = MetricsService.getMetrics().routes["/posts"];
    expect(route.totalResponseTime).toBe(200);
  });

  it("tracks cache hits and misses", () => {
    MetricsService.incrementCacheHit();
    MetricsService.incrementCacheMiss();

    const metrics = MetricsService.getMetrics();
    expect(metrics.cacheHits).toBe(1);
    expect(metrics.cacheMisses).toBe(1);
  });
});
