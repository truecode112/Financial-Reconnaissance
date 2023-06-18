import { queryStringFromObject, slugify, sanitizeNumberInput } from "../lib/utils";

test("Generates accurate query string", () => {
    const queryObject = {
        terminal: "1001234",
        date: "2021-10-13",
        sqn: "1256",
        issuer: "1"
    }

    for (const key in queryObject) {
        const value = key + "=" + queryObject[key]
        expect(queryStringFromObject(queryObject)).toContain(value)
    }
})

test("Generate accurate url (pathname)", () => {
    expect(slugify("Journal & Footage Retrieval")).toBe("journal-footage-retrieval")
    expect(slugify("Audit Trail / Login Audit")).toBe("audit-trail-login-audit")
    expect(slugify("Location***()$#@Analysis^%")).toBe("location-analysis")
})

test("Allow only numbers on input", () => {
    expect(sanitizeNumberInput("bojack700*726%")).toBe(700726)
})