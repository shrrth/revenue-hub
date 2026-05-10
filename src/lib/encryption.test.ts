import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import crypto from "crypto";

const TEST_KEY = crypto.randomBytes(32).toString("hex");

describe("encryption", () => {
  beforeAll(() => {
    vi.stubEnv("ENCRYPTION_KEY", TEST_KEY);
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it("encrypt then decrypt returns original string", async () => {
    const { encrypt, decrypt } = await import("./encryption");
    const plaintext = "sk_test_abc123456789";
    const encrypted = encrypt(plaintext);
    expect(encrypted).not.toBe(plaintext);
    expect(decrypt(encrypted)).toBe(plaintext);
  });

  it("produces different ciphertext for same input (random IV)", async () => {
    const { encrypt } = await import("./encryption");
    const plaintext = "sk_test_abc123456789";
    const a = encrypt(plaintext);
    const b = encrypt(plaintext);
    expect(a).not.toBe(b);
  });

  it("rejects tampered ciphertext", async () => {
    const { encrypt, decrypt } = await import("./encryption");
    const encrypted = encrypt("secret");
    const tampered = encrypted.slice(0, -2) + "AA";
    expect(() => decrypt(tampered)).toThrow();
  });

  it("handles empty string", async () => {
    const { encrypt, decrypt } = await import("./encryption");
    const encrypted = encrypt("");
    expect(decrypt(encrypted)).toBe("");
  });

  it("handles unicode", async () => {
    const { encrypt, decrypt } = await import("./encryption");
    const plaintext = "토큰값_测试_🔑";
    const encrypted = encrypt(plaintext);
    expect(decrypt(encrypted)).toBe(plaintext);
  });
});
