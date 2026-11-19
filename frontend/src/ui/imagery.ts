/**
 * Photographs that match what the application is about.
 *
 * Why a curated library rather than a keyword service
 * --------------------------------------------------
 *
 * A generated application looks generic for one reason above all others: its
 * pictures have nothing to do with its subject. A cafe ordering app showing
 * three random landscapes reads as a template, however well the rest of it is
 * composed.
 *
 * The obvious fix is a keyword placeholder service — ask for "espresso" and
 * get an espresso. There is no longer one to use: `source.unsplash.com` was
 * retired and answers 503, and loremflickr answers 500. Anything else wants an
 * API key, and the agent that writes these screens has no network access and
 * cannot be given one.
 *
 * So the subject matter is decided here instead. Each topic below holds a
 * handful of photo ids on the Unsplash CDN, every one checked to resolve and
 * looked at to confirm it shows what its topic claims. Hotlinking these is
 * what the Unsplash licence is for, the CDN does the resizing and cropping,
 * and there is no key, no request at build time and nothing to install.
 *
 * The trade is honest: a fixed set of photographs rather than an unbounded
 * one. For an application whose purpose is to be looked at and judged in its
 * first ten seconds, a photograph that is certainly on-topic beats one that is
 * possibly novel.
 *
 * Picking is deterministic — see {@link photo}. The same seed always resolves
 * to the same photograph, so a list does not reshuffle on re-render and two
 * views of one record agree.
 */
import type { Loose } from "./props";

/**
 * The subjects the library covers.
 *
 * Deliberately named after what an application is *about* rather than after
 * what is in the frame, because that is what the caller knows: a lettings
 * product asks for `realestate`, not for "house exterior at dusk".
 */
export type ImageTopic =
  | "analytics"
  | "art"
  | "automotive"
  | "bakery"
  | "charity"
  | "coffee"
  | "construction"
  | "dental"
  | "ecommerce"
  | "education"
  | "events"
  | "fashion"
  | "finance"
  | "fitness"
  | "food"
  | "gaming"
  | "garden"
  | "health"
  | "hospitality"
  | "hotel"
  | "kids"
  | "legal"
  | "logistics"
  | "music"
  | "nature"
  | "people"
  | "pets"
  | "pharmacy"
  | "photography"
  | "realestate"
  | "restaurant"
  | "retail"
  | "salon"
  | "science"
  | "spa"
  | "sports"
  | "team"
  | "tech"
  | "travel"
  | "wedding"
  | "workspace"
  | "yoga";

/**
 * Unsplash photo ids per topic.
 *
 * Every id here was fetched (HTTP 200 from the CDN) and inspected before being
 * written down, so none of them is a plausible-looking guess. Keep it that
 * way: an id that 404s shows the frame's fallback gradient forever, and an id
 * that resolves to the wrong subject is worse than no photograph at all.
 */
