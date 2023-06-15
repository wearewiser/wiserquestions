# Wiser Questions

Generated with `npm init nodets@0.0.0`.

## Usage

Loaders build with [csvtojson](https://www.npmjs.com/package/csvtojson), using default structuring, should be fed with CSV files that contain the following structure:

```csv
Question,Type,Answer Labels,Answers,Category 1, Category 2
Question 1,Multiple choice,Yes,Yes,0,1
Question 1,Multiple choice,Yes,Yes,1,-1
Question 2,5-points slider,Strongly Disagree,1,5,0
Question 2,5-points slider,,2,4,1
Question 2,5-points slider,,3,3,2
Question 2,5-points slider,,4,2,3
Question 2,5-points slider,Strongly Agree,5,1,5
```
> **Note**
>
> Available _Type_ values are "Multiple choice" and "5-points slider"
## Scripts

### npm start
Builds the script and runs it. Watches the project directory for changes, and reruns the script when file changes are detected.

### npm run build
Builds the project and outputs it to the `./dist/` directory. Bundled with webpack and outputs a single executable.

### npm run lint
Runs the linter.

### npm run test
Runs the unit tests.

### npm run test:watch
Runs the unit tests with watchers on the directory. Reruns when file changes are detected.

### npm run coverage
Generates a coverage report.

### npm run tsc
Builds the project and outputs it to the `./dist/` directory. Compiled with TypeScript and outputs JavaScript files.

### npm run clean
Cleans the project directory of all compilation artifacts.

### npm run docs
Generates the TSDocs for the current project.
