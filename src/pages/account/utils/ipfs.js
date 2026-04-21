/**
 * Deterministic IPFS-formatted identifiers derived from real inputs.
 *
 * Everything here is formatted to match real IPFS output (PeerID, multiaddr,
 * CIDv1) so the UI feels authentic without inventing data. The inputs are
 * always real things from the store — the user's ID, creation content, etc.
 *
 * This means:
 *   - PeerID is stable per user (derived from user.id)
 *   - CIDs are stable per piece of content (derived from content hash)
 *   - Multiaddrs are stable per user
 * No randomness, nothing to "refresh."
 */

// Base58 alphabet used by IPFS for PeerIDs.
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
// Base32 alphabet for CIDv1 (base32 lowercase, IPFS variant).
const BASE32 = "abcdefghijklmnopqrstuvwxyz234567";

/**
 * Simple deterministic hash (FNV-1a 32-bit, extended to 64 bits by two passes).
 * Same input → same output. Not cryptographic — just stable.
 */
const hash32 = (input) => {
  let h = 0x811c9dc5;
  const str = String(input);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

/**
 * Produce a pseudo-random stream of bytes deterministically from a seed.
 * LCG is fine here — we just need stable, even-looking bytes.
 */
const seededBytes = (seed, length) => {
  let state = hash32(seed);
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    out[i] = state & 0xff;
  }
  return out;
};

/**
 * Encode a byte array in a given alphabet. Not proper base58 maths — just
 * maps bytes to alphabet chars. For display identifiers where what matters
 * is stability + the right alphabet/length, not round-trip correctness.
 */
const encodeWithAlphabet = (bytes, alphabet) =>
  Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");

/**
 * Generate an IPFS-format PeerID for a given user.
 * Format: 12D3Koo... (starts with the Ed25519 identifier prefix, 52 chars).
 */
export const makePeerID = (userId) => {
  if (!userId) return "12D3KooUnknown";
  const bytes = seededBytes(`peerid:${userId}`, 46);
  return `12D3Koo${encodeWithAlphabet(bytes, BASE58).slice(0, 45)}`;
};

/**
 * Generate a CIDv1 (base32-encoded, "bafyb..." prefix) for a piece of content.
 * The input is a stable content descriptor — we use the item's ID + a short
 * hash of its text so new content gets a new CID but re-renders stay stable.
 */
export const makeCID = (contentKey) => {
  if (!contentKey) return null;
  const bytes = seededBytes(`cid:${contentKey}`, 56);
  return `bafyb${encodeWithAlphabet(bytes, BASE32).slice(0, 54)}`;
};

/**
 * Build a pair of multiaddrs (IPv4 + IPv6) for the node, deterministic per
 * user. Uses reserved private IP ranges so the strings look plausible
 * without implying a real address.
 */
export const makeMultiaddrs = (userId, peerId) => {
  if (!userId || !peerId) return [];
  const bytes = seededBytes(`addr:${userId}`, 8);

  // Private ranges: 10.x / fd00:: — common for p2p LAN announcements.
  const ipv4 = `10.${bytes[0]}.${bytes[1]}.${bytes[2]}`;
  const ipv6Segment = (i) =>
    ((bytes[i] << 8) | bytes[i + 1]).toString(16).padStart(4, "0");
  const ipv6 = `fd00:${ipv6Segment(2)}:${ipv6Segment(4)}::${ipv6Segment(6)}`;

  return [
    `/ip4/${ipv4}/tcp/4001/p2p/${peerId}`,
    `/ip6/${ipv6}/tcp/4001/p2p/${peerId}`,
  ];
};

/**
 * Short display form for IDs — first N and last N, with ellipsis.
 * Matches how IPFS UIs (Web3.Storage, Pinata, etc.) typically display CIDs.
 */
export const shortenId = (id, head = 8, tail = 6) => {
  if (!id) return "";
  if (id.length <= head + tail + 1) return id;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
};
