// Owner service for managing available owners
export class OwnerService {
  // List of available owners
  static availableOwners = [
    {
      id: 1,
      name: 'Devon Lane',
      email: 'devon.lane@example.com',
      avatar: 'DL'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      avatar: 'SW'
    },
    {
      id: 3,
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: 'AJ'
    },
    {
      id: 4,
      name: 'Lisa Brown',
      email: 'lisa.brown@example.com',
      avatar: 'LB'
    },
    {
      id: 5,
      name: 'Mark Davis',
      email: 'mark.davis@example.com',
      avatar: 'MD'
    },
    {
      id: 6,
      name: 'Emily Chen',
      email: 'emily.chen@example.com',
      avatar: 'EC'
    },
    {
      id: 7,
      name: 'Michael Rodriguez',
      email: 'michael.rodriguez@example.com',
      avatar: 'MR'
    },
    {
      id: 8,
      name: 'Jessica Thompson',
      email: 'jessica.thompson@example.com',
      avatar: 'JT'
    }
  ];

  // Get all available owners
  static getAllOwners() {
    return this.availableOwners;
  }

  // Get owner by name
  static getOwnerByName(name) {
    return this.availableOwners.find(owner => owner.name === name);
  }

  // Get owner by ID
  static getOwnerById(id) {
    return this.availableOwners.find(owner => owner.id === id);
  }

  // Search owners by name
  static searchOwners(query) {
    if (!query || query.trim() === '') {
      return this.availableOwners;
    }

    const searchTerm = query.toLowerCase().trim();
    return this.availableOwners.filter(owner => 
      owner.name.toLowerCase().includes(searchTerm) ||
      owner.email.toLowerCase().includes(searchTerm)
    );
  }

  // Get owner initials
  static getOwnerInitials(name) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // Validate owner name
  static isValidOwner(name) {
    return this.availableOwners.some(owner => owner.name === name);
  }
} 