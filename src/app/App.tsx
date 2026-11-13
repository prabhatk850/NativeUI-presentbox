import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from '../screens/Page/Page';
import ProductDetail from '../screens/ProductDetail/ProductDetail';
import { linking, type RootStackParamList } from './navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} documentTitle={{ formatter: () => 'PresentBox' }}>
        {/* every route renders its Contentful page (see Page); the product sheet is a template for each product entry */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Page} />
          <Stack.Screen name="Products" component={Page} />
          <Stack.Screen name="Cart" component={Page} />
          <Stack.Screen name="Profile" component={Page} />
          {/* drawn as a sheet over the page underneath, which stays visible */}
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ presentation: 'transparentModal', animation: 'none' }} />
          <Stack.Screen name="Orders" component={Page} />
          <Stack.Screen name="PaymentMethods" component={Page} />
          <Stack.Screen name="Help" component={Page} />
          <Stack.Screen name="Occasions" component={Page} />
          <Stack.Screen name="About" component={Page} />
          <Stack.Screen name="Careers" component={Page} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
