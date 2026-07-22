import { expect, test } from "@playwright/test";

test("the public home exposes the three-step journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Votre tour, sans rester debout." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Choisissez" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suivez" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Présentez-vous" })).toBeVisible();
});

test("a visitor can reach registration in one action", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Prendre un ticket" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Reprenez le contrôle de votre temps." })).toBeVisible();
});

