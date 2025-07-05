// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'person.2.fill': 'groups',
  'calendar': 'calendar-today',
  'person.crop.circle': 'person',
  'sparkles': 'auto-awesome',
  'plus.circle.fill': 'add-circle',
  'message.fill': 'message',
  'sportscourt.fill': 'sports-soccer',
  'airplane': 'flight',
  'laptopcomputer': 'laptop',
  'paintbrush.fill': 'brush',
  'building.2.fill': 'business',
  'person.3.fill': 'group',
  'book.fill': 'book',
  'fork.knife': 'restaurant',
  'music.note': 'music-note',
  'gamecontroller.fill': 'sports-esports',
  'figure.run': 'directions-run',
  'leaf.fill': 'eco',
  'circle.fill': 'fiber-manual-record',
  'wifi': 'wifi',
  'clock.fill': 'schedule',
  'pencil': 'edit',
  'text.quote': 'format-quote',
  'ellipsis': 'more-horiz',
  'arrow.up.circle.fill': 'keyboard-arrow-up',
  'bell.fill': 'notifications',
  'lock.fill': 'lock',
  'questionmark.circle.fill': 'help',
  'magnifyingglass': 'search',
  'calendar.badge.clock': 'schedule',
  'bubble.left.and.bubble.right.fill': 'chat-bubble',
  'bubble.left.fill': 'chat-bubble-outline',
  'checkmark.circle.fill': 'check-circle',
  'xmark.circle.fill': 'cancel',
  'person.fill': 'person',
  'globe': 'language',
  'clock': 'access-time',
  'message': 'message',
  'brain.head.profile': 'psychology',
  'translate': 'translate',
  'smart-toy': 'smart-toy',
  'robot': 'smart-toy',
} as unknown as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || 'help-outline';
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
