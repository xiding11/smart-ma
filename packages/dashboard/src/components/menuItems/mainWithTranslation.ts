import {
  BarChartOutlined,
  BoltOutlined,
  BookOutlined,
  CampaignOutlined,
  ContactSupportOutlined,
  GroupsOutlined,
  InboxOutlined,
  LanOutlined,
  ManageAccountsOutlined,
  MenuBookOutlined,
  PeopleOutlined,
  PersonOutlined,
} from "@mui/icons-material";

import { TranslationFunction } from "../../lib/translations";
import { MenuItemGroup } from "./types";

// ==============================|| TRANSLATED MENU ITEMS ||============================== //

export const createTranslatedMenuItems = (t: TranslationFunction): { items: MenuItemGroup[] } => ({
  items: [
    {
      id: "reporting",
      title: t("Groups.Reporting"),
      type: "group",
      children: [
        {
          id: "analysis",
          title: t("Items.Analysis"),
          type: "item",
          url: "/analysis/messages",
          icon: BarChartOutlined,
          description: t("Descriptions.Analysis"),
        },
        {
          id: "deliveries",
          title: t("Items.Deliveries"),
          type: "item",
          url: "/deliveries",
          icon: InboxOutlined,
          description: t("Descriptions.Deliveries"),
        },
      ],
    },
    {
      id: "messaging",
      title: t("Groups.Messaging"),
      type: "group",
      children: [
        {
          id: "journeys",
          title: t("Items.Journeys"),
          type: "item",
          url: "/journeys",
          icon: LanOutlined,
          description: t("Descriptions.Journeys"),
        },
        {
          id: "messages",
          title: t("Items.MessageTemplates"),
          type: "item",
          url: "/templates",
          icon: BookOutlined,
          description: t("Descriptions.MessageTemplates"),
        },
        {
          id: "broadcasts",
          title: t("Items.Broadcasts"),
          type: "item",
          url: "/broadcasts",
          icon: CampaignOutlined,
          description: t("Descriptions.Broadcasts"),
        },
      ],
    },
    {
      id: "audience",
      title: t("Groups.Audience"),
      type: "group",
      children: [
        {
          id: "people",
          title: t("Items.Users"),
          type: "item",
          url: "/users",
          icon: PersonOutlined,
          description: t("Descriptions.Users"),
        },
        {
          id: "segments",
          title: t("Items.Segments"),
          type: "item",
          url: "/segments",
          icon: GroupsOutlined,
          description: t("Descriptions.Segments"),
        },
        {
          id: "user-properties",
          title: t("Items.UserProperties"),
          type: "item",
          url: "/user-properties",
          icon: ManageAccountsOutlined,
          description: t("Descriptions.UserProperties"),
        },
        {
          id: "subscription-groups",
          title: t("Items.SubscriptionGroups"),
          type: "item",
          url: "/subscription-groups",
          icon: PeopleOutlined,
          description: t("Descriptions.SubscriptionGroups"),
        },
        {
          id: "events",
          title: t("Items.Events"),
          type: "item",
          url: "/events",
          icon: BoltOutlined,
          description: t("Descriptions.Events"),
        },
      ],
    },
    {
      id: "support",
      title: t("Groups.Support"),
      type: "group",
      children: [
        {
          id: "documentation",
          title: t("Items.Documentation"),
          type: "item",
          url: "https://docs.dittofeed.com",
          icon: MenuBookOutlined,
          external: true,
          description: t("Descriptions.Documentation"),
        },
        {
          id: "contact",
          title: t("Items.ContactUs"),
          type: "item",
          url: "/contact",
          icon: ContactSupportOutlined,
          description: t("Descriptions.ContactUs"),
        },
      ],
    },
  ],
});

export default createTranslatedMenuItems;