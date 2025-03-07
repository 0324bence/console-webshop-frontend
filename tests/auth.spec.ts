import { test, expect, type Locator } from "@playwright/test";

let goodCredentials = {
    username: "",
    email: "email@email.com",
    password: "pass123"
};

let badCredentials = {
    username: "user",
    email: "email@a.a",
    password: "pass"
};

let registered = false;

test.describe.configure({ mode: "serial" });

test.beforeAll(async () => {
    goodCredentials.username = Math.random().toString(36).substring(2);
});

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
});
test("should redirect to /auth/register when link is clicked", async ({ page }) => {
    const registerLink = await page.getByText("Regisztráció");
    await expect(registerLink).toBeVisible();

    await registerLink.click();

    await page.waitForURL(/\/auth\/register/, { timeout: 2000 });

    console.log("URL after click:", page.url());

    expect(page.url()).toContain("/auth/register");
});
test("should redirect to /auth/login when link is clicked", async ({ page }) => {
    const loginLink = await page.getByText("Bejelentkezés");
    await expect(loginLink).toBeVisible();

    await loginLink.click();

    await page.waitForURL(/\/auth\/login/, { timeout: 2000 });

    console.log("URL after click:", page.url());

    expect(page.url()).toContain("/auth/login");
});

test.describe("Registration", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/auth/register");
    });

    test("Register ui should be displayed", async ({ page }) => {
        const usernameInput = await page.getByLabel("Felhasználó név");
        await expect(usernameInput).toBeVisible();
        const emailInput = await page.getByLabel("E-mail");
        await expect(emailInput).toBeVisible();
        const passwordInput = await page.getByLabel("Jelszó");
        await expect(passwordInput).toBeVisible();
        const registerButton = await page.getByRole("button", { name: "Regisztráció" });
        await expect(registerButton).toBeVisible();
    });

    test("Empty form should not be able to be submitted", async ({ page }) => {
        const registerButton = await page.getByRole("button", { name: "Regisztráció" });
        await expect(registerButton).toBeVisible();

        await registerButton.click();

        expect(page.url()).toContain("/auth/register");
    });

    test.describe("Credentials", () => {
        test.describe("Bad", () => {
            let usernameInput: Locator;
            let emailInput: Locator;
            let passwordInput: Locator;
            let registerButton: Locator;
            test.beforeEach(async ({ page }) => {
                usernameInput = await page.getByLabel("Felhasználó név");
                emailInput = await page.getByLabel("E-mail");
                passwordInput = await page.getByLabel("Jelszó");
                registerButton = await page.getByRole("button", { name: "Regisztráció" });

                await usernameInput.fill(goodCredentials.username);
                await emailInput.fill(badCredentials.email);
                await passwordInput.fill(goodCredentials.password);
            });

            test("Bad email should be rejected by backend", async ({ page }) => {
                await registerButton.click();

                await page.waitForSelector("#error", { timeout: 2000 });
                const error = await page.locator("#error");
                await expect(error).toBeVisible();
                await expect(error).toContainText("email");

                expect(page.url()).toContain("/auth/register");
            });

            test.describe("Partial data should not be able to be submitted", () => {
                test("Missing username", async ({ page }) => {
                    usernameInput.fill("");
                    await registerButton.click();

                    expect(page.url()).toContain("/auth/register");
                });

                test("Missing email", async ({ page }) => {
                    emailInput.fill("");
                    await registerButton.click();

                    expect(page.url()).toContain("/auth/register");
                });
                test("Missing password", async ({ page }) => {
                    passwordInput.fill("");
                    await registerButton.click();

                    expect(page.url()).toContain("/auth/register");
                });
            });
        });

        test.describe("Good", () => {
            let usernameInput: Locator;
            let emailInput: Locator;
            let passwordInput: Locator;
            let registerButton: Locator;
            test.beforeEach(async ({ page }) => {
                usernameInput = await page.getByLabel("Felhasználó név");
                emailInput = await page.getByLabel("E-mail");
                passwordInput = await page.getByLabel("Jelszó");
                registerButton = await page.getByRole("button", { name: "Regisztráció" });

                await usernameInput.fill(goodCredentials.username);
                await emailInput.fill(goodCredentials.email);
                await passwordInput.fill(goodCredentials.password);
            });

            test("Good credentials should be able to be submitted", async ({ page }) => {
                await registerButton.click();

                await page.waitForURL(/\/auth\/login/, { timeout: 2000 });

                expect(page.url()).toContain("/auth/login");

                registered = true;
            });
        });
    });
});

