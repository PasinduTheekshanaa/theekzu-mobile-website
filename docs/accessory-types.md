# Custom accessory types

In Add Product or Edit Product, choose Accessories, click **+ Add Type**, enter a name and click **Use Type**. Save the product to persist it. Saved types become choices on other products and filters in Accessories and Shop. Unsaved drafts are not permanent type records.

The existing Supabase product schema has no subcategory column. Accessory type values are therefore stored as `accessory-type:<type>` in the existing text `products.series` column. The product mapper exposes `series: "accessories"` and the decoded `subcategory` to the UI. iPhone series and legacy accessory rows keep their existing behavior. No database migration is required.

Built-in values retain their existing labels and identifiers. Custom names preserve capitalization and are trimmed, whitespace-normalized and limited to 60 characters. Type choices are derived from saved accessory products; removing the last product of a custom type also removes it from available choices.
