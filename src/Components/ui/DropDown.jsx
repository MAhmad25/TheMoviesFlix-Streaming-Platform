import GlassRadioGroup from "./glass-radio-group";

export default function AnimatedDropdown({ items, text = "tv", value, className, onSelect, label = "Choose a category" }) {
      const defaultValue = items.find((item) => item.name === text || item.value === text)?.value ?? items[0]?.value;

      return (
            <GlassRadioGroup
                  options={items.map((item) => ({ label: item.name, value: item.value }))}
                  value={value}
                  defaultValue={defaultValue}
                  onValueChange={onSelect}
                  label={label}
                  className={className}
            />
      );
}
