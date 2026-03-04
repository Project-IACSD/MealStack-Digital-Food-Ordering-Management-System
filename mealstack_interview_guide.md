# MealStack — Complete Interview Preparation Guide

> **Based on your actual codebase, not templates.** Every code snippet is from your real files.

---

## 1. Executive Summary

MealStack is a **full-stack digital canteen management system** built for a college campus. Students register, top up a wallet balance, browse the day's menu (admin-curated daily), add items to a Redux-managed cart, and place orders that atomically deduct their balance and update daily inventory. Admins log in separately, manage the master item catalog, set daily menus, confirm/serve orders, and recharge student wallets.

**Stack:** Spring Boot 3 · Spring Security 6 · JPA/Hibernate · MySQL · React 18 · Redux Toolkit · Material UI · Vite

---

## 2. Architecture

### ASCII Diagram — Full Request-Response Flow

```
Browser (React 18)
│
├─ UI Component (JSX)
│    └─ dispatches action / calls service
├─ Redux Store (5 slices: auth, student, order, cart, menu)
├─ Service Layer (authService, studentService …)
│    └─ axios instance (api.js → baseURL: localhost:8080)
│
│  ─────── HTTP + JWT in Authorization header ──────
│
Spring Boot Application
│
├─ JwtAuthFilter (OncePerRequestFilter)
│    └─ extracts email, validates token, populates SecurityContext
├─ SecurityFilterChain (role-based URL routing)
├─ REST Controller (@RestController)
├─ Service (@Service @Transactional)
├─ Repository (JpaRepository)
└─ MySQL Database
```

### Layered Responsibilities

| Layer | File(s) | Responsibility |
|---|---|---|
| **Entity** | `Student`, `Order`, `Cart`, `ItemDaily`, `ItemMaster` | Domain model, ORM mapping |
| **Repository** | `StudentRepository`, `OrderRepository` … | DB queries, Spring Data magic |
| **Service** | `StudentServiceImpl`, `OrderServiceImpl` … | Business logic, transactions |
| **Controller** | `StudentController`, `OrderController` … | HTTP mapping, request/response |
| **DTO** | `StudentDTO`, `OrderDTO`, `PlaceOrderRequest` … | API contract, security boundary |
| **Security** | `JwtAuthFilter`, `JwtUtils`, `SecurityConfig` | Authentication & authorization |
| **Frontend Service** | `authService.js`, `studentService.js` … | API proxy, error handling |
| **Redux** | `authSlice`, `cartSlice`, `orderSlice` … | Client-side state machine |

---

## 3. OOP Concepts — With Your Real Code

### 3.1 Encapsulation

All fields in your entities are `private`. Behaviour is exposed only through controlled methods:

```java
// Student.java — fields are private, access via getters/setters
private int balance;
private String email;

// Helper method encapsulates the bidirectional link logic:
public void addOrder(Order order) {
    orderList.add(order);    // maintain parent side
    order.setStudent(this);  // maintain child side
}
```

**Interview answer:** "Encapsulation ensures business rules live in one place. For example, `addOrder()` on `Student` keeps the bidirectional relationship consistent — if I just did `orderList.add(order)` from outside without setting the back-reference, JPA would lose the foreign key."

### 3.2 Abstraction

Three levels:

1. **Interface abstraction** — `OrderService` interface hides implementation from controllers. The controller only sees the interface contract.
2. **JPA abstraction** — `StudentRepository extends JpaRepository<Student, Long>` hides all SQL. `findByEmail(String email)` generates the query automatically.
3. **REST abstraction** — the frontend doesn't know anything about MySQL; it talks to `/student/login`.

### 3.3 Inheritance

- `JwtAuthFilter extends OncePerRequestFilter` — inherits the Servlet filter lifecycle. You override `doFilterInternal` to add JWT logic.
- `StudentService`, `OrderService` interfaces are implemented by `*Impl` classes — this is **interface-based programming**, a Java best practice.
- No entity inheritance (TPH/TPS/TPC) was used — a deliberate choice to keep the schema simple.

### 3.4 Polymorphism

- `StudentRepository.findByEmail()` — at runtime, Spring Data JPA generates a **proxy class** that implements your interface. You never write SQL; the proxy does.
- Spring's `PasswordEncoder` is an interface; `BCryptPasswordEncoder` is the concrete implementation injected everywhere. Changing the algorithm = change one line in `SecurityConfig`.
- `@Service`, `@Repository` etc. are Spring's mechanism for runtime polymorphism via the IoC container.

### 3.5 Composition

Your entities are built by composition:

