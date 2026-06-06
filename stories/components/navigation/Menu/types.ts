export interface MenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  icon?: string;
  level?: number;
  items?: MenuItem[];
  active?: boolean;
  parentActive?: boolean;
}
