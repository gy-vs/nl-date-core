import * as chrono from "../src/";
import { testSingleCase } from "./test_util";

/*
    Regression tests: when the reference includes a `timezone`, the results must be identical
    to running on a server located in that timezone (without `timezone`), regardless of the
    host system timezone. These cases must pass under any `TZ` the test process runs in.

    The reference instant 2024-03-06T23:30:00Z is:
    - Thu 2024-03-07 08:30 in JST (the user's timezone)
    - Wed 2024-03-06 23:30 in UTC
    - Wed 2024-03-06 18:30 in America/New_York
*/
const REF_INSTANT = new Date("2024-03-06T23:30:00Z");
const REF_IN_JST = { instant: REF_INSTANT, timezone: "JST" };

test("Test - Weekday with forwardDate", function () {
    // Thursday noon in JST, not next week's Thursday
    testSingleCase(chrono, "Thursday", REF_IN_JST, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T03:00:00Z"));
    });
});

test("Test - Date without year with forwardDate", function () {
    // March 7 of this year in JST, not 2025
    testSingleCase(chrono, "March 7", REF_IN_JST, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T03:00:00Z"));
    });
});

test("Test - Time only with forwardDate", function () {
    // 3pm today in JST
    testSingleCase(chrono, "3pm", REF_IN_JST, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T06:00:00Z"));
    });
});

test("Test - Casual date reference", function () {
    testSingleCase(chrono, "tomorrow", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T23:30:00Z"));
    });
});

test("Test - ZH hans casual date and time", function () {
    testSingleCase(chrono.zh.hans, "明天", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-08T03:00:00Z"));
    });

    testSingleCase(chrono.zh.hans, "今天上午9点", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T00:00:00Z"));
    });

    testSingleCase(chrono.zh.hans, "下午3点", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T06:00:00Z"));
    });

    testSingleCase(chrono.zh.hans, "现在", REF_IN_JST, (result) => {
        expect(result).toBeDate(REF_INSTANT);
    });
});

test("Test - ZH hans deadline format", function () {
    testSingleCase(chrono.zh.hans, "3天内", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-10T03:00:00Z"));
    });
});

test("Test - ZH hant casual date and time", function () {
    testSingleCase(chrono.zh.hant, "明天", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-08T03:00:00Z"));
    });

    testSingleCase(chrono.zh.hant, "今天上午9點", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T00:00:00Z"));
    });

    testSingleCase(chrono.zh.hant, "3天內", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-10T03:00:00Z"));
    });
});

test("Test - JA casual date", function () {
    testSingleCase(chrono.ja, "明日", REF_IN_JST, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T23:30:00Z"));
    });
});