```
Student HAS-A User        (OneToOne — auth credential)
Student HAS-MANY Order    (OneToMany)
Order   HAS-MANY Cart     (OneToMany — one cart row per item in the order)
Cart    HAS-A  ItemMaster (ManyToOne — the actual menu item)
ItemDaily HAS-A ItemMaster (ManyToOne — a day's allocation of that item)
```

### 3.6 Dependency Injection

`StudentServiceImpl` uses **constructor injection** (best practice):

```java
public StudentServiceImpl(
    StudentRepository studentRepository,
    ModelMapper modelMapper,
    PasswordEncoder passwordEncoder,
    JwtUtils jwtUtils, ...) {
    this.studentRepository = studentRepository;
    ...
}
```

`OrderServiceImpl` uses field injection (`@Autowired`). Both work, but constructor injection is preferred in production because it makes dependencies explicit and enables easy unit testing without a Spring context.

---

## 4. Design Patterns

| Pattern | Where in MealStack | Example |
|---|---|---|
| **MVC** | Entire backend | Controller → Service → Entity; React as View |
| **Repository** | All `*Repository` interfaces | `StudentRepository.findByEmail()` |
| **DTO** | All service ↔ controller boundaries | `StudentDTO`, `PlaceOrderRequest` |
| **Singleton** | Spring beans, Redux store | One `OrderServiceImpl` instance per JVM |
| **Builder** | `Student` entity (Lombok `@Builder`) | `Student.builder().name("x").build()` |
| **Template Method** | `OncePerRequestFilter` | `doFilterInternal` is the "template slot" you fill |
| **Observer** | Redux + React | Cart state change → `DailyMenu` re-renders |
| **Strategy** | `PasswordEncoder` interface | Swap BCrypt for Argon2 without changing service code |
| **Factory** | Spring IoC container | `@Bean PasswordEncoder` — Spring decides when/how to create |
| **Service Layer** | `*ServiceImpl` classes | Centralised transaction boundary |

---

## 5. Line-by-Line Code Analysis

### 5.1 Student Entity

```java
@Entity                          // (1) Tells JPA this class maps to a DB table
@Table(name = "students")        // (2) Explicit table name (avoids auto-naming)
@Getter @Setter                  // (3) Lombok: generates all getters/setters at compile time
@NoArgsConstructor               // (4) JPA REQUIRES a no-args constructor to instantiate objects
@AllArgsConstructor              // (5) Convenience for tests
@Builder                         // (6) Builder pattern — Student.builder().name("x").build()
public class Student {

    @Id                          // (7) Primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // (8) MySQL AUTO_INCREMENT
    private Long studentId;      // Long (not long) allows null → not-yet-persisted indicator

    @Column(nullable = false, unique = true, length = 60)
    private String email;        // (9) DB constraint enforced at schema level

    @Column(nullable = false, length = 100)
    private String password;     // (10) Stores BCrypt hash, NOT plain text. Length 100 because BCrypt output is 60 chars but headroom is good practice

    private int balance;         // (11) int (primitive) = wallet in rupees, no nulls possible

    private LocalDate dob;       // (12) LocalDate = date only (no time/timezone). java.util.Date is deprecated and timezone-buggy

    @Enumerated(EnumType.STRING) // (13) Stores "DAC" not "0" in DB.
    private Course courseName;   //      EnumType.ORDINAL is fragile — reordering enum breaks data

    @OneToMany(
        mappedBy = "student",    // (14) "student" = field name in Order entity that owns the FK
        cascade = CascadeType.ALL, // (15) Deleting student cascades to orders
        orphanRemoval = true,    // (16) Removing from list also DELETEs the row
        fetch = FetchType.LAZY   // (17) Orders are NOT loaded until you call .getOrderList()
    )
    @Builder.Default
    private List<Order> orderList = new ArrayList<>(); // (18) @Builder.Default prevents NPE when using builder

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id") // (19) FK column in students table pointing to users.id
    private User user;            // (20) Separation of auth credentials into User entity
```

**Key Interview Points:**
- **Why two entities (Student + User)?** Separation of concerns. `User` holds login credentials; `Student` holds profile data. Spring Security's `UserDetailsService` only needs `User`.
- **Why `int` for balance, not `Double`?** Money should never be `float`/`double` due to floating-point imprecision. `int` stores paise or the smallest currency unit. Using `BigDecimal` would be even better.

### 5.2 OrderServiceImpl.placeOrder()

