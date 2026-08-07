// Shared devtools protocol types for fastrx.
// Consumed by the library (emit side) and the devtools panel (decode side).
/**
 * Bounded serialization of a runtime value for the devtools panel.
 * Returns undefined for null/undefined so the Envelope field can be omitted.
 * Objects attempted via JSON.stringify, fallback to String(); truncated to `max`.
 */
export function summarize(v, max = 256) {
    if (v === undefined || v === null)
        return undefined;
    let s;
    try {
        if (typeof v === 'object')
            s = JSON.stringify(v);
        else
            s = String(v);
    }
    catch {
        try {
            s = String(v);
        }
        catch {
            return 'unserializable';
        }
    }
    if (s.length > max)
        return s.slice(0, Math.max(0, max - 3)) + '...';
    return s;
}
//# sourceMappingURL=protocol.js.map