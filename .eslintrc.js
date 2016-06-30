module.exports = {
	'env': {
		'node': true,
		'commonjs': true,
		'es6': true,
		'mocha': true
	},
	'extends': 'eslint:recommended',
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		"no-console": "off"
	}
};