```java
@Service        // (1) Marks as Spring bean; enables component scanning
@Transactional  // (2) Class-level: ALL public methods are transactional by default
public class OrderServiceImpl implements OrderService {

    @Autowired  // (3) Field injection — Spring injects the bean at startup
    private OrderRepository orderRepository;

    public CreateOrderDTO placeOrder(Long studentId, PlaceOrderRequest request) {

        // (4) Optional pattern — avoids null checks
        Student student = studRepo.findById(studentId)
            .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        // ^ throws 404-mapped exception, not NullPointerException

        Order order = new Order();
        order.setStudent(student);
        order.setTime(LocalDateTime.now());           // (5) Timestamp at server side, not client
        order.setTransactionId("TXN-WALLET-" + UUID.randomUUID()); // (6) Globally unique ID
        order.setPaymentMethod("WALLET");
        order.setAmount(request.calculateTotalAmount()); // (7) Business logic in DTO method
        order.setOrderStatus(OrderStatus.PENDING);    // (8) Starts as PENDING, becomes SERVED

        for (CartItem cartItem : request.getItems()) {

            ItemMaster itemMaster = itemMasterRepo.findById(cartItem.getItemId())
                .orElseThrow(...);

            // (9) Find today's daily menu entry for this specific item
            ItemDaily dailyItem = itemDailyRepo.findByItemAndDate(itemMaster, today)
                .orElseThrow(...);

            int availableQty = dailyItem.getAvailableQty(); // initialQty - soldQty
            if (availableQty < cartItem.getQtyOrdered()) {
                throw new IllegalStateException("Insufficient daily stock"); // (10) Atomic — no partial saves
            }

            // (11) Increment sold_qty — NOT a separate table write later
            dailyItem.setSoldQty(dailyItem.getSoldQty() + orderedQty);
            itemDailyRepo.save(dailyItem); // (12) Immediate save inside transaction

            // (13) Cart entity links Order to ItemMaster + quantity + price
            Cart cartEntity = ...;
            cartEntity.setItem(itemMaster);
            order.getCartList().add(cartEntity);
        }

        orderRepository.save(order); // (14) CascadeType.ALL on cartList saves Cart rows too
        return mapper.map(order, CreateOrderDTO.class);
    }
```

**Key Interview Points:**
- **"Where is the wallet deduction?"** — Notice it's NOT in this service! Balance deduction happens separately, likely in the frontend cart checkout or a recharge service. This is a design trade-off to be aware of.
- **"What if item save succeeds but order save fails?"** — Because `@Transactional` wraps the entire method, if `orderRepository.save()` throws, the whole transaction rolls back, including the `itemDailyRepo.save()` calls. This is **ACID atomicity**.
- **"What about concurrent orders?"** — Without `SERIALIZABLE` isolation or pessimistic locking, two simultaneous requests could both read `availableQty = 1` and both pass the stock check. This is the **Lost Update** problem. The current code doesn't have explicit locking — this is a real limitation to acknowledge.

### 5.3 SecurityConfig

```java
@Configuration  // (1) Tells Spring: "this class provides @Bean definitions"
// Note: no @EnableWebSecurity — Spring Boot auto-configures it when Spring Security is on classpath

SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())   // (2) CSRF attacks require cookies+session. We use stateless JWT, so CSRF is irrelevant
        .sessionManagement(sm ->
            sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // (3) No HttpSession created/used
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/student/login", "/student/register", "/admin/login")
            .permitAll()            // (4) These endpoints don't need JWT

            .requestMatchers("/student/**")
            .hasAnyRole("STUDENT", "ADMIN")  // (5) Admin can also call student APIs

            .requestMatchers(HttpMethod.GET, "/dailyitems/**")
            .hasAnyRole("ADMIN", "STUDENT")  // (6) Students can VIEW menu (GET only)

            .requestMatchers("/admin/**", "/items/**", "/dailyitems/**")
            .hasRole("ADMIN")       // (7) POST/PUT/DELETE on daily items = ADMIN only

            .anyRequest().authenticated()  // (8) Everything else needs any valid JWT
        )
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    // (9) Our JWT filter runs BEFORE Spring's default username/password filter
```

**Key Interview Points:**
- **Why `addFilterBefore`?** Spring Security processes filters in order. If the default filter ran first, it would reject requests before JWT is extracted. By running our filter first, we populate the `SecurityContext` and the rest of the chain works.
- **Why `STATELESS`?** JWT is self-contained — the server doesn't need a session. This enables horizontal scaling (any server can handle any request).

### 5.4 JwtAuthFilter