const TOPIC_PHOTOS: Record<ImageTopic, readonly string[]> = {
  art: [
    "1606819717115-9159c900370b",
    "1518998053901-5348d3961a04",
    "1780933333107-903b8c065b4d",
    "1554907984-15263bfd63bd",
    "1780328863518-59a2105192ac",
  ],
  bakery: [
    "1773492136203-7d3decae79aa",
    "1608198093002-ad4e005484ec",
    "1587241321921-91a834d6d191",
    "1767939409311-fa76713560cb",
    "1623334044303-241021148842",
  ],
  charity: [
    "1593113598332-cd288d649433",
    "1628717341663-0007b0ee2597",
    "1783028104792-8506735c0383",
    "1760992003928-e2ed759fa846",
    "1578357078586-491adf1aa5ba",
  ],
  coffee: [
    "1453614512568-c4024d13c247",
    "1769114474398-a7aef0625ef0",
    "1447933601403-0c6688de566e",
    "1495474472287-4d71bcdd2085",
    "1541167760496-1628856ab772",
  ],
  construction: [
    "1541888946425-d81bb19240f5",
    "1535732759880-bbd5c7265e3f",
    "1589939705384-5185137a7f0f",
    "1587582423116-ec07293f0395",
    "1768677903496-becc4be07258",
  ],
  dental: [
    "1606811971618-4486d14f3f99",
    "1771442873038-dda05b6ca447",
    "1777331903190-341a3dd0441b",
    "1593022356769-11f762e25ed9",
    "1598256989800-fe5f95da9787",
  ],
  analytics: [
    "1460925895917-afdab827c52f",
    "1551288049-bebda4e38f71",
    "1543286386-713bdd548da4",
    "1591696205602-2f950c417cb9",
  ],
  automotive: [
    "1502877338535-766e1452684a",
    "1503376780353-7e6692767b70",
    "1492144534655-ae79c964c9d7",
    "1583121274602-3e2820c69888",
    "1552519507-da3b142c6e3d",
  ],
  ecommerce: [
    "1542291026-7eec264c27ff",
    "1556906781-9a412961c28c",
    "1549298916-b41d501d3772",
    "1595950653106-6c9ebd614d3a",
    "1553062407-98eeb64c6a62",
    "1607082348824-0a96f2a4b9da",
    "1605902711622-cfb43c4437b5",
  ],
  education: [
    "1427504494785-3a9ca7044f45",
    "1509062522246-3755977927d7",
    "1577896851231-70ef18881754",
    "1588072432836-e10032774350",
    "1541339907198-e08756dedf3f",
    "1503676260728-1c00da094a0b",
  ],
  events: [
    "1459749411175-04bf5292ceea",
    "1492684223066-81342ee5ff30",
    "1517457373958-b7bdd4587205",
    "1524178232363-1fb2b075b655",
    "1511578314322-379afb476865",
    "1464366400600-7168b8af9bc3",
    "1556761175-5973dc0f32e7",
  ],
  fashion: [
    "1441986300917-64674bd600d8",
    "1567401893414-76b7b1e5a7a5",
    "1601924994987-69e26d50dc26",
    "1483985988355-763728e1935b",
    "1542291026-7eec264c27ff",
  ],
  finance: [
    "1486406146926-c627a92ad1ab",
    "1554224155-6726b3ff858f",
    "1554224154-22dec7ec8818",
    "1554224154-26032ffc0d07",
    "1579621970588-a35d0e7ab9b6",
    "1591696205602-2f950c417cb9",
    "1526045612212-70caf35c14df",
  ],
  fitness: [
    "1517836357463-d25dfeac3438",
    "1534438327276-14e5300c3a48",
    "1540496905036-5937c10647cc",
    "1518611012118-696072aa579a",
    "1571019613454-1cb2f99b2d8b",
    "1571902943202-507ec2618e8f",
  ],
  food: [
    "1414235077428-338989a2e8c0",
    "1476224203421-9ac39bcb3327",
    "1504674900247-0877df9cc836",
    "1540189549336-e6e99c3679fe",
    "1551782450-a2132b4ba21d",
    "1565299624946-b28f40a0ae38",
    "1579684947550-22e945225d9a",
    "1490645935967-10de6ba17061",
  ],
  garden: [
    "1622383563227-04401ab4e5ea",
    "1621460248083-6271cc4437a8",
    "1611843467160-25afb8df1074",
    "1515150144380-bca9f1650ed9",
    "1776353487865-5b5bd2d8969b",
  ],
  gaming: [
    "1566576912321-d58ddd7a6088",
    "1596727147705-61a532a659bd",
    "1523961131990-5ea7c61b2107",
  ],
  health: [
    "1505751172876-fa1923c5c528",
    "1532938911079-1b06ac7ceec7",
    "1538108149393-fbbd81895907",
    "1576091160399-112ba8d25d1d",
    "1612349317150-e413f6a5b16d",
    "1631217868264-e5b90bb7e133",
    "1550831107-1553da8c8464",
    "1526256262350-7da7584cf5eb",
  ],
  hospitality: [
    "1542314831-068cd1dbfeeb",
    "1551882547-ff40c63fe5fa",
    "1564501049412-61c2a3083791",
    "1566073771259-6a8506099945",
    "1571896349842-33c89424de2d",
    "1540518614846-7eded433c457",
  ],
  hotel: [
    "1782890790046-2aefb0b503cb",
    "1611892440504-42a792e24d32",
    "1618773928121-c32242e63f39",
    "1629140727571-9b5c6f6267b4",
    "1621293954908-907159247fc8",
  ],
  kids: [
    "1606092195730-5d7b9af1efc5",
    "1760389003439-c69220f03e1b",
    "1776243773206-a29b683c97fb",
    "1655009316723-e4af5fe7afe1",
    "1502086223501-7ea6ecd79368",
  ],
  legal: [
    "1589829545856-d10d557cf95f",
    "1589578527966-fdac0f44566c",
    "1593115057322-e94b77572f20",
    "1505664194779-8beaceb93744",
    "1758519288480-1489c17b1519",
  ],
  logistics: [
    "1586528116311-ad8dd3c8310d",
    "1607082348824-0a96f2a4b9da",
    "1544620347-c4fd4a3d5957",
  ],
  music: [
    "1511379938547-c1f69419868d",
    "1514525253161-7a46d19cd819",
    "1493225457124-a3eb161ffa5f",
    "1533174072545-7a4b6ad7a6c3",
  ],
  nature: [
    "1506744038136-46273834b3fb",
    "1476514525535-07fb3b4ae5f1",
    "1501785888041-af3ef285b470",
    "1519681393784-d120267933ba",
    "1540979388789-6cee28a1cdc9",
  ],
  people: [
    "1494790108377-be9c29b29330",
    "1507003211169-0a1dd7228f2d",
    "1517841905240-472988babdf9",
    "1527980965255-d3b416303d12",
    "1472099645785-5658abf4ff4e",
    "1438761681033-6461ffad8d80",
    "1573496359142-b8d87734a5a2",
    "1573497019940-1c28c88b4f3e",
    "1580489944761-15a19d654956",
    "1552374196-c4e7ffc6e126",
    "1560250097-0b93528c311a",
    "1534528741775-53994a69daeb",
  ],
  pets: ["1548767797-d8c844163c4c", "1583337130417-3346a1be7dee", "1601758228041-f3b2795255f1"],
  pharmacy: [
    "1580281657527-47f249e8f4df",
    "1512069772995-ec65ed45afd6",
    "1471864190281-a93a3070b6de",
    "1628771065518-0d82f1938462",
    "1607619056574-7b8d3ee536b2",
  ],
  photography: [
    "1495745966610-2a67f2297e5e",
    "1542038784456-1ea8e935640e",
    "1497316730643-415fac54a2af",
    "1513031300226-c8fb12de9ade",
    "1493863641943-9b68992a8d07",
  ],
  realestate: [
    "1512917774080-9991f1c4c750",
    "1600585154340-be6161a56a0c",
    "1580587771525-78b9dba3b914",
    "1564013799919-ab600027ffc6",
    "1570129477492-45c003edd2be",
    "1545324418-cc1a3fa10c00",
    "1560518883-ce09059eeffa",
    "1540518614846-7eded433c457",
  ],
  restaurant: [
    "1517248135467-4c7edcad34c4",
    "1555396273-367ea4eb4db5",
    "1521737604893-d14cc237f11d",
    "1414235077428-338989a2e8c0",
  ],
  retail: [
    "1441986300917-64674bd600d8",
    "1472851294608-062f824d29cc",
    "1483985988355-763728e1935b",
    "1534452203293-494d7ddbf7e0",
    "1567401893414-76b7b1e5a7a5",
    "1556742049-0cfed4f6a45d",
    "1601924994987-69e26d50dc26",
  ],
  salon: [
    "1580618672591-eb180b1a973f",
    "1634449571010-02389ed0f9b0",
    "1781450090585-1a511b7066d9",
    "1605497788044-5a32c7078486",
    "1761839256791-6a93f89fb8b0",
  ],
  science: [
    "1532094349884-543bc11b234d",
    "1576671081837-49000212a370",
    "1559757148-5c350d0d3c56",
    "1559757175-0eb30cd8c063",
  ],
  spa: [
    "1600334089648-b0d9d3028eb2",
    "1696841212541-449ca29397cc",
    "1544161515-4ab6ce6db874",
    "1772616748530-7cd73053f326",
    "1620733723572-11c53f73a416",
  ],
  sports: [
    "1431324155629-1a6deb1dec8d",
    "1517649763962-0c623066013b",
    "1552318965-6e6be7484ada",
    "1485965120184-e220f721d03e",
    "1551698618-1dfe5d97d256",
  ],
  team: [
    "1522071820081-009f0129c71c",
    "1522202176988-66273c2fd55f",
    "1542744173-8e7e53415bb0",
    "1551836022-d5d88e9218df",
    "1600880292203-757bb62b4baf",
    "1600267175161-cfaa711b4a81",
  ],
  tech: [
    "1498050108023-c5249f4df085",
    "1523961131990-5ea7c61b2107",
    "1460925895917-afdab827c52f",
    "1551288049-bebda4e38f71",
    "1497366754035-f200968a6e72",
  ],
  travel: [
    "1507525428034-b723cf961d3e",
    "1533105079780-92b9be482077",
    "1501785888041-af3ef285b470",
    "1476514525535-07fb3b4ae5f1",
    "1469854523086-cc02fe5d8800",
    "1488085061387-422e29b40080",
    "1530521954074-e64f6810b32d",
    "1582719508461-905c673771fd",
    "1445019980597-93fa8acb246c",
    "1488646953014-85cb44e25828",
  ],
  wedding: [
    "1520854221256-17451cc331bf",
    "1606800052052-a08af7148866",
    "1583939003579-730e3918a45a",
    "1606216794079-73f85bbd57d5",
    "1775126964424-913480443772",
  ],
  workspace: [
    "1497215728101-856f4ea42174",
    "1497366754035-f200968a6e72",
    "1552581234-26160f608093",
    "1552664730-d307ca884978",
    "1434030216411-0b793f4b4173",
    "1452421822248-d4c2b47f0c81",
  ],
  yoga: [
    "1552196527-bffef41ef674",
    "1758274535230-3641d0632878",
    "1544367567-0f2fcb009e0b",
    "1506126613408-eca07ce68773",
    "1599901860904-17e6ed7083a0",
  ],
};

