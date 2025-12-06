import { AuthStore } from './AuthStore';
import { UserStore } from './UserStore';
import { MedicationStore } from './MedicationStore';
import { IntakeStore } from './IntakeStore';
import { UIStore } from './UIStore';

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  medicationStore: MedicationStore;
  intakeStore: IntakeStore;
  uiStore: UIStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.medicationStore = new MedicationStore(this);
    this.intakeStore = new IntakeStore(this);
    this.uiStore = new UIStore(this);
  }
}

export const rootStore = new RootStore();