```java
@Component                          // (1) Spring bean
@RequiredArgsConstructor            // (2) Lombok: constructor injection for final fields
public class JwtAuthFilter extends OncePerRequestFilter { // (3) Runs exactly once per HTTP request (not per filter registration)

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) {

        String header = request.getHeader("Authorization"); // (4) Check Authorization header

        if (header != null && header.startsWith("Bearer ")) { // (5) Standard OAuth2 bearer format
            String token = header.substring(7); // (6) Remove "Bearer " prefix (7 chars)
            String email = jwtUtils.extractUsername(token); // (7) Decode JWT, get Subject (email)

            // (8) Only authenticate if: token has email AND no existing auth
            //     (prevents double-authentication on same request)
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                // (9) Loads from DB — verifies user still exists, gets authorities

                if (jwtUtils.validateToken(token)) { // (10) Check expiry + signature
                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()); // (11) null = no credentials needed (already validated)
                    SecurityContextHolder.getContext().setAuthentication(auth); // (12) Now Spring Security knows who this user is
                }
            }
        }

        filterChain.doFilter(request, response); // (13) ALWAYS call this — passes request to next filter/controller
    }
}
```

**Key Interview Points:**
- **What is `SecurityContextHolder`?** A thread-local container. When you call `setAuthentication(auth)`, Spring Security stores the identity for the duration of that HTTP request. All `@PreAuthorize`, `hasRole()` checks read from here.
- **What if token is invalid?** The `if (jwtUtils.validateToken(token))` block is skipped. `filterChain.doFilter` still runs, but SecurityContext has no auth. The controller will return `403 Forbidden`.
- **What is `OncePerRequestFilter`?** In Servlet containers, filters can theoretically be called multiple times (e.g., during forwarding). This base class guarantees your logic runs exactly once.

### 5.5 JwtUtils

```java
public String generateToken(String email, String role) {
    return Jwts.builder()
        .setSubject(email)           // (1) JWT "sub" claim = who this token is for
        .claim("role", role)         // (2) Custom claim: "ROLE_STUDENT" or "ROLE_ADMIN"
        .setIssuedAt(new Date())     // (3) "iat" — when issued
        .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // (4) "exp" — when it expires
        .signWith(getSigningKey())   // (5) HMAC-SHA256 signature using secret key
        .compact();                  // (6) Serializes to: header.payload.signature (Base64URL)
}

public boolean validateToken(String token) {
    try {
        getClaims(token); // (7) If this doesn't throw, signature is valid + not expired
        return true;
    } catch (Exception e) {
        return false;     // (8) Expired, tampered, or malformed → false
    }
}
```

**JWT Structure (your token looks like this):**
```
eyJhbGciOiJIUzI1NiJ9      ← Header (alg: HS256)
.
eyJzdWIiOiJ2YWliaEB0ZXN0LmNvbSIsInJvbGUiOiJST0xFX1NUVU..." ← Payload (email, role, exp)
.
xK2mN9pQ...               ← Signature (HMAC-SHA256 of header+payload with secret)
```

### 5.6 authSlice.jsx (Redux)

```javascript
const initialState = {
    user: null,
    studentId: localStorage.getItem('studentId') || null, // (1) Persist across refresh
    email: localStorage.getItem('studentEmail') || null,
    isAuthenticated: !!localStorage.getItem('studentId'), // (2) !! converts string to boolean
    isAdmin: localStorage.getItem('isAdmin') === 'true',  // (3) String comparison!
};
// Note: token is NOT stored in Redux. Token is stored in localStorage separately
// and attached to requests by an axios interceptor or manually in service calls.

const authSlice = createSlice({
    name: 'auth',
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;              // (4) Direct mutation — Immer makes this safe!
            state.studentId = action.payload.studentId;
            localStorage.setItem('studentId', action.payload.studentId); // (5) Side effect in reducer
        },
        logout: (state) => {
            state.studentId = null;
            state.isAuthenticated = false;
            localStorage.removeItem('studentId');      // (6) Clean up localStorage too
        },
    },
});
```

**Key Interview Points:**
- **"Isn't Redux state immutable? How can you do `state.isAuthenticated = true`?"** Redux Toolkit uses **Immer** under the hood. Immer creates a Proxy over the state. Your "mutations" are tracked and converted into an immutable update. You're not actually mutating the state — Immer produces a new state object.
- **"Why `!!`?"** `localStorage.getItem('studentId')` returns a string `"123"` or `null`. `!!"123"` = `true`. `!!null` = `false`. It coerces any truthy value to boolean.
- **"Your token isn't in Redux — where is it?"** In `localStorage` under a separate key. Your `authService.js` reads it from localStorage when constructing requests.

### 5.7 authService.js (Frontend)

