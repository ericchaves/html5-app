# HTML5 App

## requirements

make sure you have gulp, slush, slush backbone and bower installed globally.
```
npm install -g bower
npm install -g gulp
npm install -g slush
npm install -g slush-backbone
```
## installing

```
npm install
bower install
```


## Tests

To run tests with soucelabs you need to export your credentials
```
export SAUCE_USERNAME=<username>
export SAUCE_ACCESS_KEY=<access-key>
npm run saucelabs
```

To run TDD/BDD specs start a live-reload session with `gulp serve` and point your browser to http://localhost:9000/specs.html

## tasks
 
 `gulp build`: for production
 
 `gulp serve`: for development
 
 `gulp test:sauce`: to test on saucelabs