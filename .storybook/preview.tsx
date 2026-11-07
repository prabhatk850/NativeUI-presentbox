import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import type { Preview } from '@storybook/react-native-web-vite';
import '../web/fonts.css';

const Stack = createNativeStackNavigator();

// Components use navigation hooks (useNavigation / useRoute / useLinkTo), so every story
// renders as the "Home" screen of a tiny navigator; links to /products land on a stub.
const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home">{() => <Story />}</Stack.Screen>
            <Stack.Screen name="Products">{() => <Text>products page</Text>}</Stack.Screen>
            <Stack.Screen name="Cart">{() => <Text>cart page</Text>}</Stack.Screen>
            <Stack.Screen name="Profile">{() => <Text>profile page</Text>}</Stack.Screen>
            <Stack.Screen name="ProductDetail">{() => <Text>product page</Text>}</Stack.Screen>
            <Stack.Screen name="Orders">{() => <Text>orders page</Text>}</Stack.Screen>
            <Stack.Screen name="PaymentMethods">{() => <Text>payment methods page</Text>}</Stack.Screen>
            <Stack.Screen name="Help">{() => <Text>help page</Text>}</Stack.Screen>
            <Stack.Screen name="Occasions">{() => <Text>occasions page</Text>}</Stack.Screen>
            <Stack.Screen name="About">{() => <Text>about page</Text>}</Stack.Screen>
            <Stack.Screen name="Careers">{() => <Text>careers page</Text>}</Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    ),
  ],
};

export default preview;