```javascript
class AuthService {               // (1) Class-based service — JavaScript class (ES6)
  async studentLogin(userName, password) {
    try {
      const response = await api.post('/student/login', { // (2) await = pause here until response
        userName,                 // (3) ES6 shorthand for { userName: userName }
        password
      });
      return response.data;       // (4) axios wraps response; .data is the actual JSON body
    } catch (error) {
      throw error.response?.data || error.message; // (5) Optional chaining (?.) — safe access
      // ^ re-throws to the caller (LoginPage) which shows the error message
    }
  }
}
export default new AuthService(); // (6) Singleton — one instance shared across entire app
```

### 5.8 cartSlice.jsx

```javascript
addToCart: (state, action) => {
    const existingItem = state.items.find(   // (1) Check if item already in cart
        (item) => item.itemId === action.payload.itemId
    );
    if (existingItem) {
        existingItem.quantity += 1;              // (2) Immer allows this mutation
        existingItem.netPrice = existingItem.quantity * existingItem.itemPrice;
    } else {
        state.items.push({ ...action.payload, quantity: 1 }); // (3) Spread to copy fields
    }
    // (4) Recalculate totals after every change — derived state
    state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
    state.totalAmount = state.items.reduce((sum, item) => sum + item.netPrice, 0);
},
```

---

## 6. Database Schema & Relationships

```
┌─────────────────┐         ┌────────────────┐
│     users       │         │   item_master   │
│ id (PK)         │         │ item_id (PK)    │
│ email (UNIQUE)  │         │ item_name       │
│ password        │         │ item_price      │
│ role            │         │ item_category   │
└────────┬────────┘         │ item_genre      │
         │ 1                │ item_image      │
         │                  │ total_qty       │
┌────────▼────────┐    ┌────┴────────────────┘
│    students     │    │
│ student_id (PK) │    │    ┌─────────────────┐
│ user_id (FK)────┘    │    │   item_daily     │
│ name            │    │    │ daily_id (PK)    │
│ email           │    └───►│ item_id (FK)────►item_master
│ password        │         │ item_date        │
│ balance (int)   │         │ init_qty         │
│ dob             │         │ sold_qty         │
│ course_name     │         └─────────────────┘
└────────┬────────┘
         │ 1:N              ┌─────────────────┐
         │                  │     orders       │
┌────────▼────────┐    ┌───►│ order_id (PK)    │
│ recharge_history│    │    │ student_id (FK)─►students
│ id (PK)         │    │    │ time             │
│ student_id (FK) │    │    │ amount           │
│ amount          │    │    │ payment_method   │
│ date/time       │    │    │ transaction_id   │
└─────────────────┘    │    │ order_status     │
                       │    │ is_served        │
                       │    └────────┬─────────┘
         student ──────┘             │ 1:N
                                     │
                              ┌──────▼──────────┐
                              │      carts       │
                              │ cart_id (PK)     │
                              │ order_id (FK)───►orders
                              │ item_id (FK)────►item_master
                              │ qty_ordered      │
                              │ net_price        │
                              └──────────────────┘
```

### Relationship Explanations

**Student ↔ Order (OneToMany):**
- One student can place many orders
- `mappedBy = "student"` → the FK (`student_id`) lives in the `orders` table
- `cascade = ALL` → deleting a student deletes all their orders
- `LAZY` fetch → orders are NOT loaded when you fetch a student (avoids N+1)

**Order ↔ Cart (OneToMany):**
- Each order has multiple line items (one per distinct menu item)
- `Cart` stores: quantity, net price, link to the `ItemMaster`
- This is the "order line item" pattern

**ItemDaily ↔ ItemMaster (ManyToOne):**
- `ItemMaster` = the permanent catalog (name, price, image)
- `ItemDaily` = today's allocation (`init_qty`, `sold_qty`)
- This separation lets admins set different quantities each day without duplicating item data
- `sold_qty` is incremented at order placement; `getAvailableQty() = init_qty - sold_qty`

---

## 7. Critical Workflows

### 7.1 Student Registration

```
1. React form → authService.registerStudent(data)
2. POST /student/register (no token needed — permitAll)
3. StudentController.register() → studentService.registerStudent(dto)
4. Check: studentRepository.findByEmail() → if exists, throw error
5. Encode password: passwordEncoder.encode(dto.getPassword()) [BCrypt]
6. Create Student entity + User entity (same encoded password)
7. student.setUser(user)  → link them
8. studentRepository.save(student) → cascade saves User too
9. Return "Student registered successfully"
10. Frontend shows success → redirect to login
```

### 7.2 Login & JWT

