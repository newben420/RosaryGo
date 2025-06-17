import { getMysteryIndex } from "./mysteries";
import { Session } from "./session";

class VR {
    v?: string;
    r!: string;
    t?: string;
}

export class PageContent {
    type!: "intro" | "prayer"; // Main type of page
    subtype?: "big" | "small"; // Subtype for intro pages
    picture?: string; // Picture for intro pages
    title!: string; // Title for all type of pages.
    subtitle?: string // Subtitle for all type of pages
    prayer?: VR[] // Prayer content for prayer pages.
    description?: string // Description for small intro pages
    timestamp?: number // Timestamp whether to enable timer on the page
    intention?: string // Intention
    altNext?: string // Alternative text for next button
    rosary?: number; // Rosary index for choosing beads to show
    extraSub?: string; // Just some text beside sub titles. only effective for small intros.
}

const I = (i: number) => `p_${i}`;

export const generatePages = (session: Session): Record<string, PageContent> => {
    const r: Record<string, PageContent> = {};
    if (session.is_dm) {
        r[I(1)] = {
            type: "intro",
            subtype: "big",
            title: "DIVINE_MERCY",
            subtitle: "DIVINE_MERCY_FULL",
            picture: `dm`,
            timestamp: session.start || 0,
            intention: session.intention,
            altNext: "BEGIN",
        };
        r[I(2)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { r: "PRAY.SIGN" }
            ],
            rosary: 1,
        };
        r[I(3)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { v: "PRAY.OUR_FATHER_V", r: "PRAY.OUR_FATHER_R" },
            ],
            rosary: 1,
        };
        r[I(4)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { v: "PRAY.HAIL_MARY_V", r: "PRAY.HAIL_MARY_R" },
            ],
            rosary: 1,
        }
        r[I(5)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { t: "PRAY.CREED_T", r: "PRAY.CREED_R" },
            ],
            rosary: 1,
        };
        r[I(6)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { r: "PRAY.ETERNAL_FATHER_R" },
            ],
            rosary: 2,
        };
        for (let i = 1; i <= 3; i++) {
            r[I(6 + i)] = {
                type: "prayer",
                title: "DIVINE_MERCY",
                subtitle: `${i}`,
                prayer: [
                    { v: "PRAY.FOR_THE_V", r: "PRAY.FOR_THE_R" },
                ],
                rosary: 2 + i,
            }
        };
        for (let i = 1; i <= 5; i++) {
            let index = i + ((i - 1) * 10) + 9;
            let rosaryIndex = i + ((i - 1) * 10) + 6;
            r[I(index)] = {
                type: "prayer",
                title: "DIVINE_MERCY",
                prayer: [
                    { r: "PRAY.ETERNAL_FATHER_R" },
                ],
                rosary: i == 1 ? (6) : rosaryIndex,
            };
            for (let j = 1; j <= 10; j++) {
                r[I(++index)] = {
                    type: "prayer",
                    title: "DIVINE_MERCY",
                    subtitle: `${j}`,
                    prayer: [
                        { v: "PRAY.FOR_THE_V", r: "PRAY.FOR_THE_R" },
                    ],
                    rosary: (++rosaryIndex),
                };
            }
        }
        r[I(65)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { r: "PRAY.HOLY_GOD_R" },
                { r: "PRAY.HOLY_GOD_R" },
                { r: "PRAY.HOLY_GOD_R" },
            ],
            rosary: 7,
        };
        r[I(66)] = {
            type: "prayer",
            title: "DIVINE_MERCY",
            prayer: [
                { t: "PRAY.LUP", r: "PRAY.LUP3" },
            ],
            rosary: 7,
        };
        r[I(67)] = {
            type: "prayer",
            title: `CONCLUDING`,
            prayer: [
                { r: "PRAY.SIGN" }
            ],
            altNext: "FINISH",
            rosary: 1,
        };
    }
    else {
        const myst = getMysteryIndex(session.start || 0);

        r[I(1)] = {
            type: "intro",
            subtype: "big",
            title: "ROSARY",
            subtitle: `MYSTERIES.NAME_${myst}`,
            picture: `${myst}`,
            timestamp: session.start || 0,
            intention: session.intention,
            altNext: "BEGIN",
        };
        r[I(2)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { r: "PRAY.SIGN" }
            ],
            rosary: 1,
        };
        r[I(3)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { v: "PRAY.COME_HOLY_V", r: "PRAY.COME_HOLY_R" },
                { v: "PRAY.SEND_FORTH_V", r: "PRAY.SEND_FORTH_R" },
            ],
            rosary: 2,
        };
        r[I(4)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { t: "PRAY.LUP", r: "PRAY.LUP1" },
            ],
            rosary: 2,
        };
        r[I(5)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { v: "PRAY.THOU_O_V", r: "PRAY.THOU_O_R" },
                { v: "PRAY.INCLINE_UNTO_V", r: "PRAY.INCLINE_UNTO_R" },
            ],
            rosary: 2,
        };
        r[I(6)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { v: "PRAY.DOXOLOGY_V", r: "PRAY.DOXOLOGY_R" },
            ],
            rosary: 2,
        };
        r[I(7)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { t: "PRAY.CREED_T", r: "PRAY.CREED_R" },
            ],
            rosary: 2,
        };
        r[I(8)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { v: "PRAY.OUR_FATHER_V", r: "PRAY.OUR_FATHER_R" },
            ],
            rosary: 2,
        };
        for (let i = 1; i <= 3; i++) {
            r[I(8 + i)] = {
                type: "prayer",
                title: `MYSTERIES.NAME_${myst}`,
                subtitle: `${i}`,
                prayer: [
                    { v: "PRAY.HAIL_MARY_V", r: "PRAY.HAIL_MARY_R" },
                ],
                rosary: 2 + i,
            }
        };
        r[I(12)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { v: "PRAY.DOXOLOGY_V", r: "PRAY.DOXOLOGY_R" },
            ],
            rosary: 6,
        };
        r[I(13)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { t: "PRAY.FATIMA_T", r: "PRAY.FATIMA_R" },
            ],
            rosary: 6,
        };
        for (let i = 1; i <= 5; i++) {
            let index = i + ((i - 1) * 13) + 13;
            let rosaryIndex = i + ((i - 1) * 10) + 6;
            r[I(index)] = {
                type: "intro",
                subtype: "small",
                title: `MYSTERIES.NAME_${myst}`,
                subtitle: `MYSTERIES.NAME_${myst}_${(i - 1)}`,
                description: `MYSTERIES.DESC_${myst}_${(i - 1)}`,
                picture: `${myst}_${(i - 1)}`,
                timestamp: session.start || 0,
                // intention: session.intention,
                altNext: "CONTINUE",
                extraSub: `${i}.`,
            }
            r[I(++index)] = {
                type: "prayer",
                title: `MYSTERIES.NAME_${myst}_${(i - 1)}`,
                prayer: [
                    { v: "PRAY.OUR_FATHER_V", r: "PRAY.OUR_FATHER_R" },
                ],
                rosary: rosaryIndex,
            };
            for (let j = 1; j <= 10; j++) {
                r[I(++index)] = {
                    type: "prayer",
                    title: `MYSTERIES.NAME_${myst}_${(i - 1)}`,
                    subtitle: `${j}`,
                    prayer: [
                        { v: "PRAY.HAIL_MARY_V", r: "PRAY.HAIL_MARY_R" },
                    ],
                    rosary: (++rosaryIndex),
                };
                if (j == 10) {

                }
            }
            rosaryIndex++;
            if (i == 5) {
                rosaryIndex = 7;
            }
            r[I(++index)] = {
                type: "prayer",
                title: `MYSTERIES.NAME_${myst}_${(i - 1)}`,
                prayer: [
                    { v: "PRAY.DOXOLOGY_V", r: "PRAY.DOXOLOGY_R" },
                ],
                rosary: rosaryIndex,
            };
            r[I(++index)] = {
                type: "prayer",
                title: `MYSTERIES.NAME_${myst}_${(i - 1)}`,
                prayer: [
                    { t: "PRAY.FATIMA_T", r: "PRAY.FATIMA_R" },
                ],
                rosary: rosaryIndex,
            };
        }
        r[I(84)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { t: "PRAY.HAIL_HOLY_T", r: "PRAY.HAIL_HOLY_R" },
                { v: "PRAY.PRAY_FOR_V", r: "PRAY.PRAY_FOR_R" },
            ],
            rosary: 7,
        };
        r[I(85)] = {
            type: "prayer",
            title: `MYSTERIES.NAME_${myst}`,
            prayer: [
                { t: "PRAY.LUP", r: "PRAY.LUP2" },
                { v: "PRAY.HH_SUBV_1", r: "PRAY.R_HAVE" },
                { v: "PRAY.HH_SUBV_2", r: "PRAY.R_HAVE" },
                { v: "PRAY.HH_SUBV_3", r: "PRAY.R_PRAY" },
                { v: "PRAY.HH_SUBV_4", r: "PRAY.R_PRAY" },
                { v: "PRAY.HH_SUBV_5", r: "PRAY.R_PRAY" },
            ],
            rosary: 7,
        };
        r[I(86)] = {
            type: "prayer",
            title: "PRAY.LITANY",
            prayer: ([
                { v: "PRAY.LITANY_CONT.V1", r: "PRAY.LITANY_CONT.V1" },
                { v: "PRAY.LITANY_CONT.V2", r: "PRAY.LITANY_CONT.V2" },
                { v: "PRAY.LITANY_CONT.V1", r: "PRAY.LITANY_CONT.V1" },
                { v: "PRAY.LITANY_CONT.V3", r: "PRAY.LITANY_CONT.V4" },
                { v: "PRAY.LITANY_CONT.V5", r: "PRAY.R_HAVE" },
                { v: "PRAY.LITANY_CONT.V6", r: "PRAY.R_HAVE" },
                { v: "PRAY.LITANY_CONT.V7", r: "PRAY.R_HAVE" },
                { v: "PRAY.LITANY_CONT.V8", r: "PRAY.R_HAVE" },
            ].concat((new Array(50)).fill(0).map((a, i) => ({ v: `PRAY.LITANY_CONT.A${(i + 1)}`, r: 'PRAY.R_PRAY' }))))
                .concat([
                    { v: "PRAY.LITANY_CONT.LAMB", r: "PRAY.LITANY_CONT.SPARE" },
                    { v: "PRAY.LITANY_CONT.LAMB", r: "PRAY.LITANY_CONT.GRACE" },
                    { v: "PRAY.LITANY_CONT.LAMB", r: "PRAY.R_HAVE" },
                ]),
            rosary: 7,
        }
        r[I(87)] = {
            type: "prayer",
            title: "PRAY.LITANY",
            prayer: [
                { v: "PRAY.PRAY_FOR_V", r: "PRAY.PRAY_FOR_R" },
                { t: "PRAY.LUP", r: "PRAY.LITANY_CONT.LUP" },
            ],
            rosary: 7,
        }
        r[I(88)] = {
            type: "prayer",
            title: `CONCLUDING`,
            prayer: [
                { r: "PRAY.SIGN" }
            ],
            altNext: "FINISH",
            rosary: 1,
        };
    }
    return r;
}