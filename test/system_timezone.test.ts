import * as chrono from "../src/";
import { testSingleCase } from "./test_util";

test("Test - Using reference with timezone", function () {
    testSingleCase(
        chrono,
        "Friday at 4pm",
        {
            instant: new Date("Wed Jun 09 2021 07:00:00 GMT-0500 (CDT)"),
            timezone: "CDT",
        },
        (result) => {
            expect(result).toBeDate(new Date("Fri Jun 11 2021 16:00:00 GMT-0500 (CDT)"));
            expect(result).toBeDate(new Date("Sat Jun 12 2021 06:00:00 GMT+0900 (JST)"));
        }
    );
    testSingleCase(
        chrono,
        "1am",
        {
            instant: new Date("Wed May 26 2022 01:57:00 GMT-0500 (CDT)"),
            timezone: "CDT",
        },
        (result) => {
            expect(result.start.get("year")).toBe(2022);
            expect(result.start.get("month")).toBe(5);
            expect(result.start.get("day")).toBe(26);
            expect(result.start.get("hour")).toBe(1);
        }
    );
});

test("Test - Using reference with missing/default timezone", function () {
    const INPUT = "Friday at 4pm";
    const REF_INSTANT = new Date(2021, 6 - 1, 9, 7, 0, 0);
    const EXPECTED_INSTANT = new Date(2021, 6 - 1, 11, 16, 0, 0);

    testSingleCase(chrono, INPUT, REF_INSTANT, (result) => {
        expect(result).toBeDate(EXPECTED_INSTANT);
    });

    testSingleCase(chrono, INPUT, { instant: REF_INSTANT }, (result) => {
        expect(result).toBeDate(EXPECTED_INSTANT);
    });

    testSingleCase(chrono, INPUT, { instant: REF_INSTANT, timezone: null }, (result) => {
        expect(result).toBeDate(EXPECTED_INSTANT);
    });

    testSingleCase(chrono, INPUT, { instant: REF_INSTANT, timezone: "" }, (result) => {
        expect(result).toBeDate(EXPECTED_INSTANT);
    });
});

test("Test - Using reference instance with different timezone", function () {
    // Sun Jun 06 2021 19:00:00 GMT+0900 (JST)
    // Sun Jun 06 2021 11:00:00 GMT+0100 (BST)
    const refInstant = new Date("Sun Jun 06 2021 19:00:00 GMT+0900 (JST)");

    // "At 4pm tomorrow" at "Sun Jun 06 2021 11:00:00 (BST)"
    testSingleCase(chrono, "At 4pm tomorrow", { instant: refInstant, timezone: "BST" }, (result) => {
        const expectedInstant = new Date("Mon Jun 07 2021 16:00:00 GMT+0100 (BST)");
        expect(result).toBeDate(expectedInstant);
    });

    // "At 4pm tomorrow" at "Sun Jun 06 2021 19:00:00 (JST)"
    testSingleCase(chrono, "At 4pm tomorrow", { instant: refInstant, timezone: "JST" }, (result) => {
        const expectedInstant = new Date("Mon Jun 07 2021 16:00:00 GMT+0900 (JST)");
        expect(result).toBeDate(expectedInstant);
    });
});

test("Test - Using reference instance with custom timezones", function () {
    // Sun Jun 06 2021 19:00:00 GMT+0900 (JST)
    // Sun Jun 06 2021 11:00:00 GMT+0100 (BST)
    const refInstant = new Date("Sun Jun 06 2021 19:00:00 GMT+0900 (JST)");

    // Fictional timezones
    const timezones = {
        "JJJ": 540, // JJJ => GMT+0900 JST
        "BBB": 60, // BBB => GMT+0100 BST
    };

    // "At 4pm tomorrow" at "Sun Jun 06 2021 11:00:00 (BBB = BST)"
    testSingleCase(
        chrono,
        "At 4pm tomorrow",
        { instant: refInstant, timezone: "BBB" },
        { timezones: timezones },
        (result) => {
            const expectedInstant = new Date("Mon Jun 07 2021 16:00:00 GMT+0100 (BST)");
            expect(result).toBeDate(expectedInstant);
        }
    );

    // "At 4pm tomorrow" at "Sun Jun 06 2021 19:00:00 (JJJ = JST)"
    testSingleCase(
        chrono,
        "At 4pm tomorrow",
        { instant: refInstant, timezone: "JJJ" },
        { timezones: timezones },
        (result) => {
            const expectedInstant = new Date("Mon Jun 07 2021 16:00:00 GMT+0900 (JST)");
            expect(result).toBeDate(expectedInstant);
        }
    );
});

test("Test - Timezone difference on reference date #2", function () {
    const refInstant = new Date("2024-02-21T10:00:00+1300");

    testSingleCase(chrono, "yesterday 18:00", { instant: refInstant, timezone: 780 }, (result) => {
        // expect(result.start.get("year")).toBe(2024);
        // expect(result.start.get("month")).toBe(2);
        // expect(result.start.get("day")).toBe(20);
        // expect(result).toBeDate(new Date("2024-02-20T18:00:00+1300"));
    });
});

