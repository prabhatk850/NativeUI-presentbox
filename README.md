# PresentBox (React Native)

React Native port of the `presentbox-ui` web app. One codebase runs on Android, iOS and web.

| Command | What it does |
|---|---|
| `npm start` | Metro bundler for the native apps |
| `npm run android` / `npm run ios` | Build and run on a device or emulator (iOS needs a Mac: `cd ios && pod install` first) |
| `npm run web` / `npm run build:web` | Web via Vite + react-native-web (output in `dist-web/`) |
| `npm run storybook` | Component stories in the browser |
| `npm test` / `npm run lint` / `npm run typecheck` | Jest + React Native Testing Library, ESLint, TypeScript |
| `npm run cms:seed` | Create the Contentful content model and upload the current content (see below) |

Where things live:

| Folder | What's in it |
|---|---|
| `src/app` | `App.tsx` (navigator) and `navigation.ts` (routes, URL linking) |
| `src/cms` | Contentful: `client.ts` (Delivery API over `fetch`), `index.ts` (getters that map entries to app shapes), `config.json` (space ID, environment, locale) |
| `src/sections` | Page blocks editors arrange in Contentful, and the registry that maps each Contentful section type to its component |
| `src/components` | The UI library: `atoms`, `molecules`, `organisms`, `templates`, each with its test and stories. `index.ts` exports them all |
| `src/screens` | `Page` (renders any route's Contentful page) and the screen blocks it can place (cart, catalog, help, …), each with its test and stories. `ProductDetail` is the sheet every product entry opens in |
| `src/store` | Cart, wishlist, addresses, recent searches (in memory) |
| `src/api` | Dummy account API (orders, payment methods) until a commerce backend exists |
| `src/mocks` | JSON fixtures. The app runs on them when no Contentful token is set; tests, Storybook and `cms:seed` use them too |
| `src/theme` | Colors (primary = footer red), fonts, breakpoints in `index.ts`. `icons.ts` lists every icon the app uses; add new icons there so native bundles stay small |
| `src/utils` | Price, filter and search helpers |
| `src/assets` | Fonts (linked with `npx react-native-asset`; file names match their PostScript names) and the hero video |

## Contentful

Space `phud3kz30g4d` drives the whole app: header menu, footer, the product catalog, and every screen. Each route renders the Contentful **page** whose slug is its URL path (`home` for `/`, `products`, `payment-methods`, …), block by block in the order editors set:

- content blocks: hero video, category cards, reviews, features, Help Center, About, Careers
- **App screen** blocks place a built-in screen (products, occasions, cart, profile, orders, payment methods); their data comes from the catalog and the shopper's account, which stays out of Contentful

The product sheet (`/products/:id`) is a template filled by each product entry.

First-time setup:

1. Copy `.env.example` to `.env`.
2. In Contentful, create a CMA token (Settings → CMA tokens) and put it in `CONTENTFUL_MANAGEMENT_TOKEN`.
   The token must be authorized for the organization: Account settings → CMA tokens → **Authorize** next to the organization, or the API answers `OrganizationAccessGrantRequired`.
3. Run `npm run cms:seed`. It creates the content types and uploads everything in `src/mocks` (all pages, in the app's order) as published entries. Run it once: it overwrites entries that have the same IDs. To update only the content types later, run `npm run cms:seed -- --content-model-only`.
4. Create a Delivery API key (Settings → API keys) and put its access token in `CONTENTFUL_DELIVERY_TOKEN`.
5. Restart Metro or Vite. The app now reads Contentful; delete the token to go back to the mocks.

Content is cached in memory for the app session, so editors' changes show after an app restart.

Adding a page block (for example a banner):

1. Add a content type to `scripts/contentful/model.js` and add its id to `SECTION_TYPES`.
2. Add its shape to the `Section` type and a mapper to `SECTIONS` in `src/cms/index.ts`.
3. Write the component and register it in `BLOCKS` in `src/sections/index.tsx`, using components from `src/components`.
4. Add a mock block to `src/mocks/pages.json` and a builder to `SECTIONS` in `scripts/contentful/seed.js`. `src/cms/cms.test.ts` checks the model, the seed and the mapper agree.
5. Run `npm run cms:seed -- --content-model-only` to create the new type in Contentful.

The app skips block types it has no component for, so publishing a new block can't break older app versions.

## Docker

The `Dockerfile` builds the web app and serves it with nginx on port 80. `APP_ENV` (`dev`, `qa` or `main`, default `main`) picks the environment:

```sh
docker build --build-arg APP_ENV=qa --secret id=contentful_token,env=CONTENTFUL_DELIVERY_TOKEN -t presentbox:qa .
docker run -p 8080:80 presentbox:qa
```

Every push to `dev`, `qa` or `main` runs `.github/workflows/docker.yml`. It builds that branch's image only and pushes it to Docker Hub as `:dev`, `:qa` or `:latest` (main). The comment at the top of the workflow lists the secrets and variables it needs.

---

This project was bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
