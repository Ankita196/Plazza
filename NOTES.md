# Plazza Frontend Take-Home — Notes & Technical Decisions

## 1. Assumptions Made
1. **Target Platform**: Exclusively Android 13+ (API 33). Foreground location (`ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`) and notification (`POST_NOTIFICATIONS`) permissions are requested on first launch and handled across `granted`, `denied`, and `blocked` states.
2. **Location Presentation**: As per spec, location is only used to display generic `"Delivering to: <lat,lng>"` coordinates on the Home screen header. Bangalore coordinates (`12.9716, 77.5946`) are used when location permission is granted without requiring external geocoding network calls.
3. **Local Catalog**: Loaded strictly from `src/data/catalog.json` without any external backend.
4. **First-Order Coupon Tracking**: `FIRST100` state is tracked locally on-device using a versioned AsyncStorage key (`@plazza_used_coupons_v1`). Once an order is placed with `FIRST100`, it is permanently marked as used for subsequent checkout attempts.
5. **Prescription Items (`rx: true`)**: Clearly badged in both search results and the cart with an "Rx" badge and an informational warning banner during checkout; no prescription upload workflow was required.

---

## 2. Key Design Decisions & Trade-Offs

### Pluggable Promotion Engine
* **Decision**: Implemented an Open-Closed Principle (OCP) compliant coupon registry in `src/services/couponRules.ts`.
* **Rationale**: The candidate brief bonus and evaluation criteria explicitly reward extensible architecture for live changes (e.g. adding a new coupon rule during the interview). Each coupon is an isolated `CouponRule` implementation containing its own:
  - Validation logic (`validate`)
  - Calculation logic (`calculateDiscount`)
  - Flag for delivery fee waiver (`waivesDeliveryFee`)
* **Trade-off**: Slightly more boilerplate interface structure compared to hardcoded `switch(code)` statements, but entirely decouples coupon additions from the cart and bill calculation engines. Neither cart nor bill code is touched when adding new promo codes.

### Separation of Concerns: Cart vs. Bill vs. Promotions
* **Cart Layer (`CartContext.tsx`)**: Exclusively handles item inventory, additions, strict quantity capping (`maxQty`), decrements, and persistence.
* **Bill Layer (`billCalculator.ts`)**: Pure deterministic function with zero side effects. Given an item total and active coupon, it guarantees all business invariants (delivery fee threshold at ₹499, and the critical spec rule: *Discount can never exceed Item Total*).
* **Promotion Layer (`PromotionContext.tsx`)**: Orchestrates coupon lifecycles and reactive auto-removal. When the cart is modified such that a coupon condition is violated (e.g., cart drops below ₹300 for `FLAT50`), the coupon is automatically removed with an explanatory toast.

### Robust, Versioned Persistence Layer
* **Decision**: Built a versioned storage envelope wrapper in `src/services/storageService.ts`:
  ```ts
  interface StorageEnvelope<T> {
    version: number;
    timestamp: number;
    data: T;
  }
  ```
* **Rationale**: Meets bonus requirements for error tolerance. Missing keys, corrupt JSON strings, or future schema mismatches are gracefully caught and return type-safe fallbacks without ever crashing the application.
* **Recent Searches**: Capped at 5 entries, deduplicated, and prepended in MRU (Most Recently Used) order.

---

## 3. What I Would Do Differently With More Time
1. **Design**: design implemetation can better .
2. **Naviagtion and screens**:  add tabs naviagtion and screens
3. **Animations**: Add animated layout transitions when items are added, removed, or when coupons are dynamically auto-removed using React Native Reanimated.


---

## 4. AI Collaboration Note
* **What I Prompted For**:
  - Breaking down the assignment brief into granular, milestone-based git commits.
  - Designing a pluggable coupon rule interface that allows on-the-spot extension without modifying cart or bill code.
  - Setting up Jest unit tests to verify critical spec invariants (delivery fee threshold, ₹100 cap on `SAVE10`, auto-removal, and `maxQty`).
* **What I Rejected / Rewrote**:
  -  global color palate and rewrote
  -  rending between tabs 
  -  UI changes
  
