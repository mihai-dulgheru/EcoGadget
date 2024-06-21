import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import global from '../../styles/global';
import theme from '../../styles/theme';

export default function TabBar({ state, descriptors, navigation }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (isKeyboardVisible) {
    return null;
  }

  const getTabLabel = (options, route) => {
    if (options.tabBarLabel !== undefined) {
      return options.tabBarLabel;
    }
    if (options.title !== undefined) {
      return options.title;
    }
    return route.name;
  };

  const getTabIconName = (route, isFocused) => {
    switch (route.name) {
      case 'RecyclingInfoTab':
        return isFocused ? 'information-circle' : 'information-circle-outline';
      case 'RecyclingLocationsTab':
        return isFocused ? 'map' : 'map-outline';
      case 'ApplianceManagementTab':
        return isFocused ? 'power' : 'power-outline';
      case 'UserAccount':
        return isFocused ? 'person' : 'person-outline';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = getTabLabel(options, route);
          const isFocused = state.index === index;
          const iconName = getTabIconName(route, isFocused);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [styles.tab, pressed && global.pressed]}
            >
              <View style={isFocused ? styles.tabIconFocused : styles.tabIcon}>
                <Ionicons
                  name={iconName}
                  size={24}
                  color={
                    isFocused ? theme.colors.primary : theme.colors.textPrimary
                  }
                />
              </View>
              <Text
                style={isFocused ? styles.tabLabelFocused : styles.tabLabel}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundPrimary,
    // borderTopColor: theme.colors.border,
    // borderTopWidth: theme.borderWidth.default,
  },
  tabBar: {
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    flexDirection: 'row',
    height: theme.spacing[16],
    justifyContent: 'space-around',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  tabIcon: {
    paddingVertical: theme.spacing[0.5],
  },
  tabIconFocused: {
    alignItems: 'center',
    backgroundColor: 'rgba(126, 157, 121, 0.3)',
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing[0.5],
    width: theme.spacing[12],
  },
  tabLabel: {
    ...theme.fontSize.sm,
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.body,
  },
  tabLabelFocused: {
    ...theme.fontSize.sm,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.body,
  },
});