test("Test - Timezone difference on written date", function () {
    // Sun Jun 06 2021 19:00:00 GMT+0900 (JST)
    // Sun Jun 06 2021 11:00:00 GMT+0100 (BST)
    const refInstant = new Date("Sun Jun 06 2021 19:00:00 GMT+0900 (JST)");

    testSingleCase(chrono, "Sun Jun 06 2021 19:00:00", { timezone: "JST" }, (result) => {
        expect(result).toBeDate(refInstant);
    });

    testSingleCase(chrono, "Sun Jun 06 2021 11:00:00", { timezone: "BST" }, (result) => {
        expect(result).toBeDate(refInstant);
    });

    testSingleCase(chrono, "Sun Jun 06 2021 11:00:00", { timezone: 60 }, (result) => {
        expect(result).toBeDate(refInstant);
    });
});

test("Test - Precise [now] mentioned", function () {
    const refDate = new Date("Sat Mar 13 2021 14:22:14 GMT+0900 (Japan Standard Time)");

    testSingleCase(chrono, "now", refDate, (result) => {
        expect(result).toBeDate(refDate);
    });

    testSingleCase(chrono, "now", { instant: refDate }, (result) => {
        expect(result).toBeDate(refDate);
    });

    testSingleCase(chrono, "now", { instant: refDate, timezone: 540 }, (result) => {
        expect(result).toBeDate(refDate);
    });

    testSingleCase(chrono, "now", { instant: refDate, timezone: "JST" }, (result) => {
        expect(result).toBeDate(refDate);
    });

    testSingleCase(chrono, "now", { instant: refDate, timezone: -300 }, (result) => {
        expect(result).toBeDate(refDate);
    });
});

test("Test - Precise date/time mentioned", function () {
    const text = "Sat Mar 13 2021 14:22:14 GMT+0900";
    const refDate = new Date();

    testSingleCase(chrono, text, refDate, (result, text) => {
        expect(result).toBeDate(new Date(text));
    });

    testSingleCase(chrono, text, { instant: refDate }, (result) => {
        expect(result).toBeDate(new Date(text));
    });

    testSingleCase(chrono, text, { instant: refDate, timezone: 540 }, (result) => {
        expect(result).toBeDate(new Date(text));
    });

    testSingleCase(chrono, text, { instant: refDate, timezone: "JST" }, (result) => {
        expect(result).toBeDate(new Date(text));
    });

    testSingleCase(chrono, text, { instant: refDate, timezone: -300 }, (result) => {
        expect(result).toBeDate(new Date(text));
    });
});

// Parsing with a reference timezone must give the same result as parsing on a system
// already in that timezone (without reference timezone), regardless of the system timezone.
// The reference instant 2024-03-06T23:30:00Z is Thursday 2024-03-07 08:30 in JST,
// but still Wednesday evening in UTC/America — so host timezones must not leak into results.
test("Test - Reference with timezone is independent of the system timezone", function () {
    const refInstant = new Date("2024-03-06T23:30:00Z"); // Thu 2024-03-07 08:30 JST
    const reference = { instant: refInstant, timezone: "JST" };

    // English - weekday with forwardDate: the coming Thursday is today, not next week
    testSingleCase(chrono.en.casual, "Thursday", reference, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T12:00:00+09:00"));
    });

    // English - date without year with forwardDate: March 7 is today (this year), not next year
    testSingleCase(chrono.en.casual, "March 7", reference, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T12:00:00+09:00"));
    });

    // English - time-only with forwardDate: 3pm today in JST
    testSingleCase(chrono.en.casual, "3pm", reference, { forwardDate: true }, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T15:00:00+09:00"));
    });

    // English - casual relative date
    testSingleCase(chrono.en.casual, "tomorrow", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T23:30:00Z"));
    });

    // Chinese (simplified) - 明天 is Friday in JST, not the system timezone's "tomorrow"
    testSingleCase(chrono.zh.hans, "明天", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-08T12:00:00+09:00"));
    });

    testSingleCase(chrono.zh.hans, "今天上午9点", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T09:00:00+09:00"));
    });

    testSingleCase(chrono.zh.hans, "下午3点", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T15:00:00+09:00"));
    });

    testSingleCase(chrono.zh.hans, "3天内", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-10T12:00:00+09:00"));
    });

    // Chinese (traditional)
    testSingleCase(chrono.zh.hant, "明天", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-08T12:00:00+09:00"));
    });

    testSingleCase(chrono.zh.hant, "今日下午3點", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T15:00:00+09:00"));
    });

    // Japanese
    testSingleCase(chrono.ja, "明日", reference, (result) => {
        expect(result).toBeDate(new Date("2024-03-07T23:30:00Z"));
    });
});
