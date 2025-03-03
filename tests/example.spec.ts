import { test, expect } from "@playwright/test";

test.describe("Registration/Login", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });
    test("should redirect to /auth/register when link is clicked", async ({ page }) => {
        const registerLink = await page.getByText("Regisztráció");
        expect(registerLink).not.toBeNull();

        await registerLink.click();

        await page.waitForURL(/\/auth\/register/);

        console.log("URL after click:", page.url());

        expect(page.url()).toContain("/auth/register");
    });
    test("should redirect to /auth/login when link is clicked", async ({ page }) => {
        const loginLink = await page.getByText("Bejelentkezés");
        expect(loginLink).not.toBeNull();

        await loginLink.click();

        await page.waitForURL(/\/auth\/login/);

        console.log("URL after click:", page.url());

        expect(page.url()).toContain("/auth/login");
    });

    test.describe("Registration", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/auth/register");
        });

        test("Register ui should be displayed", async ({ page }) => {
            const usernameInput = await page.getByLabel("Felhasználó név");
            expect(usernameInput).not.toBeNull();
            const emailInput = await page.getByLabel("E-mail");
            expect(emailInput).not.toBeNull();
            const passwordInput = await page.getByLabel("Jelszó");
            expect(passwordInput).not.toBeNull();
            const registerButton = await page.getByRole("button", { name: "Regisztráció" });
            expect(registerButton).not.toBeNull();
        });

        test("Empty form should not be able to be submitted", async ({ page }) => {
            const registerButton = await page.getByRole("button", { name: "Regisztráció" });
            await registerButton.click();

            expect(page.url()).toContain("/auth/login");
        });

        test("", async ({ page }) => {});
    });
});
