const request = require("supertest");
const app = require("../../src/app");

describe("Metrics API", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalMetricsToken = process.env.METRICS_TOKEN;
  const originalProxy = app.proxy;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.METRICS_TOKEN = originalMetricsToken;
    app.proxy = originalProxy;
  });

  test("GET /metrics exposes Prometheus metrics", async () => {
    const response = await request(app.callback()).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/plain");
    expect(response.text).toContain("http_requests_total");
    expect(response.text).toContain("http_request_duration_seconds");
  });

  test("records the route and status code for completed requests", async () => {
    await request(app.callback()).get("/live");

    const response = await request(app.callback()).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toMatch(
      /http_requests_total\{[^}]*route="\/live"[^}]*status_code="200"[^}]*\}/,
    );
    expect(response.text).toMatch(
      /http_request_duration_seconds_count\{[^}]*route="\/live"[^}]*status_code="200"[^}]*\}/,
    );
  });

  test("hides metrics in production without the metrics token", async () => {
    process.env.NODE_ENV = "production";
    process.env.METRICS_TOKEN = "metrics-test-token";
    app.proxy = true;

    const response = await request(app.callback())
      .get("/metrics")
      .set("X-Forwarded-Proto", "https");

    expect(response.status).toBe(404);
  });

  test("allows production metrics with the correct metrics token", async () => {
    process.env.NODE_ENV = "production";
    process.env.METRICS_TOKEN = "metrics-test-token";
    app.proxy = true;

    const response = await request(app.callback())
      .get("/metrics")
      .set("X-Forwarded-Proto", "https")
      .set("X-Metrics-Token", "metrics-test-token");

    expect(response.status).toBe(200);
    expect(response.text).toContain("http_requests_total");
  });
});
