# MealStack — 1-Page Interview Cheat Sheet

## What It Is
**Digital canteen system.** Students browse daily menu → add to cart → place order (deducts stock). Admin manages items, sets daily menu, marks orders as served.

## Tech Stack
`Spring Boot 3` · `Spring Security 6 + JWT` · `JPA/Hibernate` · `MySQL` · `React 18` · `Redux Toolkit` · `Material UI` · `Vite`

---

## Entities & Relationships
```
Student ──(1:1)──► User           (auth credentials separated)
Student ──(1:N)──► Order          (student's order history)
Student ──(1:N)──► RechargeHistory
Order   ──(1:N)──► Cart           (one row per item in the order)
Cart    ──(N:1)──► ItemMaster     (item name, price, image)
ItemDaily ──(N:1)► ItemMaster     (daily quota: init_qty, sold_qty)
```

## Security Flow
```
Request → JwtAuthFilter → extractUsername() → loadUserByUsername()
        → validateToken() → SecurityContextHolder.setAuthentication()
        → SecurityConfig URL rules → Controller
```
Public: `/student/login`, `/student/register`, `/admin/login`
Student: `/student/**`, GET `/dailyitems/**`
Admin only: `/admin/**`, `/items/**`, POST/PUT `/dailyitems/**`

---

## Key Annotations (Backend)
| Annotation | Meaning |
|---|---|
| `@Entity` | Class maps to DB table |
| `@GeneratedValue(IDENTITY)` | MySQL AUTO_INCREMENT |
| `@Enumerated(STRING)` | Store enum name not index |
| `@OneToMany(mappedBy=)` | Inverse side, no FK here |
| `@ManyToOne @JoinColumn` | Owns the FK column |
| `@Transactional` | All-or-nothing DB operations |
| `@Service` / `@Component` | Spring bean |
| `@Builder` (Lombok) | Builder pattern |

## JWT Structure
```
Header.Payload.Signature
{"alg":"HS256"} . {"sub":"email","role":"ROLE_STUDENT","exp":...} . HMAC-SHA256
```

## Redux Slices
`auth` (studentId, isAdmin, isAuthenticated) · `cart` (items[], totalAmount) · `order` · `student` · `menu`

---

## 5 Guaranteed Interview Questions
1. **Order flow?** Form → cartSlice → placeOrder API → JWT check → stock check → ItemDaily.soldQty++ → orderRepo.save() → DTO back
2. **Why JWT not sessions?** Stateless, no server memory needed, scales horizontally
3. **Why Student + User?** Separation — User for Spring Security auth, Student for profile
4. **What is @Transactional?** DB transaction — all succeed or all rollback on exception
5. **Design patterns used?** Repository, DTO, Singleton (beans), Builder, Strategy (PasswordEncoder)

## Weak Points (Know These!)
- ❌ `placeOrder()` doesn't deduct wallet balance (stock only)
- ❌ No pessimistic lock on `ItemDaily` → race condition possible
- ⚠️ Token in `localStorage` → XSS risk (fix: HttpOnly cookie)
- ⚠️ Password stored in BOTH `Student` and `User` → can drift
- ⚠️ No refresh token → user logs out on JWT expiry

## One-Liners for Core Concepts
- **BCrypt:** Slow-by-design hashing with embedded salt → no rainbow table attacks
- **Lazy loading:** `orderList` NOT fetched until `.getOrderList()` called; avoids N+1 queries
- **mappedBy:** Tells JPA which side owns the FK — the other side is read-only
- **Immer in Redux:** Lets you write `state.x = y` inside reducers; produces immutable update
- **ModelMapper:** Maps matching field names between Entity ↔ DTO using reflection
