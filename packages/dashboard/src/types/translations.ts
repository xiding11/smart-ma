// Translation namespace types for better type safety and IDE support

export interface HeaderTranslations {
  BranchSelect: {
    MainBranch: string;
    YourBranches: string;
    NewBranch: string;
    CreateNewBranchTitle: string;
    CreateNewBranchDescription: string;
    NewBranchLocalWarning: string;
    CreateNewBranchButton: string;
  };
  GitActions: {
    Actions: string;
    CommitAndPush: string;
    OpenPullRequest: string;
    GithubRepository: string;
  };
}

export interface BroadcastsTranslations {
  Title: string;
  createAction: string;
  Description: string;
  CreateNew: string;
  NoBroadcasts: string;
  Status: {
    Draft: string;
    Scheduled: string;
    Running: string;
    Completed: string;
    Cancelled: string;
  };
  Actions: {
    Edit: string;
    Delete: string;
    Duplicate: string;
    Send: string;
    Cancel: string;
  };
}

export interface JourneyTranslations {
  Header: {
    Title: string;
    Description: string;
  };
  Actions: {
    CreateNew: string;
    Edit: string;
    Delete: string;
    Duplicate: string;
    Start: string;
    Stop: string;
  };
  Nodes: {
    Entry: {
      Label: string;
    };
    Email: {
      Label: string;
    };
    Wait: {
      Label: string;
    };
    Exit: {
      Label: string;
    };
    Webhook: {
      Label: string;
    };
    Sms: {
      Label: string;
    };
    MobilePush: {
      Label: string;
    };
  };
  Settings: {
    Save: string;
    Cancel: string;
    Name: string;
    Description: string;
    Status: string;
  };
  Notifications: {
    SaveSuccess: string;
    SaveError: string;
    DeleteSuccess: string;
    DeleteError: string;
  };
}

export interface SegmentsTranslations {
  Title: string;
  Description: string;
  CreateNew: string;
  NoSegments: string;
  Actions: {
    Edit: string;
    Delete: string;
    Duplicate: string;
    ViewUsers: string;
  };
  Editor: {
    Name: string;
    Description: string;
    Conditions: string;
    AddCondition: string;
    Save: string;
    Cancel: string;
  };
  UserCount: string;
}

export interface TemplatesTranslations {
  Title: string;
  Description: string;
  CreateNew: string;
  NoTemplates: string;
  Types: {
    Email: string;
    Sms: string;
    MobilePush: string;
    Webhook: string;
  };
  Actions: {
    Edit: string;
    Delete: string;
    Duplicate: string;
    Preview: string;
  };
  Editor: {
    Name: string;
    Subject: string;
    Body: string;
    Save: string;
    Cancel: string;
    Preview: string;
  };
}

export interface UsersTranslations {
  Title: string;
  Description: string;
  NoUsers: string;
  Search: string;
  UserDetails: string;
  Properties: string;
  Events: string;
  Deliveries: string;
  Actions: {
    ViewProfile: string;
    SendMessage: string;
    Export: string;
  };
}

export interface SettingsTranslations {
  Title: string;
  Sections: {
    General: string;
    Email: string;
    Sms: string;
    MobilePush: string;
    Webhook: string;
    Integration: string;
    Billing: string;
  };
  General: {
    WorkspaceName: string;
    Timezone: string;
    Language: string;
    Save: string;
  };
  Email: {
    Provider: string;
    SmtpHost: string;
    SmtpPort: string;
    Username: string;
    Password: string;
    FromEmail: string;
    FromName: string;
  };
}

export interface NavigationTranslations {
  Dashboard: string;
  Journeys: string;
  Segments: string;
  Broadcasts: string;
  Templates: string;
  Users: string;
  Events: string;
  Deliveries: string;
  Settings: string;
  UserProperties: string;
  SubscriptionGroups: string;
  Analysis: string;
}

export interface CommonTranslations {
  Actions: {
    Save: string;
    Cancel: string;
    Delete: string;
    Edit: string;
    Create: string;
    Update: string;
    Search: string;
    Filter: string;
    Export: string;
    Import: string;
    Duplicate: string;
    Preview: string;
    Send: string;
    Back: string;
    Next: string;
    Previous: string;
    Close: string;
    Submit: string;
    Reset: string;
    Confirm: string;
  };
  Status: {
    Active: string;
    Inactive: string;
    Draft: string;
    Published: string;
    Scheduled: string;
    Running: string;
    Completed: string;
    Cancelled: string;
    Failed: string;
    Pending: string;
  };
  Messages: {
    Loading: string;
    NoData: string;
    Error: string;
    Success: string;
    Warning: string;
    Info: string;
    Saving: string;
    Saved: string;
    Deleting: string;
    Deleted: string;
    ConfirmDelete: string;
    UnsavedChanges: string;
  };
  Form: {
    Required: string;
    Invalid: string;
    TooShort: string;
    TooLong: string;
    InvalidEmail: string;
    InvalidUrl: string;
    InvalidPhone: string;
    Name: string;
    Email: string;
    Phone: string;
    Description: string;
    Notes: string;
    Tags: string;
    CreatedAt: string;
    UpdatedAt: string;
  };
  Pagination: {
    Previous: string;
    Next: string;
    Page: string;
    Of: string;
    PerPage: string;
    Total: string;
    Showing: string;
    Results: string;
  };
}

// Complete translation interface structure
export interface TranslationStructure {
  Header: HeaderTranslations;
  Broadcasts: BroadcastsTranslations;
  JourneyEditor: JourneyTranslations;
  Segments: SegmentsTranslations;
  Templates: TemplatesTranslations;
  Users: UsersTranslations;
  Settings: SettingsTranslations;
  Navigation: NavigationTranslations;
  Common: CommonTranslations;
}

// Utility type for extracting nested keys
export type NestedKeyOf<T> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? K extends string
      ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
      : never
    : K extends string
    ? K
    : never;
}[keyof T];

export type TranslationKeyPath = NestedKeyOf<TranslationStructure>;