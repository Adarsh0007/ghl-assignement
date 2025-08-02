// Follower service for managing available followers
export class FollowerService {
  // List of available followers
  static availableFollowers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      avatar: 'AJ',
      department: 'Sales'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      avatar: 'BS',
      department: 'Marketing'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      avatar: 'CD',
      department: 'Support'
    },
    {
      id: 4,
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      avatar: 'DW',
      department: 'Engineering'
    },
    {
      id: 5,
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      avatar: 'EB',
      department: 'Sales'
    },
    {
      id: 6,
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      avatar: 'FM',
      department: 'Marketing'
    },
    {
      id: 7,
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      avatar: 'GL',
      department: 'Support'
    },
    {
      id: 8,
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      avatar: 'HT',
      department: 'Engineering'
    },
    {
      id: 9,
      name: 'Ivy Chen',
      email: 'ivy.chen@example.com',
      avatar: 'IC',
      department: 'Sales'
    },
    {
      id: 10,
      name: 'Jack Anderson',
      email: 'jack.anderson@example.com',
      avatar: 'JA',
      department: 'Marketing'
    }
  ];

  // Get all available followers
  static getAllFollowers() {
    return this.availableFollowers;
  }

  // Get follower by name
  static getFollowerByName(name) {
    return this.availableFollowers.find(follower => follower.name === name);
  }

  // Get follower by ID
  static getFollowerById(id) {
    return this.availableFollowers.find(follower => follower.id === id);
  }

  // Search followers by name, email, or department
  static searchFollowers(query) {
    if (!query || query.trim() === '') {
      return this.availableFollowers;
    }

    const searchTerm = query.toLowerCase().trim();
    return this.availableFollowers.filter(follower => 
      follower.name.toLowerCase().includes(searchTerm) ||
      follower.email.toLowerCase().includes(searchTerm) ||
      follower.department.toLowerCase().includes(searchTerm)
    );
  }

  // Get follower initials
  static getFollowerInitials(name) {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  // Validate follower name
  static isValidFollower(name) {
    return this.availableFollowers.some(follower => follower.name === name);
  }

  // Get followers by department
  static getFollowersByDepartment(department) {
    return this.availableFollowers.filter(follower => 
      follower.department === department
    );
  }

  // Get unique departments
  static getDepartments() {
    const departments = [...new Set(this.availableFollowers.map(f => f.department))];
    return departments.sort();
  }
} 