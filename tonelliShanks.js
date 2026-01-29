/**
 * Computes the modular square root of `n` modulo `p` using the Tonelli-Shanks algorithm.
 * 
 * This function finds `r` such that `r^2 ≡ n (mod p)` if such an `r` exists. 
 * It works only when `p` is an odd prime and `n` is a quadratic residue modulo `p`.
 * 
 * @param {bigint} n - The number whose square root modulo `p` is to be found.
 * @param {bigint} p - An odd prime modulus.
 * @returns {bigint|null} The square root `r` such that `r^2 ≡ n (mod p)` if it exists, or `null` if no solution exists.
 * 
 * @throws {Error} If the provided modulus `p` is not an odd prime.
 * 
 * @example
 * // Example usage:
 * const n = 10n;
 * const p = 13n;
 * const result = tonelliShanks(n, p); // result could be 6n or 7n
 */

tonelliShanks(n, p) {
    if (p <= 2n) {
        throw new Error("Modulus p must be an odd prime > 2");
    }
    
    // Normalize n to [0, p)
    n = ((n % p) + p) % p;
    if (n === 0n) return 0n;
    
    // Check if n is a quadratic residue
    if (this.modPow(n, (p - 1n) / 2n, p) !== 1n) {
        return null;
    }
    
    // Factor out powers of 2: p - 1 = q * 2^s
    let q = p - 1n;
    let s = 0n;
    while ((q & 1n) === 0n) {  // Slightly faster than % 2n
        q >>= 1n;
        s += 1n;
    }
    
    // Simple case: p ≡ 3 (mod 4)
    if (s === 1n) {
        return this.modPow(n, (p + 1n) / 4n, p);
    }
    
    // Find quadratic non-residue z
    let z = 2n;
    while (this.modPow(z, (p - 1n) / 2n, p) === 1n) {
        z += 1n;
    }
    
    let c = this.modPow(z, q, p);
    let r = this.modPow(n, (q + 1n) / 2n, p);
    let t = this.modPow(n, q, p);
    let m = s;
    
    while (t !== 1n) {
        // Find least i such that t^(2^i) ≡ 1
        let i = 1n;
        let tt = (t * t) % p;
        while (tt !== 1n) {
            tt = (tt * tt) % p;
            i += 1n;
            if (i === m) return null;  // Shouldn't happen if p is prime
        }
        
        // Update values
        const b = this.modPow(c, 1n << (m - i - 1n), p);  // 2^(m-i-1)
        c = (b * b) % p;
        r = (r * b) % p;
        t = (t * c) % p;
        m = i;
    }
    
    return r;
}
