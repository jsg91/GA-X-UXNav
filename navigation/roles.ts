import { ContextName, Role, RoleGroup, RoleNavigation } from './types';
import { resolveContextForRole } from './utils';

// ===== ROLE CONFIGURATION =====
export const ROLE_CONFIG = {
  groups: [
    {
      name: 'Flying & Training',
      icon: 'airplane-takeoff',
      roles: [
        {
          id: 'pilot',
          name: 'Pilot',
          icon: 'airplane',
          label: 'Pilot',
          navigation: {
            dashboard: {
              route: '/(tabs)/',
              label: 'Dashboard',
              icon: 'view-dashboard',
              customPage: true,
              main: true,
            },
            'route-planner': {
              route: '/(tabs)/route-planner',
              label: 'Plan',
              icon: 'map',
              customPage: true,
              main: true,
            },
            aircrafts: { label: 'Fly', main: true },
            documents: { main: true },
            checklists: { main: true },
            logbookentries: { label: 'Logbook', main: true },
            reservations: {},
            club: {
              route: '/(tabs)/club',
              label: 'Club',
              icon: 'account-group',
              customPage: true,
            },
            users: { label: 'Instructors', icon: 'school' },
            aerodromes: {},
            'find-dpe': {
              route: '/(tabs)/find-dpe',
              label: 'DPE',
              icon: 'clipboard-check',
              customPage: true,
            },
            'find-ame': {
              route: '/(tabs)/find-ame',
              label: 'AME',
              icon: 'stethoscope',
              customPage: true,
            },
          },
        },
        {
          id: 'student',
          name: 'Student',
          icon: 'account-school',
          label: 'Student',
          context: 'pilot',  // Students use pilot context
          navigation: {
            logbookentries: {},
            reservations: {},
            users: { label: 'My Instructor', icon: 'school' },
            training: {
              route: '/(tabs)/training',
              label: 'My Training',
              icon: 'school',
              customPage: true,
            },
          },
        },
        {
          id: 'instructor',
          name: 'Instructor',
          icon: 'school',
          label: 'Instructor',
          navigation: {
            users: { label: 'My Students', icon: 'account-school' },
            reservations: {},
            aircrafts: {},
            logbookentries: {},
          },
        },
        {
          id: 'safety-officer',
          name: 'Safety Officer',
          icon: 'shield-alert',
          label: 'Safety Officer',
          comingSoon: true,
          context: 'default',
          navigation: {
            incidents: {
              route: '/(tabs)/incidents',
              label: 'Incidents',
              icon: 'shield-alert',
              customPage: true,
            },
            aircrafts: {},
            'safety-reports': {
              route: '/(tabs)/safety-reports',
              label: 'Safety Reports',
              icon: 'clipboard-alert',
              customPage: true,
            },
          },
        },
        {
          id: 'passenger',
          name: 'Passenger',
          icon: 'seat-passenger',
          label: 'Passenger',
          comingSoon: true,
          context: 'pilot',
          navigation: {
            reservations: { label: 'My Flights' },
            aerodromes: {},
          },
        },
        {
          id: 'fleet-operator',
          name: 'Fleet Operator',
          icon: 'airplane-cog',
          label: 'Fleet Operator',
          comingSoon: true,
          context: 'default',
          navigation: {
            aircrafts: { label: 'Fleet' },
            maintenance: {},
            reservations: {},
            scheduling: {
              route: '/(tabs)/scheduling',
              label: 'Scheduling',
              icon: 'calendar-clock',
              customPage: true,
            },
            reports: {
              route: '/(tabs)/reports',
              label: 'Reports',
              icon: 'chart-line',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Administration',
      icon: 'office-building',
      roles: [
        {
          id: 'organization-admin',
          name: 'Organization Admin',
          icon: 'domain',
          label: 'Organization',
          context: 'platform_admin',
          navigation: {
            organizations: {},
            members: {
              route: '/(tabs)/members',
              label: 'Members',
              icon: 'account-group',
              customPage: true,
            },
            events: {},
            invoicing: {
              route: '/(tabs)/invoicing',
              label: 'Invoicing',
              icon: 'receipt',
              customPage: true,
            },
          },
        },
        {
          id: 'flightschool-admin',
          name: 'Flight School Admin',
          icon: 'school',
          label: 'Flightschool',
          context: 'flightschool_admin',
          navigation: {
            users: { label: 'Students' },
            instructors: {
              route: '/(tabs)/instructors',
              label: 'Instructors',
              icon: 'school',
              customPage: true,
            },
            aircrafts: {},
            reservations: {},
            courses: {
              route: '/(tabs)/courses',
              label: 'Courses',
              icon: 'book-open-variant',
              customPage: true,
            },
          },
        },
        {
          id: 'flightclub-admin',
          name: 'Flight Club Admin',
          icon: 'account-group',
          label: 'Flightclub',
          context: 'flightclub_admin',
          navigation: {
            aircrafts: {},
            members: {
              route: '/(tabs)/members',
              label: 'Members',
              icon: 'account-group',
              customPage: true,
            },
            reservations: {},
            events: {},
            invoicing: {
              route: '/(tabs)/invoicing',
              label: 'Invoicing',
              icon: 'receipt',
              customPage: true,
            },
          },
        },
        {
          id: 'fbo-admin',
          name: 'FBO Admin',
          icon: 'airplane-landing',
          label: 'FBO',
          comingSoon: true,
          context: 'default',
          navigation: {
            aerodromes: {},
            fuel: {
              route: '/(tabs)/fuel',
              label: 'Fuel Services',
              icon: 'gas-station',
              customPage: true,
            },
            services: {
              route: '/(tabs)/services',
              label: 'Services',
              icon: 'room-service',
              customPage: true,
            },
          },
        },
        {
          id: 'aerodrome-admin',
          name: 'Aerodrome Admin',
          icon: 'airport',
          label: 'Aerodrome',
          context: 'aerodrome_admin',
          navigation: {
            aerodromes: {},
            movements: {
              route: '/(tabs)/movements',
              label: 'Movements',
              icon: 'airplane-takeoff',
              customPage: true,
            },
            parking: {
              route: '/(tabs)/parking',
              label: 'Parking',
              icon: 'parking',
              customPage: true,
            },
            fuel: {
              route: '/(tabs)/fuel',
              label: 'Fuel',
              icon: 'gas-station',
              customPage: true,
            },
          },
        },
        {
          id: 'maintenance',
          name: 'Maintenance',
          icon: 'wrench',
          label: 'Maintenance',
          navigation: {
            aircrafts: {},
            maintenance: {},
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-check',
              customPage: true,
            },
            parts: {
              route: '/(tabs)/parts',
              label: 'Parts',
              icon: 'cog',
              customPage: true,
            },
          },
        },
        {
          id: 'charter',
          name: 'Charter',
          icon: 'airplane-clock',
          label: 'Charter',
          comingSoon: true,
          context: 'default',
          navigation: {
            aircrafts: {},
            'charter-flights': {
              route: '/(tabs)/charter-flights',
              label: 'Charter Flights',
              icon: 'airplane-clock',
              customPage: true,
            },
            reservations: { label: 'Bookings' },
            clients: {
              route: '/(tabs)/clients',
              label: 'Clients',
              icon: 'account-multiple',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Manufacturing & Inspection',
      icon: 'factory',
      roles: [
        {
          id: 'builder',
          name: 'Experimental Builder',
          icon: 'hammer-wrench',
          label: 'Experimental Builder',
          comingSoon: true,
          context: 'default',
          navigation: {
            'my-projects': {
              route: '/(tabs)/my-projects',
              label: 'My Projects',
              icon: 'hammer-wrench',
              customPage: true,
            },
            aircrafts: {},
            'build-log': {
              route: '/(tabs)/build-log',
              label: 'Build Log',
              icon: 'notebook',
              customPage: true,
            },
          },
        },
        {
          id: 'manufacturer',
          name: 'Manufacturer',
          icon: 'factory',
          label: 'Manufacturing',
          comingSoon: true,
          context: 'default',
          navigation: {
            products: {
              route: '/(tabs)/products',
              label: 'Products',
              icon: 'factory',
              customPage: true,
            },
            aircrafts: {},
            orders: {
              route: '/(tabs)/orders',
              label: 'Orders',
              icon: 'cart',
              customPage: true,
            },
          },
        },
        {
          id: 'dealer',
          name: 'Dealer',
          icon: 'storefront',
          label: 'Dealer',
          comingSoon: true,
          context: 'default',
          navigation: {
            aircrafts: { label: 'Inventory' },
            products: {
              route: '/(tabs)/products',
              label: 'Products',
              icon: 'package-variant',
              customPage: true,
            },
            sales: {
              route: '/(tabs)/sales',
              label: 'Sales',
              icon: 'cash-register',
              customPage: true,
            },
            clients: {
              route: '/(tabs)/clients',
              label: 'Clients',
              icon: 'account-multiple',
              customPage: true,
            },
          },
        },
        {
          id: 'inspector',
          name: 'Inspector',
          icon: 'clipboard-search',
          label: 'Consultant / Inspector',
          comingSoon: true,
          context: 'default',
          navigation: {
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-search',
              customPage: true,
            },
            aircrafts: {},
            reports: {
              route: '/(tabs)/reports',
              label: 'Reports',
              icon: 'file-document',
              customPage: true,
            },
          },
        },
        {
          id: 'maintenance-technician',
          name: 'Maintenance Technician',
          icon: 'wrench',
          label: 'Maintenance Technician',
          comingSoon: true,
          context: 'default',
          navigation: {
            aircrafts: {},
            maintenance: {},
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-check',
              customPage: true,
            },
            parts: {
              route: '/(tabs)/parts',
              label: 'Parts',
              icon: 'cog',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Certification',
      icon: 'certificate',
      roles: [
        {
          id: 'dpe',
          name: 'Designated Pilot Examiner',
          icon: 'clipboard-check',
          label: 'DPE',
          comingSoon: true,
          context: 'default',
          navigation: {
            examinations: {
              route: '/(tabs)/examinations',
              label: 'Examinations',
              icon: 'clipboard-check',
              customPage: true,
            },
            candidates: {
              route: '/(tabs)/candidates',
              label: 'Candidates',
              icon: 'account-multiple',
              customPage: true,
            },
          },
        },
        {
          id: 'ame',
          name: 'Aviation Medical Examiner',
          icon: 'stethoscope',
          label: 'AME',
          comingSoon: true,
          context: 'default',
          navigation: {
            'medical-exams': {
              route: '/(tabs)/medical-exams',
              label: 'Medical Exams',
              icon: 'stethoscope',
              customPage: true,
            },
            patients: {
              route: '/(tabs)/patients',
              label: 'Patients',
              icon: 'account-heart',
              customPage: true,
            },
          },
        },
      ],
    },
    {
      name: 'Regulatory',
      icon: 'gavel',
      roles: [
        {
          id: 'caa',
          name: 'CAA',
          icon: 'shield-check',
          label: 'CAA',
          comingSoon: true,
          navigation: {
            aircrafts: {},
            registrations: {
              route: '/(tabs)/registrations',
              label: 'Registrations',
              icon: 'certificate',
              customPage: true,
            },
            licenses: {
              route: '/(tabs)/licenses',
              label: 'Licenses',
              icon: 'card-account-details',
              customPage: true,
            },
            incidents: {
              route: '/(tabs)/incidents',
              label: 'Incidents',
              icon: 'alert',
              customPage: true,
            },
          },
        },
        {
          id: 'customs',
          name: 'Customs',
          icon: 'passport',
          label: 'Custom',
          comingSoon: true,
          context: 'default',
          navigation: {
            declarations: {
              route: '/(tabs)/declarations',
              label: 'Declarations',
              icon: 'passport',
              customPage: true,
            },
            flights: {
              route: '/(tabs)/flights',
              label: 'International Flights',
              icon: 'airplane',
              customPage: true,
            },
          },
        },
        {
          id: 'insurance-regulator',
          name: 'Insurance Regulator',
          icon: 'shield-check',
          label: 'Insurance Regulator',
          comingSoon: true,
          context: 'default',
          navigation: {
            policies: {
              route: '/(tabs)/policies',
              label: 'Policies',
              icon: 'shield-check',
              customPage: true,
            },
            inspections: {
              route: '/(tabs)/inspections',
              label: 'Inspections',
              icon: 'clipboard-search',
              customPage: true,
            },
            reports: {
              route: '/(tabs)/reports',
              label: 'Reports',
              icon: 'file-document',
              customPage: true,
            },
          },
        },
      ],
    },
  ] as const satisfies readonly RoleGroup[],

  // ===== STANDALONE ADMIN ROLE =====
  adminRole: { id: 'admin', name: 'Admin', icon: 'cog', label: 'Admin (platform)', comingSoon: true },

  // ===== HIERARCHICAL NAVIGATION HELPERS =====
  /**
   * Get all roles as a flat array (for backward compatibility)
   */
  getAllRoles(): Role[] {
    const roles: Role[] = [];
    this.groups.forEach(group => {
      roles.push(...group.roles);
    });
    roles.push(this.adminRole);
    return roles;
  },

  /**
   * Find a role by ID
   */
  getRoleById(id: string): Role | undefined {
    if (id === 'admin') {
      return this.adminRole;
    }
    return this.getAllRoles().find(role => role.id === id);
  },

  /**
   * Get roles that are available now
   */
  getBasicRoles(): Role[] {
    return this.getAllRoles().filter(role => !role.comingSoon);
  },

  /**
   * Get roles that are coming soon
   */
  getComingSoonRoles(): Role[] {
    return this.getAllRoles().filter(role => role.comingSoon);
  },

  /**
   * Get roles by group name
   */
  getRolesByGroup(groupName: string): Role[] {
    const group = this.groups.find(g => g.name === groupName);
    if (!group) return [];

    return group.roles;
  },
} as const;

// ===== LEGACY EXPORT =====
// Re-export for backward compatibility
export { resolveContextForRole as getContextForRole } from './utils';
