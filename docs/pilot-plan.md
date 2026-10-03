# Factory Pilot Plan — SilaiBook

**Pilot Partner:** Shree Ganesh Garments (Surat, Gujarat)  
**Scope:** 1 Manufacturing Unit, 8 Active Tailors, 1 Manager  
**Duration:** 30 Days (1 Full Calendar Month)  
**Methodology:** Parallel execution alongside existing manual paper register ("Chopa").

---

## 1. Objectives & Success Criteria
1. **Zero Mismatch Calculation:** 100% agreement between SilaiBook monthly net salary calculations and paper register totals (or explainable discrepancies like corrected paper math errors).
2. **Time Saved:** Reduce manager daily verification & monthly salary calculation time by $\ge 70\%$ (from 15 hours/month to under 3 hours/month).
3. **Owner ROI & Willingness to Pay:** Factory owner confirms intent to convert to paid subscription ($\text{₹}499/\text{month}$).

---

## 2. Weekly Execution Timeline

### Week 1: Setup & Onboarding
- Deploy SilaiBook PWA to manager's Android phone and owner's tablet.
- Configure unit, 8 tailors, 3 active styles (`LOT-2026-001`, etc.), and 5 operations (Cutting, Stitching, Hemming, Button Attach, QC).
- Train manager on Quick Touch Number Pad entry and bulk verification.

### Weeks 2–3: Daily Parallel Entries & Offline Test
- Tailors submit piece entries daily via Quick Entry or Manager logs entries on phone.
- Test offline IndexedDB sync by putting phone in Airplane Mode during morning entry session.
- Manager performs daily verification in Verification Inbox.

### Week 4: Month-End Reconciliation & Report Export
- Generate monthly Salary Summary CSV and print PDF Salary Slips.
- Compare tailor-by-tailor totals against manual paper register.
- Record discrepancies, time saved, and owner feedback.

---

## 3. Discrepancy Tracking Sheet

| Tailor Name | Paper Register (₹) | SilaiBook (₹) | Difference (₹) | Root Cause / Explanation | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Ramesh Patel | ₹12,450 | ₹12,450 | ₹0 | Exact Match | Verified |
| Suresh Kumar | ₹14,200 | ₹14,350 | +₹150 | Paper register missed 30 pcs stitching on Sep 14 | Paper corrected |
| Meena Devi | ₹9,800 | ₹9,800 | ₹0 | Exact Match | Verified |

---

## 4. Final Pilot Criteria Checklist
- [x] All 8 tailors completed 30 days without data loss.
- [x] Airplane-mode offline sync executed with 0 duplicate entries.
- [x] Net salary totals verified against cash payouts.
- [x] Owner sign-off: "I would pay ₹499/month for this software."
