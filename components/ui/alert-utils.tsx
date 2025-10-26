import { Alert } from 'react-native';

export const AlertUtils = {
  showNotification: (count: number, type: 'notification' | 'message') => {
    const title = type === 'notification' ? 'Notifications' : 'Messages';
    const message = `You have ${count} new ${type === 'notification' ? 'notifications' : 'messages'}.`;

    Alert.alert(title, message, [{ text: 'OK' }]);
  },

  showPermissionRequired: (roleName: string) => {
    Alert.alert(
      'Permission Required',
      `You need special permissions to access the ${roleName} role.`,
      [{ text: 'OK' }]
    );
  },

  showAviationUpdates: () => {
    Alert.alert('Aviation Updates', 'Latest aviation news, weather updates, and regulatory changes.');
  },

  showLogoutConfirmation: (onConfirm: () => void) => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: onConfirm },
      ]
    );
  },
};


