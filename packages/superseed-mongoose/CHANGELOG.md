# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.1.0...@superseed/mongoose@3.0.0) (2019-08-18)


### Features

* **mongoose:** version 3.0.0 ([fe60aa3](https://github.com/Natural-Intelligence/superseed/commit/fe60aa3))


### BREAKING CHANGES

* **mongoose:** construct signature, ignore replaced by skip, array
item generator removed

Changes
- Removed mongoose dependency. Package can run with version 4.x and 5.x
of mongoose.
- Replaced mongoose-dummy with fakingoose
- constructor  now receives 2 arguments (the modelName argument was
removed)
  - model: mongoose model or schema
- fixed embed documents bug
- removed ignore
- added skip option to field options
- removed support for phone and address types






# [2.1.0](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.0.5...@superseed/mongoose@2.1.0) (2019-08-15)


### Features

* **mongoose:** stop using deprecated BaseMockGenerator ([606bc01](https://github.com/Natural-Intelligence/superseed/commit/606bc01))





## [2.0.5](https://github.com/Natural-Intelligence/superseed/compare/@superseed/mongoose@2.0.4...@superseed/mongoose@2.0.5) (2019-08-15)

**Note:** Version bump only for package @superseed/mongoose




## 2.0.4 - 2.0.4 (2019-08-15)

**Note:** Version bump only for package @superseed/mongoose



# 2.0.2

Issue fix: https://github.com/Natural-Intelligence/superseed/issues/10



# 2.0.0

Support @superseed/core 2.0.0



# 1.1.0 (2019-06-26)

Added support of custom generator function
