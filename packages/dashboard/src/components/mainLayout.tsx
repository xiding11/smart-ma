import React, { useMemo } from "react";

import Layout from "./layout";
import { useNamespacedTranslations } from "../lib/translations";
import { createTranslatedMenuItems } from "./menuItems/mainWithTranslation";

export default function MainLayout(
  props: Omit<React.ComponentProps<typeof Layout>, "items">,
) {
  const t = useNamespacedTranslations('Navigation');
  const menuItems = useMemo(() => createTranslatedMenuItems(t), [t]);
  
  return <Layout items={menuItems.items} {...props} />;
}
