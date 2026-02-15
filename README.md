# goey-native-toast

A lightweight, animated, and fully customizable toast library for React Native, built with `react-native-reanimated` and `react-native-gesture-handler`.

## Features

- 🚀 **60fps Animations**: Powered by Reanimated v3/v4.
- 👆 **Interactive**: Swipe to dismiss support.
- 🎨 **Themable**: Built-in dark/light mode and rich colors support.
- 📍 **Flexible Positioning**: Top/bottom, left/center/right.
- ⌨️ **Keyboard Aware**: Automatically adjusts position when keyboard opens.
- 🧩 **Headless Capable**: Fully customizable UI if needed.
- 📱 **Cross Platform**: Works on iOS and Android.

## Installation

```sh
npm install goey-native-toast
# or
yarn add goey-native-toast
```

### Peer Dependencies

You need to install the following peer dependencies:

```sh
npm install react-native-reanimated react-native-gesture-handler react-native-svg react-native-safe-area-context react-native-keyboard-controller
```

Don't forget to wrap your app with `GestureHandlerRootView` and add the Reanimated babel plugin if you haven't already. For best keyboard handling results, ensure you follow `react-native-keyboard-controller` setup instructions.

## Usage

1. **Add the Toaster to your app root:**

```tsx
import { Toaster } from 'goey-native-toast';

export default function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  );
}
```

2. **Trigger toasts from anywhere:**

```tsx
import { toast } from 'goey-native-toast';

// Success
toast.success('Event created successfully');

// Error
toast.error('Something went wrong');

// With description
toast.info('New Update', {
  description: 'Version 2.0 is now available',
});

// With action
toast.warning('Network lost', {
  action: {
    label: 'Retry',
    onClick: () => console.log('Retrying...'),
  },
});
```

## API Reference

### `<Toaster />` Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `Position` | `'top-center'` | Position of the toast stack. Options: `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`. |
| `theme` | `'light' \| 'dark'` | `'light'` | Theme of the toasts. |
| `richColors` | `boolean` | `false` | Whether to use rich colors (success=green, error=red) instead of standard black/white. |
| `offset` | `number` | `16` | Distance from the edge of the screen. |
| `visibleToasts` | `number` | `3` | Maximum number of visible toasts. |
| `swipeToDismissDirection` | `'up' \| 'down' \| 'left' \| 'right'` | `undefined` | Direction to swipe to dismiss. Defaults to natural direction based on position. |
| `toastOptions` | `ToastOptions` | `{}` | Default options for all toasts. |

### `toast` Methods

- `toast.success(message, options?)`
- `toast.error(message, options?)`
- `toast.warning(message, options?)`
- `toast.info(message, options?)`
- `toast.custom(message, options?)`
- `toast.dismiss(id?)` - Dismiss all or a specific toast.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
