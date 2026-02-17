export interface UserMenuItem {
  label: string;
  href?: string;
  icon?: string;
  variant?: "default" | "danger";
  disabled?: boolean;
}