/** Every topic name, for a picker or for documentation. */
export const IMAGE_TOPICS = Object.keys(TOPIC_PHOTOS).sort() as ImageTopic[];

/**
 * What a caller has to identify a record by.
 *
 * Nullable on purpose: a seed is normally a field off a record — an id, a
 * slug, a title — and those are routinely `string | null` once they come from
 * an API type. Requiring `string` made nullable seeds a compile error and
 * left callers casting or guarding at every call site.
 */
export type Seed = string | number | null | undefined;

export interface PhotoOptions {
  /** Which subject to draw from. Omit for an abstract placeholder. */
  topic?: Loose<ImageTopic>;
  width?: number;
  height?: number;
  /** Stable ordinal in the original collection, never the filtered/sorted row index. */
  index?: number;
}

/** FNV-1a, so a seed maps to the same index in every browser and every render. */
function hash(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function keyOf(seed: Seed): string {
  return seed === null || seed === undefined || seed === "" ? "placeholder" : String(seed);
}

/** The CDN does the resize and the crop, so one id serves every frame size. */
function unsplash(id: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&h=${height}&q=70`;
}

/** Local, deliberately abstract artwork: never substitute an unrelated photograph. */
function placeholder(seed: Seed, width: number, height: number): string {
  const offset = 20 + hash(keyOf(seed)) % 60;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 100 100" preserveAspectRatio="none"><rect width="100" height="100" fill="#e6e9ed"/><circle cx="${offset}" cy="35" r="35" fill="#d5dbe2"/><path d="M0 100L${offset} 45L100 100" fill="#bcc6d1"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function dimension(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.max(1, Math.min(4096, Math.round(value))) : fallback;
}

/**
 * A stable, keyed photograph — of the right subject when you name one.
 *
 * Three call shapes all compile, because all three are reasonable to write:
 *
 * ```ts
 * photo("showroom", { topic: "automotive" }) // decorative, not an inventory photo
 * photo("showroom", 800, 600, "automotive")  // decorative, sized explicitly
 * photo("overview", 800, 450)               // abstract placeholder
 * ```
 *
 * Name a topic wherever you know one. Without it there is nothing to go on
 * and the result is an abstract placeholder, which is the thing that makes a
 * generated application look generic — so the no-topic form is the exception,
 * not the default.
 *
 * An unrecognised topic falls back to the placeholder rather than failing, in
 * keeping with every other vocabulary in this design system.
 */
export function photo(
  seed: Seed,
  width: number | PhotoOptions = 800,
  height = 600,
  topic?: Loose<ImageTopic>,
): string {
  const opts = typeof width === "object" && width !== null ? width : {};
  const w = dimension(typeof width === "number" ? width : (opts.width ?? 800), 800);
  const h = dimension(typeof width === "number" ? height : (opts.height ?? 600), 600);
  const subject = opts.topic ?? topic;

  const ids = subject && Object.hasOwn(TOPIC_PHOTOS, subject)
    ? TOPIC_PHOTOS[subject as ImageTopic] : undefined;
  if (!ids || ids.length === 0) {
    return placeholder(seed, w, h);
  }
  // Consecutive record ids visit the whole pool before repeating. String keys
  // retain their existing mapping; named collections can supply a stable ordinal.
  const numeric = typeof seed === "number" ? seed : /^\d+$/.test(String(seed)) ? Number(seed) : NaN;
  const ordinal = opts.index ?? numeric;
  const index = Number.isSafeInteger(ordinal) ? ((ordinal % ids.length) + ids.length) % ids.length
    : hash(keyOf(seed)) % ids.length;
  return unsplash(ids[index], w, h);
}

/**
 * A wide photograph for the top of a screen — a landing banner, a hero.
 *
 * The topic comes first because at a banner there is always a subject and
 * often no record: `cover("restaurant")` is the whole call. Pass a seed only
 * to pick a different photograph from the same topic for a second banner.
 */
export function cover(topic: Loose<ImageTopic>, seed: Seed = "cover", width = 1600, height = 900) {
  return photo(seed, width, height, topic);
}