```
1. React → authService.studentLogin(email, password)
2. POST /student/login (permitAll)
3. StudentServiceImpl.login():
   a. Find student by email (orElseThrow → 404)
   b. passwordEncoder.matches(rawPassword, storedHash) → BCrypt comparison
   c. If mismatch → throw RuntimeException → 500 (should be 401)
   d. jwtUtils.generateToken(email, role) → "ROLE_STUDENT"
4. JWT returned to frontend
5. Frontend: localStorage.setItem('token', jwt)
6. Redux: dispatch(loginSuccess({ studentId, email, isAdmin: false }))
7. navigate('/dashboard')
8. All subsequent requests: Authorization: Bearer <token>
```

### 7.3 Place Order (The Critical Flow)

```
1. Student clicks "Place Order" in cart
2. Redux cartSlice has: items[], totalAmount
3. Frontend builds PlaceOrderRequest: { items: [{itemId, qtyOrdered, netPrice}] }
4. POST /orders/place/{studentId} with Bearer token
5. JwtAuthFilter validates token → populates SecurityContext
6. SecurityConfig: /student/** → hasAnyRole(STUDENT, ADMIN) ✓
7. OrderServiceImpl.placeOrder():
   a. Find student ✓
   b. For each cart item:
      - Find ItemMaster by itemId
      - Find ItemDaily for today's date
      - Check availableQty (init_qty - sold_qty) >= requested
      - Increment sold_qty → save ItemDaily
      - Create Cart entity with price snapshot
   c. Create Order (PENDING, timestamp, UUID transaction ID)
   d. orderRepository.save(order) → cascade saves all Cart rows
8. Response: CreateOrderDTO
9. Frontend: dispatch(clearCart()), navigate to order history
```

> [!IMPORTANT]
> **The balance deduction is NOT done in `OrderServiceImpl`**. Balance is managed separately. In your current architecture, ensure balance is deducted in a coordinated way, or interviewers may ask about this gap.

---

## 8. Advanced Concepts

### 8.1 ACID & Transactions

| Property | What it means | In MealStack |
|---|---|---|
| **Atomicity** | All or nothing | If order save fails, sold_qty rollbacks |
| **Consistency** | DB goes from valid to valid state | Constraints (unique email, not-null) always hold |
| **Isolation** | Concurrent transactions don't interfere | Default: READ_COMMITTED in MySQL |
| **Durability** | Committed data survives crash | MySQL InnoDB guarantees this |

`@Transactional` wraps your method in a DB transaction. If an exception propagates, Spring calls `connection.rollback()`. If the method completes normally, Spring calls `connection.commit()`.

**Dirty read / Lost update risk:** Two students order the last item simultaneously:
```
T1: reads sold_qty = 9, init_qty = 10 → availableQty = 1 ✓
T2: reads sold_qty = 9, init_qty = 10 → availableQty = 1 ✓
T1: sets sold_qty = 10, saves
T2: sets sold_qty = 10, saves ← OVERSELL! Should be 11
```
**Fix:** Add `@Lock(LockModeType.PESSIMISTIC_WRITE)` on the `findByItemAndDate` query, or use `@Version` for optimistic locking.

### 8.2 JWT Security Deep Dive

```
Header:    {"alg":"HS256","typ":"JWT"}           → Base64URL encoded
Payload:   {"sub":"student@test.com",            → Base64URL encoded
            "role":"ROLE_STUDENT",
            "iat":1708xxx, "exp":1708xxx}
Signature: HMAC-SHA256(encoded_header + "." + encoded_payload, secret_key)
```

**Why can't clients fake JWT?** They don't have the `jwt.secret` (stored in `application.properties`/env var). Without the secret, they can't produce a valid HMAC-SHA256 signature. The server rejects invalid signatures.

**BCrypt explained:**
- BCrypt is a **password hashing function**, not encryption
- It embeds a random **salt** in the hash (no rainbow table attacks)
- It's deliberately **slow** (configurable work factor) — this is a feature
- `passwordEncoder.matches(rawPwd, hash)` rehashes rawPwd with the salt embedded in hash and compares

### 8.3 React Performance Concepts

| Concept | Explanation |
|---|---|
| Virtual DOM | React keeps a JS copy of the DOM. On state change, it diffs virtual → real DOM and only patches what changed. |
| Component re-render | Triggered when: state changes (useState), parent re-renders, or context changes |
| Redux + useSelector | Component only re-renders if the selected slice of state changes (structural equality check) |
| Immer in Redux Toolkit | Allows "mutation-style" code in reducers; produces immutable updates efficiently |

---

## 9. 20 Interview Questions & Answers