test.describe("Login", () => {
    test.beforeEach(async ({ page }) => {
        expect(registered).toBe(true);
        await page.goto("/auth/login");
    });

    test("Login ui should be displayed", async ({ page }) => {
        const usernameInput = await page.getByLabel("Felhasználó név");
        await expect(usernameInput).toBeVisible();
        const passwordInput = await page.getByLabel("Jelszó");
        await expect(passwordInput).toBeVisible();
        const registerButton = await page.getByRole("button", { name: "Bejelentkezés" });
        await expect(registerButton).toBeVisible();
    });

    test("Empty form should not be able to be submitted", async ({ page }) => {
        const registerButton = await page.getByRole("button", { name: "Bejelentkezés" });
        await expect(registerButton).toBeVisible();

        await registerButton.click();

        expect(page.url()).toContain("/auth/login");
    });

    test.describe("Credentials", () => {
        test.describe("Bad", () => {
            let usernameInput: Locator;
            let passwordInput: Locator;
            let loginButton: Locator;
            test.beforeEach(async ({ page }) => {
                usernameInput = await page.getByLabel("Felhasználó név");
                passwordInput = await page.getByLabel("Jelszó");
                loginButton = await page.getByRole("button", { name: "Bejelentkezés" });

                await usernameInput.fill(badCredentials.username);
                await passwordInput.fill(badCredentials.password);
            });
            test("Bad credentials should return error message", async ({ page }) => {
                await loginButton.click();

                await page.waitForSelector("#error");
                const error = await page.locator("#error");
                await expect(error).toBeVisible();
                await expect(error).toContainText("user");

                expect(page.url()).toContain("/auth/login");
            });

            test("Bad username should return correct error message", async ({ page }) => {
                await passwordInput.fill(goodCredentials.password);
                await loginButton.click();

                await page.waitForSelector("#error");
                const error = await page.locator("#error");
                await expect(error).toBeVisible();
                await expect(error).toContainText("user");

                expect(page.url()).toContain("/auth/login");
            });

            test("Bad password should return correct error message", async ({ page }) => {
                await usernameInput.fill(goodCredentials.username);
                await loginButton.click();

                await page.waitForSelector("#error");
                const error = await page.locator("#error");
                await expect(error).toBeVisible();
                await expect(error).toContainText("password");

                expect(page.url()).toContain("/auth/login");
            });

            test.describe("Partial data should not be able to be submitted", () => {
                test("Missing username", async ({ page }) => {
                    usernameInput.fill("");
                    await loginButton.click();

                    expect(page.url()).toContain("/auth/login");
                });

                test("Missing password", async ({ page }) => {
                    passwordInput.fill("");
                    await loginButton.click();

                    expect(page.url()).toContain("/auth/login");
                });
            });
        });

        test.describe("Good", () => {
            let usernameInput: Locator;
            let passwordInput: Locator;
            let loginButton: Locator;
            test.beforeEach(async ({ page }) => {
                usernameInput = await page.getByLabel("Felhasználó név");
                passwordInput = await page.getByLabel("Jelszó");
                loginButton = await page.getByRole("button", { name: "Bejelentkezés" });

                await usernameInput.fill(goodCredentials.username);
                await passwordInput.fill(goodCredentials.password);
            });

            test("Good credentials should be able to be submitted", async ({ page }) => {
                await loginButton.click();

                await page.waitForURL(/\/$/, { timeout: 2000 });

                expect(page.url()).toContain("/");
            });
        });
    });
});
