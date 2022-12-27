export class UserRole {
  static readonly STUDENT = "Student";
  static readonly PARENT = "Parent";
  static readonly TEACHER = "Teacher";
  static readonly CHAIR = "Chair";
  static readonly SYSTEM_ADMINISTRATOR = "System Administrator";

  static values(): string[] {
    return Object.values(this);
  }
}

export class Department {
  static readonly COMPUTER_ENGINEERING = "Computer Engineering";
  static readonly SOFTWARE_ENGINEERING = "Software Engineering";
  static readonly MECHANICAL_ENGINEERING = "Mechanical Engineering";
  static readonly CIVIL_ENGINEERING = "Civil Engineering";

  static values(): string[] {
    return Object.values(this);
  }
}
