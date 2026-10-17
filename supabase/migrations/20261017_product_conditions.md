# Enable both product conditions

Run `20261017_product_conditions.sql` in the connected Supabase project's SQL Editor before deploying this change. This adds `products.available_conditions` and preserves each existing product's current condition. No products are automatically switched to offering both.

In Admin → Products → Add Product or Edit Details, tick Brand New and Used to enable both on a single listing. At least one must remain selected. Customers choose a condition on the product page, and the selected condition appears in the cart and WhatsApp order. Products offering both appear under both condition filters.

Prices and inventory remain shared per storage/color variant. This change does not add separate prices or stock quantities for each condition. Cart validation caps the combined quantity of both conditions to the shared stock.

The SQL migration must be applied separately; local code checks do not verify or apply changes to the hosted database.
