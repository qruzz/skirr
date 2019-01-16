# skirr

Skirr (old norse word for clean) is an application that informs its users about the carbon intensity at their location. It's a simple, visual application with live updates on the carbon intensity data, and displays the actual value. It uses colours together with the value of carbon intensity to informs its users.

To run the application, insert your API KEY in the api.js file located within the utils folder. Then run the application by installing the packages and starting the package manager; then run the application either by opening Xcode or using the cli:

```
    $ yarn
    $ yarn start --reset-cache
    $ react-native run-ios --simulator="iPhone XR"
```

The application can also be run on android in similar fashion - just open your AVD and exchange the last command with the following:

```
    $ react-native run-android
```