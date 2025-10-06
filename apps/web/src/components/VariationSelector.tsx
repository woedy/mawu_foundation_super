import { ProductVariation } from "../types/shop";

interface VariationSelectorProps {
  variations: ProductVariation[];
  selectedVariations: Record<string, string>;
  onVariationChange: (type: string, value: string) => void;
}

export const VariationSelector = ({
  variations,
  selectedVariations,
  onVariationChange,
}: VariationSelectorProps) => {
  return (
    <div className="space-y-6">
      {variations.map((variation) => {
        const selectedValue = selectedVariations[variation.type];
        const selectedOption = variation.options.find(
          (opt) => opt.value === selectedValue
        );

        return (
          <div key={variation.type}>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-ink-900">
                {variation.name}
              </label>
              {selectedOption && (
                <span className="text-sm text-ink-600">
                  {selectedOption.label}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {variation.options.map((option) => {
                const isSelected = selectedValue === option.value;
                const isOutOfStock = option.inventory !== undefined && option.inventory <= 0;

                return (
                  <button
                    key={option.value}
                    onClick={() => onVariationChange(variation.type, option.value)}
                    disabled={isOutOfStock}
                    className={`
                      rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "border-brand-600 bg-brand-50 text-brand-900"
                          : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
                      }
                      ${
                        isOutOfStock
                          ? "cursor-not-allowed opacity-40"
                          : "cursor-pointer"
                      }
                    `}
                  >
                    {option.label}
                    {isOutOfStock && (
                      <span className="ml-1 text-xs">(Out of stock)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
