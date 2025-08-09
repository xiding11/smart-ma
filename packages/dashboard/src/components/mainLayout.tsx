import React, { useMemo } from "react";

import { useNamespacedTranslations } from "../lib/translations";
import Layout from "./layout";
import { createTranslatedMenuItems } from "./menuItems/mainWithTranslation";

export default function MainLayout(
  props: Omit<React.ComponentProps<typeof Layout>, "items">,
) {
  const t = useNamespacedTranslations("Navigation");
  const menuItems = useMemo(() => {
    // During SSR/SSG, provide a safe fallback if translations aren't available
    try {
      return createTranslatedMenuItems(t);
    } catch (error) {
      console.warn("Failed to create translated menu items during SSR:", error);
      return { items: [] }; // Safe fallback for SSR
    }
  }, [t]);

  return <Layout items={menuItems.items} {...props} />;
}
