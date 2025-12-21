import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { MedicationStore } from "./MedicationStore";
import { IntakeStore } from "./IntakeStore";
import { UIStore } from "./UIStore";
import { ReminderStore } from "./ReminderStore";
import { VersionStore } from "./VersionStore";
import { OnboardingStore } from "./OnboardingStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  medicationStore: MedicationStore;
  intakeStore: IntakeStore;
  reminderStore: ReminderStore;
  uiStore: UIStore;
  versionStore: VersionStore;
  onboardingStore: OnboardingStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.medicationStore = new MedicationStore(this);
    this.intakeStore = new IntakeStore(this);
    this.reminderStore = new ReminderStore(this);
    this.uiStore = new UIStore(this);
    this.versionStore = new VersionStore();
    this.onboardingStore = new OnboardingStore(this);
  }
}

export const rootStore = new RootStore();