**Q1: What happens if two students order the last item at the exact same millisecond?**

A: With the current code (no explicit locking), it's a **race condition** (Lost Update). Both threads read `availableQty = 1`, both pass the check, and both decrement — resulting in overselling. The fix is pessimistic locking: `@Lock(LockModeType.PESSIMISTIC_WRITE)` on the ItemDaily fetch query, or optimistic locking with `@Version`.

---

**Q2: Why did you choose Redux over Context API?**

A: MealStack has complex, cross-cutting state: authentication (used in every page), cart (used in menu, header, checkout), and order status (updated by admin, read by student). Redux offers: Redux DevTools for debugging, predictable state updates via reducers, middleware support (for async thunks), and performance (only components using a specific selector re-render). Context API re-renders all consumers on any change — fine for simple, infrequently-changing data like theme, not for a dynamic cart.

---

**Q3: Explain the complete JWT validation flow.**

A: Every non-public request goes through `JwtAuthFilter`. It reads the `Authorization: Bearer <token>` header, extracts email via `jwtUtils.extractUsername()`, loads `UserDetails` from DB, validates the token signature + expiry via `jwtUtils.validateToken()`, then creates a `UsernamePasswordAuthenticationToken` and puts it in `SecurityContextHolder`. Spring Security's authorization rules then check if the authenticated user's roles match the URL rules in `SecurityConfig`.

---

**Q4: What if order placement fails after deducting stock?**

A: Because `@Transactional` wraps the entire `placeOrder()` method, if `orderRepository.save()` throws an exception, Spring calls rollback. This undoes the `itemDailyRepo.save()` calls made earlier in the same transaction. This is **atomicity** — either everything succeeds or everything rolls back. No partial state.

---

**Q5: How do you prevent SQL injection?**

A: Spring Data JPA uses **parameterized queries** (prepared statements) everywhere. `findByEmail(String email)` generates `SELECT ... WHERE email = ?` with the value bound separately, never concatenated into the SQL string. JPA/Hibernate never builds raw SQL with user input.

---

**Q6: What's the difference between @Autowired and constructor injection?**

A: `@Autowired` on a field — Spring uses reflection to inject. Field is not `final`. Hard to test without Spring context. Constructor injection (used in `StudentServiceImpl`) — dependencies are `final`, injected at instantiation, testable with plain `new StudentServiceImpl(mock, mock, ...)`, and fails fast at startup if a dependency is missing.

---

**Q7: Why DTO instead of sending entities directly?**

A: Three reasons:
1. **Security** — Entity has `password` field. Returning it to UI is a critical vulnerability.
2. **Coupling** — Changing DB schema would break the API contract.
3. **Shape** — API response may need fields from multiple entities (e.g., `OrderDTO` includes `studentName` from the `Student` entity).

---

**Q8: How does Spring know which bean to inject when there are multiple implementations?**

A: Spring matches by **type**. If there's one `StudentService` bean, it injects it. If there are multiple, Spring uses `@Qualifier("beanName")` or `@Primary`. In your project, there's only one implementation per interface, so no ambiguity.

---

**Q9: What if the JWT token is stolen?**

A: JWTs are stateless — you can't invalidate them server-side without a blocklist. Mitigations: (1) Short expiry time (15-60 min) + refresh tokens, (2) HTTPS to prevent token interception, (3) `HttpOnly` cookies instead of `localStorage` (prevents XSS), (4) Token blocklist for logout (Redis-based), (5) Check `iat` claim — reject tokens issued before last password change.

---

**Q10: Explain lazy loading and its impact on your Order entity.**

A: `@OneToMany(fetch = FetchType.LAZY)` means JPA does NOT load `orderList` when you load a `Student`. If you then call `student.getOrderList()` outside a transaction (e.g., in a DTO converter after the session closes), you get a `LazyInitializationException`. Your fix: load orders within the transaction (e.g., in service layer), or use `JOIN FETCH` JPQL, or `@EntityGraph`.

---

**Q11: What is `mappedBy` in your `@OneToMany`?**

A: `mappedBy = "student"` tells JPA that `Order` owns the relationship (Order has the `@ManyToOne` and the `student_id` FK column). Without this, JPA would create a redundant join table. The value `"student"` must match the exact field name in the `Order` entity.

---

**Q12: Why `LocalDateTime` for order time and `LocalDate` for date of birth?**

A: `LocalDate` = date only (no time). Perfect for DOB — you don't need the time of birth. `LocalDateTime` = date + time. For orders, exact time matters. Both are from `java.time` (Java 8+), which is timezone-neutral and replaces the buggy `java.util.Date`.

