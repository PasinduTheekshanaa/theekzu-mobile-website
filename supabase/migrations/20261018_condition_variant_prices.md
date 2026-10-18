# Independent iPhone condition variants

Applied to project `bxkuacptrywwdzacloko` on 2026-10-18 through the authenticated SQL editor.

`20261018_condition_variant_prices.sql` adds a condition to each variant. Existing rows are assigned their original product condition; accessories normalize to Brand New. No stock, prices, IDs or SKUs are copied or changed. The unique option key now includes condition. Existing table permissions remain intact.

`20261018_condition_variant_prices.verify.sql` exercises separate condition prices, duplicate option rejection, and accessory normalization inside a rolled-back transaction. It leaves no test variants behind.

Verified before and after: 382 variants, sum of prices 70,454,726 LKR, total stock 408. After migration: zero missing conditions and zero persisted test variants.

In admin, open Manage Variants, enter Brand New and Used prices/quantities in their separate sections, then enable the desired Available conditions. The other condition starts empty; real prices and inventory must be entered explicitly. Accessories have one Brand New section.

The storefront selects price, stock, SKU, storage/colour availability and cart variant from the chosen condition. Missing condition prices show unavailable; they never borrow another condition's price. Existing stock is preserved.

Website code is prepared for local review; applying the schema does not deploy the application.
