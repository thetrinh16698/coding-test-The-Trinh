import { expect, it, describe } from 'vitest'
import productDiscounts from './bundle-builder';

describe('bundle builder v2', () => {
  it('should able to handle multiple discounts', () => {
    const result = productDiscounts({
      "cart": {
        "buyerIdentity": null,
        "lines": [
          {
            "id": "gid://shopify/CartLine/0",
            "quantity": 3,
            "sellingPlanAllocation": null,
            "cost": {
              "amountPerQuantity": {
                "amount": "10.95",
                "currencyCode": "EUR"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "id": "gid://shopify/ProductVariant/39370591273049",
              "product": {
                "id": "gid://shopify/Product/Apple",
              }
            }
          },
          {
            "id": "gid://shopify/CartLine/1",
            "quantity": 3,
            "sellingPlanAllocation": null,
            "cost": {
              "amountPerQuantity": {
                "amount": "10.95",
                "currencyCode": "EUR"
              }
            },
            "merchandise": {
              "__typename": "ProductVariant",
              "id": "gid://shopify/ProductVariant/32385157005401",
              "product": {
                "id": "gid://shopify/Product/Banana",
              }
            }
          },
        ]
      },
      "discountNode": {
        "metafield": {
          "value": JSON.stringify({
            "id": "148",
            "tiers": [
              { "title": "3 FRUITS - 10% OFF", "amount": 10, "quantity": 3 },
              { "title": "6 FRUITS - 17% OFF", "amount": 17, "quantity": 6 },
              { "title": "9 FRUITS - 20% OFF", "amount": 20, "quantity": 9 }
            ],
            "collections": [],
            "products": [
              "gid://shopify/Product/Apple",
              "gid://shopify/Product/Banana",
              "gid://shopify/Product/Cherry",
              "gid://shopify/Product/Date",
              "gid://shopify/Product/Elderberry",
              "gid://shopify/Product/Fig",
              "gid://shopify/Product/Grape",
              "gid://shopify/Product/Honeydew",
              "gid://shopify/Product/Kiwi",
              "gid://shopify/Product/Lemon",
              "gid://shopify/Product/Mango",
              "gid://shopify/Product/Nectarine",
              "gid://shopify/Product/Orange",
              "gid://shopify/Product/Papaya",
              "gid://shopify/Product/Quince",
              "gid://shopify/Product/Raspberry",
              "gid://shopify/Product/Strawberry",
              "gid://shopify/Product/Tangerine",
              "gid://shopify/Product/Ugli",
              "gid://shopify/Product/Voavanga",
              "gid://shopify/Product/Watermelon",
              "gid://shopify/Product/Xigua",
              "gid://shopify/Product/Yuzu",
              "gid://shopify/Product/Zucchini",
              "gid://shopify/Product/Apricot",
              "gid://shopify/Product/Blackberry",
              "gid://shopify/Product/Coconut",
              "gid://shopify/Product/Durian",
              "gid://shopify/Product/Eggplant",
              "gid://shopify/Product/Feijoa",
              "gid://shopify/Product/Guava",
              "gid://shopify/Product/Huckleberry"
            ],
            "discountType": "PERCENTAGE",
            "title": "Chroma Bundle Builder",
            "allowStackingWithSubscription": false
          })
        }
      }
    } as any);

    console.log(JSON.stringify(result, null, 2));
    expect(result.discounts.length).toBe(1);
  })

  describe('Fixed Bundle Price Tests', () => {
    it('should apply correct fixed bundle price for 3 items', () => {
      const result = productDiscounts({
        "cart": {
          "buyerIdentity": null,
          "lines": [
            {
              "id": "gid://shopify/CartLine/0",
              "quantity": 2,
              "sellingPlanAllocation": null,
              "cost": {
                "amountPerQuantity": {
                  "amount": "20.00",
                  "currencyCode": "EUR"
                }
              },
              "merchandise": {
                "__typename": "ProductVariant",
                "id": "gid://shopify/ProductVariant/1",
                "product": {
                  "id": "gid://shopify/Product/Apple",
                }
              }
            },
            {
              "id": "gid://shopify/CartLine/1",
              "quantity": 1,
              "sellingPlanAllocation": null,
              "cost": {
                "amountPerQuantity": {
                  "amount": "30.00",
                  "currencyCode": "EUR"
                }
              },
              "merchandise": {
                "__typename": "ProductVariant",
                "id": "gid://shopify/ProductVariant/2",
                "product": {
                  "id": "gid://shopify/Product/Banana",
                }
              }
            },
          ]
        },
        "discountNode": {
          "metafield": {
            "value": JSON.stringify({
              "tiers": [
                { "title": "3 Items Bundle for $50", "amount": 50, "quantity": 3 },
                { "title": "6 Items Bundle for $90", "amount": 90, "quantity": 6 },
              ],
              "products": [
                "gid://shopify/Product/Apple",
                "gid://shopify/Product/Banana"
              ],
              "collections": [],
              "discountType": "FIXED_BUNDLE_PRICE",
              "title": "Fixed Bundle Price Test"
            })
          }
        }
      } as any);

      // Original total would be: (20 * 2) + (30 * 1) = 70
      // Target bundle price is 50, so discount should be 20
      expect(result.discounts.length).toBe(1);
      expect(result.discounts[0].value?.fixedAmount?.amount).toBe("20.00");
      expect(result.discounts[0].message).toBe("3 Items Bundle for $50");
    });

    it('should not apply discount when quantity is below tier threshold', () => {
      const result = productDiscounts({
        "cart": {
          "buyerIdentity": null,
          "lines": [
            {
              "id": "gid://shopify/CartLine/0",
              "quantity": 1,
              "sellingPlanAllocation": null,
              "cost": {
                "amountPerQuantity": {
                  "amount": "20.00",
                  "currencyCode": "EUR"
                }
              },
              "merchandise": {
                "__typename": "ProductVariant",
                "id": "gid://shopify/ProductVariant/1",
                "product": {
                  "id": "gid://shopify/Product/Apple",
                }
              }
            }
          ]
        },
        "discountNode": {
          "metafield": {
            "value": JSON.stringify({
              "tiers": [
                { "title": "3 Items Bundle for $50", "amount": 50, "quantity": 3 }
              ],
              "products": ["gid://shopify/Product/Apple"],
              "collections": [],
              "discountType": "FIXED_BUNDLE_PRICE",
              "title": "Fixed Bundle Price Test"
            })
          }
        }
      } as any);

      expect(result.discounts.length).toBe(0);
    });

    it('should apply larger tier discount when eligible', () => {
      const result = productDiscounts({
        "cart": {
          "buyerIdentity": null,
          "lines": [
            {
              "id": "gid://shopify/CartLine/0",
              "quantity": 6,
              "sellingPlanAllocation": null,
              "cost": {
                "amountPerQuantity": {
                  "amount": "20.00",
                  "currencyCode": "EUR"
                }
              },
              "merchandise": {
                "__typename": "ProductVariant",
                "id": "gid://shopify/ProductVariant/1",
                "product": {
                  "id": "gid://shopify/Product/Apple",
                }
              }
            }
          ]
        },
        "discountNode": {
          "metafield": {
            "value": JSON.stringify({
              "tiers": [
                { "title": "3 Items Bundle for $50", "amount": 50, "quantity": 3 },
                { "title": "6 Items Bundle for $90", "amount": 90, "quantity": 6 }
              ],
              "products": ["gid://shopify/Product/Apple"],
              "collections": [],
              "discountType": "FIXED_BUNDLE_PRICE",
              "title": "Fixed Bundle Price Test"
            })
          }
        }
      } as any);

      // Original total would be: 20 * 6 = 120
      // Target bundle price is 90, so discount should be 30
      expect(result.discounts.length).toBe(1);
      expect(result.discounts[0].value?.fixedAmount?.amount).toBe("30.00");
      expect(result.discounts[0].message).toBe("6 Items Bundle for $90");
    });

    it('should apply highest tier discount for 9 items', () => {
      const result = productDiscounts({
        "cart": {
          "buyerIdentity": null,
          "lines": [
            {
              "id": "gid://shopify/CartLine/0",
              "quantity": 9,
              "sellingPlanAllocation": null,
              "cost": {
                "amountPerQuantity": {
                  "amount": "20.00",
                  "currencyCode": "EUR"
                }
              },
              "merchandise": {
                "__typename": "ProductVariant",
                "id": "gid://shopify/ProductVariant/1",
                "product": {
                  "id": "gid://shopify/Product/Apple",
                }
              }
            }
          ]
        },
        "discountNode": {
          "metafield": {
            "value": JSON.stringify({
              "tiers": [
                { "title": "3 Items Bundle for $50", "amount": 50, "quantity": 3 },
                { "title": "6 Items Bundle for $90", "amount": 90, "quantity": 6 },
                { "title": "9 Items Bundle for $120", "amount": 120, "quantity": 9 }
              ],
              "products": ["gid://shopify/Product/Apple"],
              "collections": [],
              "discountType": "FIXED_BUNDLE_PRICE",
              "title": "Fixed Bundle Price Test"
            })
          }
        }
      } as any);

      // Original total would be: 20 * 9 = 180
      // Target bundle price is 120, so discount should be 60
      expect(result.discounts.length).toBe(1);
      expect(result.discounts[0].value?.fixedAmount?.amount).toBe("60.00");
      expect(result.discounts[0].message).toBe("9 Items Bundle for $120");
    });
  });
});