---

**Q13: What does `orphanRemoval = true` do in your Student entity?**

A: Without it, `cascade = ALL` still doesn't delete an order row when you remove it from `student.getOrderList()`. `orphanRemoval = true` adds that behaviour: if a `Cart` or `Order` is removed from the parent's collection, the corresponding row is `DELETE`d from the DB.

---

**Q14: Explain the `ItemDaily` design — why separate from `ItemMaster`?**

A: `ItemMaster` is the permanent catalog (item name, price, image). It never changes day to day. `ItemDaily` is the daily allocation: how many units of that item are available today. This separation allows: different quantities per day, easy daily reset (just add new `ItemDaily` rows for today), historical records of what was offered when, without duplicating item data.

---

**Q15: Why is `AuthService` a class with `export default new AuthService()`?**

A: This implements the **Singleton pattern** in JavaScript. `new AuthService()` creates one instance that is exported. Every `import authService from './authService'` gets the same instance. Benefits: shared state (if any), single point of configuration, consistent error handling.

---

**Q16: What is `SerializableCheck: false` in the Redux store?**

A: Redux Toolkit warns if you put non-serializable values (functions, dates, class instances) in state. Setting `serializableCheck: false` disables that check. In your project this was likely added because some state contains Date objects or other non-primitives.

---

**Q17: How does ModelMapper work in your services?**

A: ModelMapper uses reflection to map fields with matching names between source and target objects. `mapper.map(student, StudentDTO.class)` creates a `StudentDTO` and copies all fields where names match. You don't write the mapping code manually. Caveat: it can silently skip unmatched fields, so you must test mappings.

---

**Q18: What is the `@Builder.Default` annotation on `orderList`?**

A: When using Lombok `@Builder`, fields not set via the builder are set to their Java defaults (null for objects). Without `@Builder.Default`, `Student.builder().name("x").build()` would have `orderList = null` (not `new ArrayList<>()`), causing NPEs when JPA tries to initialize the list. `@Builder.Default` ensures the initializer (`= new ArrayList<>()`) runs even when using the builder.

---

**Q19: Why `@Transactional` at the class level in `OrderServiceImpl`?**

A: As a safety net — every public method is transactional by default, even if you add new methods and forget to annotate them. Individual methods can override with `@Transactional(propagation = ...)` or `@Transactional(readOnly = true)` for read-only queries (which can enable DB optimizations).

---

**Q20: What are the biggest weaknesses in the current architecture?**

A: 
1. **No balance deduction in `placeOrder`** — wallet deduction happens outside the same transaction as stock decrement, risking inconsistency.
2. **No pessimistic/optimistic locking on `ItemDaily`** — concurrent orders can oversell.
3. **Token in `localStorage`** — vulnerable to XSS; `HttpOnly` cookie would be safer.
4. **Balance stored as `int`** — `BigDecimal` is more appropriate for money.
5. **No refresh token mechanism** — when JWT expires, user must re-login.

---

## 10. Quick Reference Cheat Sheet

### Annotations
| Annotation | Purpose |
|---|---|
| `@Entity` | JPA: this class maps to a DB table |
| `@Table(name=)` | Explicit table name |
| `@Id` / `@GeneratedValue` | PK + auto-increment |
| `@Column(nullable=false)` | DB constraint |
| `@OneToMany(mappedBy=)` | Inverse side of relationship |
| `@ManyToOne @JoinColumn` | Owning side, has the FK |
| `@Enumerated(STRING)` | Store enum name, not ordinal |
| `@Service` | Spring service bean |
| `@Transactional` | Wrap in DB transaction |
| `@Autowired` | Field injection |
| `@Bean` | Method produces a Spring bean |
| `@Configuration` | Class defines Spring config |
| `@Component` | Generic Spring bean |

### Redux Flow
```
User Action → dispatch(action) → Reducer → New State → React re-render
```

### JWT Flow
```
Login → Server generates JWT → Client stores in localStorage
Next request → Client sends Bearer <token>
Server: JwtAuthFilter → validates → SecurityContext → Controller executes
```

### Entity Relationships
```
Student (1) ──── (N) Order (1) ──── (N) Cart (N) ──── (1) ItemMaster
Student (1) ──── (1) User
ItemDaily (N) ──── (1) ItemMaster
```

### Request Security Matrix
```
POST /student/register  → No token (public)
POST /student/login     → No token (public)
GET  /dailyitems/**     → STUDENT or ADMIN
GET  /student/**        → STUDENT or ADMIN
POST /admin/**          → ADMIN only
POST /items/**          → ADMIN only
```
