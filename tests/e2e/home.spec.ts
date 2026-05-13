import { expect, test } from "@playwright/test";

test("homepage includes reg lookup and turbo search", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Search Turbos For Your Vehicle" })).toBeVisible();
  await expect(page.getByLabel("Find your turbo")).toBeVisible();
});
