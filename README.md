# GitHub \<Stargazers\/>

**GitHub Stargazers** is an Expo App (React Native + Web) that allows you to search for GitHub repos and see a list of people that put a star on that repo.

## Usage

Refer to the [user manual](/docs/User_manual.pdf).

## Installation

##### First:

Run `yarn` to install all needed node modules.

##### Then, to develop:

Run `yarn web` to run the App in the browser.<br/>
Run `yarn android` to run the App in an Android emulator (Android SDK and Android Studio needed) or on a real debug device (turn on developer settings and USB debug).<br/>
Run `yarn ios` to run the App in an iOS simulator (Apple computer with XCode needed).<br/>
Run `yarn test` to run the included Jest test suite.

##### Finally, to build:

Run `yarn build:web:staging` or `yarn build:web:prod` to build static web files (hostable on a web server) with respectively staging or prod environment. <br/>
Once done, all output files will be in the `webapp` folder.<br/>
If you need to host it in a subdirectory, be sure to change the `homepage` field in the package.json file.
Note: when dev build runs on an Android test device from a Linux machine you may get `Error: adb: insufficient permissions for device`. In this case just run `sudo adb kill-server` and `sudo adb start-server`. Then you can succesfully start a dev build again with `yarn android`.

## Technical details:

This App comes with some cool features

<ul>
<li>Using latest Expo and React Native frameworks</li>
<li>Written in TypeScript</li>
<li>Redux for context and storage</li>
<li>TailwindCSS for styling/theming</li>
<li>I18n for ui language change and translation system</li>
<li>Lottie for Lottie json animation playback (on both Native and web)</li>
<li>UI animations by React-Native included Animated library</li>
<li>Error/bug tracking with react-error-boundary and Sentry (the latter only works for web and EAS builds, see <a href="https://docs.expo.dev/guides/using-sentry/">https://docs.expo.dev/guides/using-sentry/</a></li>
<li>Jest testing library</li>
<li>User manual (under /docs folder)
<li>And... well commented code!</li>
</ul>
