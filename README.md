# goey-native-toast

<div align="center">
  <!-- PLACEHOLDER_LOGO -->
  <!-- <img src="./assets/logo.png" width="150" height="150" alt="goey-native-toast logo" /> -->
  
  <h1>Goey Native Toast</h1>
  
  <p>
    <strong>A lightweight, high-performance, and fully customizable toast library for React Native.</strong>
  </p>
  
  <p>
    <a href="https://www.npmjs.com/package/goey-native-toast">
      <img src="https://img.shields.io/npm/v/goey-native-toast?style=flat-square" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/goey-native-toast">
      <img src="https://img.shields.io/npm/dm/goey-native-toast?style=flat-square" alt="npm downloads" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/npm/l/goey-native-toast?style=flat-square" alt="license" />
    </a>
    <br />
    <a href="https://snack.expo.dev/@teepheh/goey-native-toast?platform=ios">
      <img src="https://img.shields.io/badge/Try%20it%20on-Expo%20Snack-4630EB.svg?style=flat-square&logo=expo&logoColor=white" alt="Try it on Expo Snack" />
    </a>
  </p>
</div>

---

<!-- PLACEHOLDER_DEMO_GIF -->
<div align="center">
  <img src="./assets/android-vid.gif" alt="Android Demo" width="300" />
  <br />
  <a href="./assets/ios-toast-vid.mp4">Watch iOS Demo (MP4)</a>
</div>

## Features

- 🚀 **60fps Animations**: Powered by Reanimated v3/v4 for buttery smooth enter/exit transitions.
- 🧬 **Smart Morphing**: Starts as a compact pill and seamlessly morphs to show more content (description/actions) if needed.
- 👆 **Interactive**: Swipe to dismiss support with configurable directions.
- 🎨 **Themable**: Built-in support for light, dark, and system themes, plus a "solid" color mode.
- 📍 **Flexible Positioning**: Support for 6 positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.
- ⌨️ **Keyboard Aware**: Automatically adjusts position when the keyboard opens/closes (powered by `react-native-keyboard-controller`).
- 🧩 **Headless Capable**: Fully customizable body content.
- 📱 **Cross Platform**: Works seamlessly on iOS and Android.
- ⚡ **Zero Config**: Works out of the box with sensible defaults.

## Installation

```sh
npm install goey-native-toast
# or
yarn add goey-native-toast
# or
pnpm add goey-native-toast
```

### Peer Dependencies

This library relies on several peer dependencies that must be installed in your project:

```sh
npx expo install react-native-reanimated react-native-gesture-handler react-native-svg react-native-safe-area-context
```

**Optional:**
```sh
npx expo install react-native-keyboard-controller
```
(Recommended for keyboard avoidance support. If not installed, toasts will simply ignore keyboard state.)

### Expo Support

✅ **Expo Snack & Expo Go**: Supported! (Keyboard avoidance will be disabled)
✅ **Expo Development Builds**: Fully supported with keyboard avoidance.

To enable full keyboard support in Development Builds:

1.  **Install the package**: `npx expo install react-native-keyboard-controller`
2.  **Add plugin to `app.json`**:
    ```json
    {
      "expo": {
        "plugins": [
          "react-native-keyboard-controller"
        ]
      }
    }
    ```
3.  **Rebuild**: `npx expo prebuild` then run your app.

### Bare React Native

Ensure you have configured `react-native-reanimated` and `react-native-gesture-handler` according to their respective documentation (e.g., wrapping your app in `GestureHandlerRootView`, adding the Babel plugin).

## Usage

### 1. Add the Toaster

Place the `<Toaster />` component at the root of your application (or near the top level). It renders the toast stack.

```tsx
import { Toaster } from 'goey-native-toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
      <Toaster />
    </GestureHandlerRootView>
  );
}
```

### 2. Trigger Toasts

Import the `toast` object to trigger notifications from anywhere in your app.

```tsx
import { toast } from 'goey-native-toast';
import { Button } from 'react-native';

// ... inside your component
<Button title="Success" onPress={() => toast.success('Event created successfully')} />
<Button title="Error" onPress={() => toast.error('Something went wrong')} />
```

<!-- PLACEHOLDER_USAGE_IMAGE -->
<!-- <img src="./assets/usage-example.png" alt="Usage Example" /> -->

## Toast Types

### Standard Toasts

```tsx
toast.success('Successfully saved!');
toast.error('Error saving data');
toast.warning('Please review your input');
toast.info('New version available');
```

### With Description

Add a detailed description to any toast. The toast will automatically "morph" and expand to fit the content.

```tsx
toast.success('File Uploaded', {
  description: 'image_v1.png has been added to your gallery.',
});
```

### With Action

Add an action button to the toast.

```tsx
toast.error('Connection Lost', {
  action: {
    label: 'Retry',
    onClick: () => reloadData(),
  },
});
```

