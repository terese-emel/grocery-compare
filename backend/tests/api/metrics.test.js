const request = require("supertest");
const app = require("../../src/app");

describe("Metrics API", () => {
  test("GET /metrics exposes Prometheus metrics", async () => {
    const response = await request(app.callback()).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/plain");
    expect(response.text).toContain("http_requests_total");
    expect(response.text).toContain("http_request_duration_seconds");
  });

  test("records the route and status code for completed requests", async () => {
    await request(app.callback()).get("/metrics");

    const response = await request(app.callback()).get("/metrics");

    expect(response.status).toBe(200);
    expect(response.text).toMatch(
      /http_requests_total\{[^}]*route="\/metrics"[^}]*status_code="200"[^}]*\}/,
    );
    expect(response.text).toMatch(
      /http_request_duration_seconds_count\{[^}]*route="\/metrics"[^}]*status_code="200"[^}]*\}/,
    );
  });
});
