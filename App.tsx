import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './src/screens/Home';
import Product from './src/screens/Product';
import Cart from './src/screens/Cart';
import Profile from './src/screens/Profile';
import ProductDetail from './src/screens/ProductDetail';
import Orders from './src/screens/Orders';
import PaymentMethods from './src/screens/PaymentMethods';
import Help from './src/screens/Help';
import Occasions from './src/screens/Occasions';
import About from './src/screens/About';
import Careers from './src/screens/Careers';
import { linking, type RootStackParamList } from './src/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} documentTitle={{ formatter: () => 'PresentBox' }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Products" component={Product} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={Profile} />
          {/* drawn as a sheet over the page underneath, which stays visible */}
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ presentation: 'transparentModal', animation: 'none' }} />
          <Stack.Screen name="Orders" component={Orders} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="Occasions" component={Occasions} />
          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Careers" component={Careers} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