### Custom Body Content

You can render custom React nodes inside the toast body. The toast header (icon + title) will remain, and the body will expand to show your custom content.

```tsx
toast.custom('Notification', {
  customBody: (
    <View style={{ padding: 8 }}>
      <Text style={{ color: '#666' }}>
        You have 3 new messages from <Text style={{ fontWeight: 'bold' }}>Alice</Text>.
      </Text>
      <View style={{ flexDirection: 'row', marginTop: 8 }}>
        <Button title="Reply" onPress={() => {}} />
        <Button title="Ignore" onPress={() => {}} />
      </View>
    </View>
  ),
});
```

### Promise Toast

Handle async operations with automatic loading, success, and error states.

```tsx
const myPromise = new Promise((resolve) =>
  setTimeout(() => resolve({ name: 'User Data' }), 2000)
);

toast.promise(myPromise, {
  loading: 'Loading data...',
  success: (data) => `Successfully loaded ${data.name}`,
  error: (err) => `Error: ${err.message}`,
});
```

## API Reference

### `<Toaster />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `position` | `ToastPosition` | `'top-center'` | Default position for toasts. Options: `'top-left'`, `'top-center'`, `'top-right'`, `'bottom-left'`, `'bottom-center'`, `'bottom-right'`. |
| `visibleToasts` | `number` | `3` | Maximum number of toasts visible at once. |
| `duration` | `number` | `4000` | Default duration in milliseconds before auto-dismissing. |
| `theme` | `'light' \| 'dark' \| 'system'` | `'system'` | Color theme of the toasts. |
| `solidColors` | `boolean` | `false` | Use solid background colors (e.g., green for success) instead of standard black/white. |
| `offset` | `number` | `16` | Distance from the safe area edge. |
| `gutter` | `number` | `8` | Spacing between stacked toasts. |
| `swipeToDismissDirection` | `SwipeDirection` | `undefined` | Direction to swipe to dismiss. Defaults to natural direction based on position. |
| `icons` | `Record<ToastType, ReactNode>` | `{}` | Custom icons for each toast type. |
| `toastOptions` | `ToastConfig` | `{}` | Global default options for all toasts. |
| `closeButton` | `boolean` | `false` | Show a close button on all toasts. |
| `dir` | `'ltr' \| 'rtl' \| 'auto'` | `'auto'` | Text direction. |

### `toast()` Options

These options can be passed to any `toast` method (e.g., `toast.success(message, options)`).

| Option | Type | Description |
| :--- | :--- | :--- |
| `description` | `string` | Secondary text to display below the title. |
| `duration` | `number` | Time in ms before the toast dismisses. |
| `position` | `ToastPosition` | Override the position for this specific toast. |
| `action` | `{ label: string, onClick: () => void }` | Action button configuration. |
| `cancel` | `{ label: string, onClick: () => void }` | Cancel button configuration. |
| `icon` | `ReactNode` | Custom icon for this toast. |
| `onDismiss` | `() => void` | Callback when the toast is dismissed. |
| `onAutoClose` | `() => void` | Callback when the toast auto-closes. |
| `dismissible` | `boolean` | Whether the toast can be swiped to dismiss. |
| `style` | `ViewStyle` | Custom container style. |
| `className` | `string` | Custom class name (if using NativeWind/Tailwind). |
| `customBody` | `ReactNode` | Render custom content inside the toast body. |

## Advanced Usage

### Customizing Icons

You can override the default icons globally via the `<Toaster />` component or per-toast.

**Global Override:**

```tsx
<Toaster
  icons={{
    success: <MyCustomCheckIcon />,
    error: <MyCustomErrorIcon />,
  }}
/>
```

**Per-Toast Override:**

```tsx
toast.success('Saved', {
  icon: <MyCustomIcon />,
});
```

### Keyboard Handling

This library uses `react-native-keyboard-controller` to smoothly animate toasts out of the way when the keyboard opens. This ensures your toasts are never hidden behind the keyboard, providing a superior user experience compared to standard `KeyboardAvoidingView` solutions.

<!-- PLACEHOLDER_KEYBOARD_DEMO -->
<!-- <img src="./assets/keyboard-demo.gif" alt="Keyboard Demo" /> -->

## Troubleshooting

### Toasts are not appearing?

1.  Ensure `<Toaster />` is rendered at the root of your app.
2.  Check if `visibleToasts` is greater than 0.
3.  Verify that `react-native-reanimated` is properly installed and the babel plugin is added.

### Animations are jerky or not working?

1.  Ensure you are wrapping your app in `<GestureHandlerRootView style={{ flex: 1 }}>`.
2.  Run `npx expo start --clear` to clear the bundler cache.
3.  If using Expo, make sure you have run `npx expo prebuild` as this library uses native code.

## Contributing

Contributions are welcome! Please see the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT © [Teepheh-Git](https://github.com/Teepheh-Git)
