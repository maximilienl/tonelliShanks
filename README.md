# Tonelli-Shanks Algorithm

## Qu'est-ce que c'est ?

L'algorithme de Tonelli-Shanks permet de calculer la **racine carrée modulaire** d'un nombre.

Concrètement, étant donné un nombre `n` et un nombre premier `p`, il trouve `x` tel que :

```
x² ≡ n (mod p)
```

Autrement dit : "Quel nombre, élevé au carré, donne `n` quand on divise par `p` et qu'on garde le reste ?"

---

## Pourquoi c'est utile ?

### 1. Cryptographie sur courbes elliptiques (ECC)

C'est l'application principale. Les courbes elliptiques utilisées en cryptographie ont une équation de la forme :

```
y² = x³ + ax + b  (mod p)
```

Pour trouver un point sur la courbe à partir d'une coordonnée `x`, il faut calculer `y`. Cela revient à trouver la racine carrée de `x³ + ax + b` modulo `p`.

**Utilisé dans :**
- ECDSA (signatures numériques Bitcoin, Ethereum, TLS)
- ECDH (échange de clés)
- Décompression de clés publiques (format compressé → format complet)

### 2. Cryptographie RSA

Certaines variantes de RSA et des schémas de signature (comme Rabin) nécessitent le calcul de racines carrées modulaires.

### 3. Théorie des nombres

- Tests de primalité
- Factorisation d'entiers
- Résolution d'équations diophantiennes

---

## Comment ça marche ? (Simplifié)

### Étape 1 : Vérifier que la solution existe

Tous les nombres n'ont pas de racine carrée modulaire. On utilise le **critère d'Euler** :

```
Si n^((p-1)/2) ≡ 1 (mod p)  →  Une racine existe
Si n^((p-1)/2) ≡ -1 (mod p) →  Pas de racine
```

### Étape 2 : Cas simple (p ≡ 3 mod 4)

Si `p` est de la forme `4k + 3`, la racine se calcule directement :

```
x = n^((p+1)/4) mod p
```

### Étape 3 : Cas général (algorithme complet)

Pour les autres premiers, l'algorithme :

1. Décompose `p - 1 = 2^s × q` (avec `q` impair)
2. Trouve un "non-résidu quadratique" `z` (un nombre sans racine carrée mod p)
3. Applique une série de transformations itératives pour converger vers la solution

---

## Utilisation

```javascript
const utils = new CryptoUtils();

// Trouver x tel que x² ≡ 10 (mod 13)
const n = 10n;
const p = 13n;

const result = utils.tonelliShanks(n, p);
console.log(result);  // 6n ou 7n (car 6² = 36 ≡ 10 mod 13)

// Vérification
console.log((result * result) % p);  // 10n ✓
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `n` | `bigint` | Le nombre dont on cherche la racine carrée |
| `p` | `bigint` | Un nombre premier impair |

### Retour

| Valeur | Signification |
|--------|---------------|
| `bigint` | Une racine carrée de `n` mod `p` |
| `null` | `n` n'a pas de racine carrée mod `p` |

---

## Exemple concret : Décompression d'une clé publique Bitcoin

Les clés publiques Bitcoin sont des points sur la courbe secp256k1.

```javascript
// Courbe secp256k1 : y² = x³ + 7 (mod p)
const p = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2Fn;

// Clé compressée : on connaît x et le signe de y
const x = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798n;

// Calculer y² = x³ + 7 mod p
const ySquared = (x ** 3n + 7n) % p;

// Trouver y avec Tonelli-Shanks
const y = utils.tonelliShanks(ySquared, p);

// Résultat : le point complet (x, y) sur la courbe
```

---

## Complexité

| Aspect | Valeur |
|--------|--------|
| Temps | O(log²(p)) opérations modulaires |
| Espace | O(1) |

L'algorithme est efficace même pour des nombres premiers très grands (256+ bits).

---

## Limitations

- **`p` doit être premier** : L'algorithme ne fonctionne pas pour les modulos composites (voir l'algorithme de Cipolla ou la factorisation pour ces cas)
- **Une seule racine retournée** : Si `x` est une racine, `-x mod p` l'est aussi. L'algorithme n'en retourne qu'une

---

## Références

- [Wikipedia - Tonelli-Shanks algorithm](https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm)
- Shanks, D. (1973). "Five Number-theoretic Algorithms"
- [Guide to Elliptic Curve Cryptography](https://link.springer.com/book/10.1007/b97644) - Hankerson, Menezes, Vanstone
